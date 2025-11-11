import { z } from 'zod';

// Event types for different admin panel areas
export type EventType =
  // Analytics events
  | 'analytics.new_activity'
  | 'analytics.traffic_update'
  | 'analytics.performance_update'
  | 'analytics.chart_update'
  // Content events
  | 'content.created'
  | 'content.updated'
  | 'content.deleted'
  | 'content.status_changed'
  | 'content.published'
  | 'content.unpublished'
  // User activity events
  | 'user.login'
  | 'user.logout'
  | 'user.registered'
  | 'user.profile_updated'
  | 'user.password_changed'
  // Settings events
  | 'settings.updated'
  | 'settings.backup_created'
  | 'settings.backup_restored'
  // Project events
  | 'project.created'
  | 'project.updated'
  | 'project.deleted'
  | 'project.status_changed'
  // General system events
  | 'system.health_check'
  | 'system.error'
  | 'system.maintenance';

// Base event interface
export interface IRealTimeEvent {
  id: string;
  type: EventType;
  data: Record<string, any>;
  timestamp: Date;
  source: string; // API endpoint, service, or component that triggered the event
  userId?: string; // Admin user ID if applicable
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Event schema validation
export const RealTimeEventValidationSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    // Analytics
    'analytics.new_activity',
    'analytics.traffic_update',
    'analytics.performance_update',
    'analytics.chart_update',
    // Content
    'content.created',
    'content.updated',
    'content.deleted',
    'content.status_changed',
    'content.published',
    'content.unpublished',
    // User
    'user.login',
    'user.logout',
    'user.registered',
    'user.profile_updated',
    'user.password_changed',
    // Settings
    'settings.updated',
    'settings.backup_created',
    'settings.backup_restored',
    // Projects
    'project.created',
    'project.updated',
    'project.deleted',
    'project.status_changed',
    // System
    'system.health_check',
    'system.error',
    'system.maintenance'
  ]),
  data: z.record(z.string(), z.unknown()),
  timestamp: z.date(),
  source: z.string().min(1),
  userId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical'])
});

// WebSocket message types
export interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'event' | 'ping' | 'pong' | 'auth';
  payload?: any;
}

export const WSMessageSchema = z.object({
  type: z.enum(['subscribe', 'unsubscribe', 'event', 'ping', 'pong', 'auth']),
  payload: z.unknown().optional()
});

// Subscription types for clients
export interface Subscription {
  id: string;
  eventTypes: EventType[];
  filters?: Record<string, any>;
}

// Analytics event data schemas
export const AnalyticsActivityDataSchema = z.object({
  activityId: z.string(),
  eventType: z.string(),
  message: z.string(),
  details: z.string(),
  timeAgo: z.string(),
  device: z.string(),
  location: z.string(),
  timestamp: z.date()
});

export const AnalyticsTrafficDataSchema = z.object({
  totalVisitors: z.number(),
  pageViews: z.number(),
  uniqueVisitors: z.number(),
  bounceRate: z.number(),
  avgSessionDuration: z.number(),
  topPages: z.array(z.object({
    path: z.string(),
    views: z.number()
  }))
});

export const AnalyticsPerformanceDataSchema = z.object({
  responseTime: z.number(),
  errorRate: z.number(),
  uptime: z.number(),
  throughput: z.number()
});

// Content event data schemas
export const ContentDataSchema = z.object({
  contentId: z.string(),
  title: z.string(),
  type: z.string(),
  status: z.string(),
  authorId: z.string(),
  updatedAt: z.date()
});

// User event data schemas
export const UserActivityDataSchema = z.object({
  userId: z.string(),
  email: z.string(),
  action: z.string(),
  ipAddress: z.string().optional(),
  timestamp: z.date()
});

// Settings event data schemas
export const SettingsDataSchema = z.object({
  settingKey: z.string(),
  oldValue: z.unknown().optional(),
  newValue: z.unknown(),
  updatedBy: z.string()
});

// Project event data schemas
export const ProjectDataSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  status: z.string(),
  updatedAt: z.date()
});

// System event data schemas
export const SystemHealthDataSchema = z.object({
  status: z.enum(['healthy', 'warning', 'critical']),
  uptime: z.number(),
  memoryUsage: z.number(),
  cpuUsage: z.number(),
  errors: z.array(z.object({
    message: z.string(),
    timestamp: z.date()
  }))
});