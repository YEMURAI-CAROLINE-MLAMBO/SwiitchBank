// Core Node.js modules
import http from 'http';

// NPM dependencies
import express from 'express';
import dotenv from 'dotenv';
import { errors } from 'celebrate';

// Load environment variables
dotenv.config({ path: '../.env' });

// Local modules
import { setupMiddleware } from './middleware/firewall.js';
import connectDatabase from './config/database.js';
import logger from './utils/logger.js';
import startWebSocketServer from '../websocket.js';
import cronService from './services/cronService.js';
import config from './config/appConfig.js';
import allRoutes from './routes/index.js';

const app = express();

// Setup Middleware
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
setupMiddleware(app);

// API Routes
app.use('/api', allRoutes);

// Health check with branding
app.get('/api/health', (req, res) => {
  res.json({
    app: config.appName,
    tagline: config.tagline,
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Celebrate error handler
app.use(errors());

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

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
