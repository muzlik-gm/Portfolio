import { WebSocketServer } from './WebSocketServer';

interface PoolOptions {
  minConnections?: number;
  maxConnections?: number;
  heartbeatInterval?: number;
  connectionTimeout?: number;
}

interface PooledConnection {
  server: WebSocketServer;
  port: number;
  connections: number;
  lastActivity: number;
  isActive: boolean;
}

export class WebSocketPool {
  private pool: Map<number, PooledConnection> = new Map();
  private nextPort = 8080;
  private readonly MAX_SERVERS = 10;

  constructor(private options: PoolOptions = {}) {
    this.options = {
      minConnections: 1,
      maxConnections: 100,
      heartbeatInterval: 30000,
      connectionTimeout: 300000, // 5 minutes
      ...options
    };
  }

  // Get or create a WebSocket server from the pool
  async getServer(): Promise<WebSocketServer> {
    // Find an available server with capacity
    for (const [port, connection] of this.pool.entries()) {
      if (connection.isActive &&
          connection.connections < (this.options.maxConnections || 100)) {
        connection.connections++;
        connection.lastActivity = Date.now();
        return connection.server;
      }
    }

    // Create a new server if under the limit
    if (this.pool.size < this.MAX_SERVERS) {
      return this.createServer();
    }

    // If all servers are at capacity, return the least loaded one
    let leastLoaded: PooledConnection | null = null;
    for (const connection of this.pool.values()) {
      if (!leastLoaded || connection.connections < leastLoaded.connections) {
        leastLoaded = connection;
      }
    }

    if (leastLoaded) {
      leastLoaded.connections++;
      leastLoaded.lastActivity = Date.now();
      return leastLoaded.server;
    }

    throw new Error('No available WebSocket servers in pool');
  }

  private async createServer(): Promise<WebSocketServer> {
    const port = this.nextPort++;
    const server = new WebSocketServer(port);

    await server.start();

    const pooledConnection: PooledConnection = {
      server,
      port,
      connections: 1,
      lastActivity: Date.now(),
      isActive: true
    };

    this.pool.set(port, pooledConnection);

    // Start cleanup interval for this server
    this.startCleanupInterval(port);

    return server;
  }

  // Release a connection back to the pool
  releaseServer(port: number): void {
    const connection = this.pool.get(port);
    if (connection) {
      connection.connections = Math.max(0, connection.connections - 1);
      connection.lastActivity = Date.now();
    }
  }

  // Start cleanup interval for a specific server
  private startCleanupInterval(port: number): void {
    const interval = setInterval(() => {
      const connection = this.pool.get(port);
      if (!connection) {
        clearInterval(interval);
        return;
      }

      const now = Date.now();

      // Check if server should be cleaned up
      if (connection.connections === 0 &&
          (now - connection.lastActivity) > (this.options.connectionTimeout || 300000)) {
        console.log(`Cleaning up idle WebSocket server on port ${port}`);
        connection.server.stop().then(() => {
          this.pool.delete(port);
        }).catch(console.error);
        clearInterval(interval);
      }
    }, this.options.heartbeatInterval || 30000);
  }

  // Get pool statistics
  getStats(): {
    totalServers: number;
    activeServers: number;
    totalConnections: number;
    servers: Array<{
      port: number;
      connections: number;
      lastActivity: number;
      isActive: boolean;
    }>;
  } {
    const servers = Array.from(this.pool.values()).map(conn => ({
      port: conn.port,
      connections: conn.connections,
      lastActivity: conn.lastActivity,
      isActive: conn.isActive
    }));

    return {
      totalServers: this.pool.size,
      activeServers: servers.filter(s => s.isActive).length,
      totalConnections: servers.reduce((sum, s) => sum + s.connections, 0),
      servers
    };
  }

  // Shutdown all servers in the pool
  async shutdown(): Promise<void> {
    const shutdownPromises = Array.from(this.pool.values()).map(async (connection) => {
      try {
        await connection.server.stop();
      } catch (error) {
        console.error(`Error stopping server on port ${connection.port}:`, error);
      }
    });

    await Promise.all(shutdownPromises);
    this.pool.clear();
  }
}

// Singleton pool instance
let websocketPool: WebSocketPool | null = null;

export function getWebSocketPool(options?: PoolOptions): WebSocketPool {
  if (!websocketPool) {
    websocketPool = new WebSocketPool(options);
  }
  return websocketPool;
}

export function initializeWebSocketPool(options?: PoolOptions): WebSocketPool {
  if (!websocketPool) {
    websocketPool = new WebSocketPool(options);
  }
  return websocketPool;
}