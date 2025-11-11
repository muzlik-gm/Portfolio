'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { IRealTimeEvent, WSMessage, EventType } from '@/lib/models/RealTimeEvent';

interface UseWebSocketOptions {
  url?: string;
  token?: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  subscriptions?: EventType[];
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: IRealTimeEvent | null;
  connectionError: string | null;
  subscribe: (eventTypes: EventType[], filters?: Record<string, any>) => void;
  unsubscribe: (subscriptionId: string) => void;
  reconnect: () => void;
  disconnect: () => void;
  sendMessage: (message: WSMessage) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    url = `ws://localhost:8080?token=${options.token || ''}`,
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    subscriptions = []
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<IRealTimeEvent | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || isConnecting) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        reconnectCountRef.current = 0;

        // Re-subscribe to previous subscriptions
        if (subscriptions.length > 0) {
          sendMessage({
            type: 'subscribe',
            payload: {
              eventTypes: subscriptions,
              id: `auto_sub_${Date.now()}`
            }
          });
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);

          if (message.type === 'event' && message.payload) {
            setLastMessage(message.payload as IRealTimeEvent);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        // Attempt reconnection if not a manual close
        if (event.code !== 1000 && reconnectCountRef.current < reconnectAttempts) {
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection failed');
        setIsConnecting(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to connect');
      setIsConnecting(false);
      scheduleReconnect();
    }
  }, [url, subscriptions, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectCountRef.current = 0;
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectCountRef.current += 1;
    const delay = reconnectInterval * Math.pow(2, reconnectCountRef.current - 1); // Exponential backoff

    console.log(`Scheduling reconnection attempt ${reconnectCountRef.current}/${reconnectAttempts} in ${delay}ms`);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [connect, reconnectAttempts, reconnectInterval]);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectCountRef.current = 0;
    connect();
  }, [disconnect, connect]);

  const sendMessage = useCallback((message: WSMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    }
  }, []);

  const subscribe = useCallback((eventTypes: EventType[], filters?: Record<string, any>) => {
    const subscriptionId = `sub_${Date.now()}_${Math.random()}`;
    subscriptionsRef.current.add(subscriptionId);

    sendMessage({
      type: 'subscribe',
      payload: {
        id: subscriptionId,
        eventTypes,
        filters
      }
    });
  }, [sendMessage]);

  const unsubscribe = useCallback((subscriptionId: string) => {
    subscriptionsRef.current.delete(subscriptionId);

    sendMessage({
      type: 'unsubscribe',
      payload: {
        subscriptionId
      }
    });
  }, [sendMessage]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    lastMessage,
    connectionError,
    subscribe,
    unsubscribe,
    reconnect,
    disconnect,
    sendMessage
  };
}

// Hook for specific event types with automatic subscription management
export function useWebSocketEvents<T = any>(
  eventTypes: EventType[],
  options: UseWebSocketOptions = {}
): {
  events: T[];
  isConnected: boolean;
  error: string | null;
  clearEvents: () => void;
} {
  const [events, setEvents] = useState<T[]>([]);
  const { lastMessage, isConnected, connectionError, subscribe } = useWebSocket({
    ...options,
    subscriptions: eventTypes
  });

  useEffect(() => {
    if (lastMessage && eventTypes.includes(lastMessage.type)) {
      setEvents(prev => [...prev, lastMessage.data as T]);
    }
  }, [lastMessage, eventTypes]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    isConnected,
    error: connectionError,
    clearEvents
  };
}

// Hook for analytics events
export function useAnalyticsEvents(options: UseWebSocketOptions = {}) {
  return useWebSocketEvents([
    'analytics.new_activity',
    'analytics.traffic_update',
    'analytics.performance_update',
    'analytics.chart_update'
  ], options);
}

// Hook for content events
export function useContentEvents(options: UseWebSocketOptions = {}) {
  return useWebSocketEvents([
    'content.created',
    'content.updated',
    'content.deleted',
    'content.status_changed',
    'content.published',
    'content.unpublished'
  ], options);
}

// Hook for user activity events
export function useUserActivityEvents(options: UseWebSocketOptions = {}) {
  return useWebSocketEvents([
    'user.login',
    'user.logout',
    'user.registered',
    'user.profile_updated',
    'user.password_changed'
  ], options);
}

// Hook for settings events
export function useSettingsEvents(options: UseWebSocketOptions = {}) {
  return useWebSocketEvents([
    'settings.updated',
    'settings.backup_created',
    'settings.backup_restored'
  ], options);
}

// Hook for system events
export function useSystemEvents(options: UseWebSocketOptions = {}) {
  return useWebSocketEvents([
    'system.health_check',
    'system.error',
    'system.maintenance'
  ], options);
}