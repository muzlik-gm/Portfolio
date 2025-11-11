// WebSocket infrastructure exports
export { WebSocketServer, getWebSocketServer, initializeWebSocketServer } from './WebSocketServer';
export { EventEmitter, getEventEmitter } from './EventEmitter';

// Re-export types and schemas
export type {
  IRealTimeEvent,
  EventType,
  WSMessage,
  Subscription
} from '../models/RealTimeEvent';

export {
  RealTimeEventValidationSchema,
  WSMessageSchema,
  AnalyticsActivityDataSchema,
  AnalyticsTrafficDataSchema,
  AnalyticsPerformanceDataSchema,
  ContentDataSchema,
  UserActivityDataSchema,
  SettingsDataSchema,
  ProjectDataSchema,
  SystemHealthDataSchema
} from '../models/RealTimeEvent';