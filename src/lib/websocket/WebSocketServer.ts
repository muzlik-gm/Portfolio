import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { verifyAdminToken } from '@/lib/auth';
import {
  IRealTimeEvent,
  RealTimeEventValidationSchema,
  WSMessage,
  WSMessageSchema,
  Subscription,
  EventType
} from '@/lib/models/RealTimeEvent';

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  subscriptions: Set<string>;
  lastPing: number;
  filters: Record<string, any>;
}

export class WebSocketServer {
  private wss: WSServer | null = null;
  private clients = new Map<WebSocket, ConnectedClient>();
  private subscriptions = new Map<EventType, Set<WebSocket>>();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly CONNECTION_TIMEOUT = 60000; // 60 seconds

  constructor(private port: number = 8080) {}

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.wss = new WSServer({
        port: this.port,
        perMessageDeflate: false,
        maxPayload: 1024 * 1024 // 1MB max payload
      });

      this.wss.on('connection', this.handleConnection.bind(this));
      this.wss.on('listening', () => {
        console.log(`WebSocket server started on port ${this.port}`);
        this.startHeartbeat();
        resolve();
      });

      this.wss.on('error', (error) => {
        console.error('WebSocket server error:', error);
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }

      if (this.wss) {
        this.wss.close(() => {
          console.log('WebSocket server stopped');
          this.clients.clear();
          this.subscriptions.clear();
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private async handleConnection(ws: WebSocket, request: IncomingMessage): Promise<void> {
    try {
      // Extract token from query parameters or headers
      const url = new URL(request.url || '', 'http://localhost');
      const token = url.searchParams.get('token') || this.extractTokenFromHeaders(request);

      if (!token) {
        console.log('WebSocket connection rejected: No token provided');
        ws.close(1008, 'Authentication required');
        return;
      }

      // Verify admin token
      const adminUser = await verifyAdminToken(token);
      if (!adminUser) {
        console.log('WebSocket connection rejected: Invalid token');
        ws.close(1008, 'Invalid authentication');
        return;
      }

      // Create client record
      const client: ConnectedClient = {
        ws,
        userId: adminUser.username, // AdminUser interface uses username
        subscriptions: new Set(),
        lastPing: Date.now(),
        filters: {}
      };

      this.clients.set(ws, client);
      console.log(`WebSocket client connected: ${adminUser.username} (${adminUser.role})`);

      // Set up event handlers
      ws.on('message', (data) => this.handleMessage(ws, data));
      ws.on('close', () => this.handleDisconnection(ws));
      ws.on('error', (error) => this.handleError(ws, error));
      ws.on('pong', () => this.handlePong(ws));

      // Send welcome message
      this.sendToClient(ws, {
        type: 'event',
        payload: {
          type: 'system.connected',
          data: { message: 'Connected to admin real-time updates' },
          timestamp: new Date(),
          source: 'websocket-server',
          priority: 'low'
        }
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(1011, 'Internal server error');
    }
  }

  private extractTokenFromHeaders(request: IncomingMessage): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  private handleMessage(ws: WebSocket, data: WebSocket.RawData): void {
    try {
      const message = JSON.parse(data.toString()) as WSMessage;
      const validation = WSMessageSchema.safeParse(message);

      if (!validation.success) {
        this.sendToClient(ws, {
          type: 'event',
          payload: {
            type: 'system.error',
            data: { message: 'Invalid message format', details: validation.error.message },
            timestamp: new Date(),
            source: 'websocket-server',
            priority: 'medium'
          }
        });
        return;
      }

      const client = this.clients.get(ws);
      if (!client) return;

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(client, message.payload);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(client, message.payload);
          break;
        case 'ping':
          this.sendToClient(ws, { type: 'pong', payload: { timestamp: Date.now() } });
          break;
        case 'auth':
          // Re-authentication if needed
          break;
      }
    } catch (error) {
      console.error('WebSocket message handling error:', error);
      this.sendToClient(ws, {
        type: 'event',
        payload: {
          type: 'system.error',
          data: { message: 'Failed to process message' },
          timestamp: new Date(),
          source: 'websocket-server',
          priority: 'high'
        }
      });
    }
  }

  private handleSubscribe(client: ConnectedClient, payload: any): void {
    try {
      const subscription: Subscription = {
        id: payload.id || `sub_${Date.now()}_${Math.random()}`,
        eventTypes: payload.eventTypes || [],
        filters: payload.filters || {}
      };

      // Add to client's subscriptions
      client.subscriptions.add(subscription.id);
      client.filters[subscription.id] = subscription.filters;

      // Register with global subscriptions
      for (const eventType of subscription.eventTypes) {
        if (!this.subscriptions.has(eventType)) {
          this.subscriptions.set(eventType, new Set());
        }
        this.subscriptions.get(eventType)!.add(client.ws);
      }

      this.sendToClient(client.ws, {
        type: 'event',
        payload: {
          type: 'system.subscribed',
          data: { subscriptionId: subscription.id, eventTypes: subscription.eventTypes },
          timestamp: new Date(),
          source: 'websocket-server',
          priority: 'low'
        }
      });

    } catch (error) {
      console.error('Subscription error:', error);
    }
  }

  private handleUnsubscribe(client: ConnectedClient, payload: any): void {
    const subscriptionId = payload.subscriptionId;
    if (!subscriptionId || !client.subscriptions.has(subscriptionId)) {
      return;
    }

    client.subscriptions.delete(subscriptionId);
    delete client.filters[subscriptionId];

    // Remove from global subscriptions (cleanup will happen naturally)
    // In a production system, you might want to track which subscriptions
    // map to which event types for efficient cleanup
  }

  private handleDisconnection(ws: WebSocket): void {
    const client = this.clients.get(ws);
    if (client) {
      console.log(`WebSocket client disconnected: ${client.userId}`);
      this.clients.delete(ws);

      // Clean up subscriptions
      for (const [eventType, sockets] of this.subscriptions.entries()) {
        sockets.delete(ws);
        if (sockets.size === 0) {
          this.subscriptions.delete(eventType);
        }
      }
    }
  }

  private handleError(ws: WebSocket, error: Error): void {
    console.error('WebSocket error:', error);
    const client = this.clients.get(ws);
    if (client) {
      this.clients.delete(ws);
    }
  }

  private handlePong(ws: WebSocket): void {
    const client = this.clients.get(ws);
    if (client) {
      client.lastPing = Date.now();
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      for (const [ws, client] of this.clients.entries()) {
        if (now - client.lastPing > this.CONNECTION_TIMEOUT) {
          console.log(`Terminating stale connection for user ${client.userId}`);
          ws.terminate();
          continue;
        }

        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        }
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private sendToClient(ws: WebSocket, message: WSMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message to client:', error);
      }
    }
  }

  // Public API for broadcasting events
  broadcast(event: IRealTimeEvent): void {
    const validation = RealTimeEventValidationSchema.safeParse(event);
    if (!validation.success) {
      console.error('Invalid event format:', validation.error);
      return;
    }

    const subscribers = this.subscriptions.get(event.type);
    if (!subscribers) return;

    const message: WSMessage = {
      type: 'event',
      payload: event
    };

    for (const ws of subscribers) {
      const client = this.clients.get(ws);
      if (client && this.matchesFilters(event, client.filters)) {
        this.sendToClient(ws, message);
      }
    }
  }

  private matchesFilters(event: IRealTimeEvent, filters: Record<string, any>): boolean {
    // Simple filter matching - can be extended based on needs
    for (const [subscriptionId, filter] of Object.entries(filters)) {
      // If any filter doesn't match, skip this client
      // This is a basic implementation - could be more sophisticated
      if (filter.userId && event.userId !== filter.userId) {
        return false;
      }
      // Add more filter types as needed
    }
    return true;
  }

  // Get connection statistics
  getStats(): { totalConnections: number; activeSubscriptions: number } {
    return {
      totalConnections: this.clients.size,
      activeSubscriptions: Array.from(this.subscriptions.values()).reduce((sum, set) => sum + set.size, 0)
    };
  }
}

// Singleton instance
let websocketServer: WebSocketServer | null = null;

export function getWebSocketServer(): WebSocketServer {
  if (!websocketServer) {
    websocketServer = new WebSocketServer();
  }
  return websocketServer;
}

export function initializeWebSocketServer(port?: number): WebSocketServer {
  if (!websocketServer) {
    websocketServer = new WebSocketServer(port);
  }
  return websocketServer;
}