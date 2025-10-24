import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import http from 'http';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';
import logger from './src/utils/logger.js';
import startWebSocketServer from './websocket.js';
import config from './src/config/config.js';

// Main function to start the server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase(process.env.MONGODB_URI);
    logger.info('Database connected successfully');

    const server = http.createServer(app);
    const port = config.port || 5001;

    server.listen(port, () => {
      logger.info(`Swiitch Bank API Server running on port ${port}`);
      // Initialize WebSocket server
      startWebSocketServer(server);

      // Start the cron service
      import cronService from './src/services/cronService.js';
      cronService.start();
    });

    process.on('uncaughtException', (err) => {
        logger.error('Uncaught Exception:', err);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
