# Real-Time Admin Panel Infrastructure

This document describes the real-time update system implementation for the admin panel, providing live updates for analytics dashboard, content status changes, user activity notifications, and settings updates.

## Architecture Overview

The system uses WebSockets as the primary communication protocol for real-time updates, providing better scalability and lower latency compared to polling mechanisms.

### Core Components

1. **WebSocket Server** (`src/lib/websocket/WebSocketServer.ts`)
   - Manages WebSocket connections with authentication
   - Handles client subscriptions and message broadcasting
   - Implements connection pooling and heartbeat monitoring

2. **Event Emitter** (`src/lib/websocket/EventEmitter.ts`)
   - Provides typed methods for emitting different event types
   - Handles event broadcasting to subscribed clients
   - Supports priority-based event delivery

3. **Event Schema** (`src/lib/models/RealTimeEvent.ts`)
   - Defines event types and validation schemas
   - Supports analytics, content, user, settings, and system events

4. **Client Hooks** (`src/hooks/useWebSocket.ts`)
   - React hooks for WebSocket connections
   - Automatic reconnection and subscription management
   - Specialized hooks for different event categories

5. **Connection Pool** (`src/lib/websocket/WebSocketPool.ts`)
   - Manages multiple WebSocket server instances
   - Load balancing and resource optimization

## Event Types

### Analytics Events
- `analytics.new_activity` - New user activity recorded
- `analytics.traffic_update` - Traffic metrics updated
- `analytics.performance_update` - Performance metrics updated
- `analytics.chart_update` - Chart data refreshed

### Content Events
- `content.created` - New content created
- `content.updated` - Content modified
- `content.deleted` - Content removed
- `content.status_changed` - Content status updated
- `content.published` - Content published
- `content.unpublished` - Content unpublished

### User Activity Events
- `user.login` - User logged in
- `user.logout` - User logged out
- `user.registered` - New user registered
- `user.profile_updated` - User profile changed
- `user.password_changed` - User password updated

### Settings Events
- `settings.updated` - Settings modified
- `settings.backup_created` - Backup created
- `settings.backup_restored` - Backup restored

### Project Events
- `project.created` - New project created
- `project.updated` - Project modified
- `project.deleted` - Project removed
- `project.status_changed` - Project status updated

### System Events
- `system.health_check` - System health status
- `system.error` - System error occurred
- `system.maintenance` - Maintenance notification

## Usage

### Starting the WebSocket Server

```bash
# Development
npm run websocket

# Production (set WEBSOCKET_PORT environment variable)
WEBSOCKET_PORT=8080 npm run websocket
```

### Server-Side Event Emission

```typescript
import { getEventEmitter } from '@/lib/websocket';

// Emit analytics activity
await getEventEmitter().emitAnalyticsActivity({
  activityId: '123',
  eventType: 'page_view',
  message: 'Page visited: /dashboard',
  details: 'New York, US',
  timeAgo: 'Just now',
  device: 'desktop',
  location: 'New York, US',
  timestamp: new Date()
});

// Emit content update
await getEventEmitter().emitContentUpdated({
  contentId: '456',
  title: 'Updated Blog Post',
  type: 'blog',
  status: 'published',
  authorId: '789',
  updatedAt: new Date()
});
```

### Client-Side Usage

```typescript
'use client';

import { useAnalyticsEvents, useContentEvents } from '@/hooks/useWebSocket';

function AnalyticsDashboard() {
  const { events: analyticsEvents, isConnected } = useAnalyticsEvents({
    token: 'your-jwt-token' // From authentication
  });

  if (!isConnected) {
    return <div>Connecting to real-time updates...</div>;
  }

  return (
    <div>
      {analyticsEvents.map(event => (
        <div key={event.id}>
          {event.message}
        </div>
      ))}
    </div>
  );
}
```

### Advanced Client Usage

```typescript
'use client';

import { useWebSocket } from '@/hooks/useWebSocket';

function CustomRealTimeComponent() {
  const {
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe
  } = useWebSocket({
    token: 'your-jwt-token',
    subscriptions: ['analytics.new_activity', 'content.updated']
  });

  // Subscribe to additional events
  useEffect(() => {
    const subscriptionId = subscribe(['settings.updated'], {
      settingKey: 'theme' // Filter for theme settings only
    });

    return () => unsubscribe(subscriptionId);
  }, [subscribe, unsubscribe]);
}
```

## Authentication

WebSocket connections require authentication via JWT tokens passed as query parameters:

```
ws://localhost:8080?token=your-jwt-token
```

The server validates tokens using the existing admin authentication system.

## Connection Management

- **Heartbeat**: 30-second ping/pong for connection health
- **Timeout**: 60-second connection timeout for stale connections
- **Reconnection**: Client-side automatic reconnection with exponential backoff
- **Pooling**: Server-side connection pooling for resource optimization

## Scaling Considerations

- **Horizontal Scaling**: Use WebSocket pool for multiple server instances
- **Load Balancing**: Distribute connections across server instances
- **Message Filtering**: Clients subscribe only to relevant events
- **Priority System**: Critical events prioritized over routine updates

## Integration Points

The system integrates with existing admin panel APIs:

- **Analytics API**: Trigger events when new data is recorded
- **Content API**: Emit events on CRUD operations
- **User API**: Notify on user activities
- **Settings API**: Broadcast configuration changes

## Monitoring

Connection statistics are available via the WebSocket server:

```typescript
import { getWebSocketServer } from '@/lib/websocket';

const stats = getWebSocketServer().getStats();
// { totalConnections: 5, activeSubscriptions: 15 }
```

## Error Handling

- Invalid messages are rejected with error responses
- Authentication failures close connections immediately
- Network errors trigger automatic reconnection
- Server errors are logged and don't crash the system

## Next Steps

1. **Frontend Integration**: Connect React components to WebSocket events
2. **Database Triggers**: Add event emission to database operations
3. **Metrics**: Implement monitoring and alerting
4. **Testing**: Add comprehensive test coverage
5. **Production Deployment**: Configure for production environment