/**
 * Swiitch Bank MVP - Main Server Entry Point
 * Initializes Express server with security middleware and API routes
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import http from 'http';
import app from './src/app.js';
import { connectWithRetry, createOptimalIndexes } from './src/config/database.js';
import logger from './src/utils/logger.js';
import startWebSocketServer from './websocket.js';

const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid frontend conflict

async function startServer() {
  try {
    // Connect to database
    await connectWithRetry();
    await createOptimalIndexes();
    logger.info('Database connected successfully');

    const server = http.createServer(app);

    // Initialize WebSocket server
    startWebSocketServer(server);

    // Start server
    server.listen(PORT, () => {
      logger.info(`Swiitch Bank API Server running on port ${PORT}`);
      logger.info(`WebSocket Server initialized.`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`API Base URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
