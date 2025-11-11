#!/usr/bin/env node

import { initializeWebSocketServer } from '../lib/websocket/WebSocketServer';

const port = parseInt(process.env.WEBSOCKET_PORT || '8080');

async function startServer() {
  try {
    console.log(`Starting WebSocket server on port ${port}...`);

    const wsServer = initializeWebSocketServer(port);
    await wsServer.start();

    console.log('WebSocket server started successfully');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down gracefully...');
      await wsServer.stop();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down gracefully...');
      await wsServer.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start WebSocket server:', error);
    process.exit(1);
  }
}

startServer();