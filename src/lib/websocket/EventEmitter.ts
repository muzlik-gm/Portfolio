import { getWebSocketServer } from './WebSocketServer';
import {
  IRealTimeEvent,
  EventType,
  AnalyticsActivityDataSchema,
  AnalyticsTrafficDataSchema,
  AnalyticsPerformanceDataSchema,
  ContentDataSchema,
  UserActivityDataSchema,
  SettingsDataSchema,
  ProjectDataSchema,
  SystemHealthDataSchema
} from '@/lib/models/RealTimeEvent';
import { randomUUID } from 'crypto';

// Event emitter utility for broadcasting events to connected WebSocket clients
export class EventEmitter {
  private wsServer = getWebSocketServer();

  // Analytics events
  async emitAnalyticsActivity(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'analytics.new_activity',
      data,
      timestamp: new Date(),
      source: 'analytics-service',
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitAnalyticsTrafficUpdate(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'analytics.traffic_update',
      data,
      timestamp: new Date(),
      source: 'analytics-service',
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitAnalyticsPerformanceUpdate(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'analytics.performance_update',
      data,
      timestamp: new Date(),
      source: 'analytics-service',
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  async emitAnalyticsChartUpdate(data: Record<string, any>): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'analytics.chart_update',
      data,
      timestamp: new Date(),
      source: 'analytics-service',
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  // Content events
  async emitContentCreated(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'content.created',
      data,
      timestamp: new Date(),
      source: 'content-service',
      userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitContentUpdated(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'content.updated',
      data,
      timestamp: new Date(),
      source: 'content-service',
      userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitContentDeleted(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'content.deleted',
      data,
      timestamp: new Date(),
      source: 'content-service',
      userId,
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  async emitContentStatusChanged(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'content.status_changed',
      data,
      timestamp: new Date(),
      source: 'content-service',
      userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitContentPublished(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'content.published',
      data,
      timestamp: new Date(),
      source: 'content-service',
      userId,
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  async emitContentUnpublished(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'content.unpublished',
      data,
      timestamp: new Date(),
      source: 'content-service',
      userId,
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  // User activity events
  async emitUserLogin(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'user.login',
      data,
      timestamp: new Date(),
      source: 'auth-service',
      userId: data.userId,
      priority: 'low'
    };

    this.wsServer.broadcast(event);
  }

  async emitUserLogout(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'user.logout',
      data,
      timestamp: new Date(),
      source: 'auth-service',
      userId: data.userId,
      priority: 'low'
    };

    this.wsServer.broadcast(event);
  }

  async emitUserRegistered(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'user.registered',
      data,
      timestamp: new Date(),
      source: 'auth-service',
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  async emitUserProfileUpdated(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'user.profile_updated',
      data,
      timestamp: new Date(),
      source: 'user-service',
      userId: data.userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitUserPasswordChanged(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'user.password_changed',
      data,
      timestamp: new Date(),
      source: 'auth-service',
      userId: data.userId,
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  // Settings events
  async emitSettingsUpdated(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'settings.updated',
      data,
      timestamp: new Date(),
      source: 'settings-service',
      userId,
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  async emitSettingsBackupCreated(data: { backupId: string; size: number }, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'settings.backup_created',
      data,
      timestamp: new Date(),
      source: 'settings-service',
      userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitSettingsBackupRestored(data: { backupId: string; restoredBy: string }, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'settings.backup_restored',
      data,
      timestamp: new Date(),
      source: 'settings-service',
      userId,
      priority: 'critical'
    };

    this.wsServer.broadcast(event);
  }

  // Project events
  async emitProjectCreated(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'project.created',
      data,
      timestamp: new Date(),
      source: 'project-service',
      userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitProjectUpdated(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'project.updated',
      data,
      timestamp: new Date(),
      source: 'project-service',
      userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitProjectDeleted(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'project.deleted',
      data,
      timestamp: new Date(),
      source: 'project-service',
      userId,
      priority: 'high'
    };

    this.wsServer.broadcast(event);
  }

  async emitProjectStatusChanged(data: any, userId?: string): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'project.status_changed',
      data,
      timestamp: new Date(),
      source: 'project-service',
      userId,
      priority: 'medium'
    };

    this.wsServer.broadcast(event);
  }

  // System events
  async emitSystemHealthCheck(data: any): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'system.health_check',
      data,
      timestamp: new Date(),
      source: 'system-monitor',
      priority: data.status === 'critical' ? 'critical' : 'medium'
    };

    this.wsServer.broadcast(event);
  }

  async emitSystemError(data: { message: string; stack?: string; service: string }): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'system.error',
      data,
      timestamp: new Date(),
      source: data.service,
      priority: 'critical'
    };

    this.wsServer.broadcast(event);
  }

  async emitSystemMaintenance(data: { message: string; estimatedDowntime?: number }): Promise<void> {
    const event: IRealTimeEvent = {
      id: randomUUID(),
      type: 'system.maintenance',
      data,
      timestamp: new Date(),
      source: 'system-admin',
      priority: 'critical'
    };

    this.wsServer.broadcast(event);
  }

  // Generic event emitter for custom events
  async emit(event: IRealTimeEvent): Promise<void> {
    this.wsServer.broadcast(event);
  }
}

// Singleton instance
let eventEmitter: EventEmitter | null = null;

export function getEventEmitter(): EventEmitter {
  if (!eventEmitter) {
    eventEmitter = new EventEmitter();
  }
  return eventEmitter;
}