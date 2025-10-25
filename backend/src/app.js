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
import config from './config/config.js';

// Route imports
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/accounts.js';
import sophiaRoutes from './routes/sophia.js';
import transactionRoutes from './routes/transactions.js';
import bridgeRoutes from './routes/bridgeRoutes.js';
import frameworkRoutes from './routes/framework.js';
import qrRoutes from './routes/qr.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import paymentRoutes from './routes/payments.js';
import moonpayRoutes from './routes/moonpay.js';
import ticketRoutes from './routes/ticketRoutes.js';
import stripeRoutes from './routes/stripe.js';
import dashboardRoutes from './routes/dashboard.js';
import userRoutes from './routes/user.js';
import referralRoutes from './routes/referral.js';
import settingsRoutes from './routes/settings.js';
import swiitchPartyRoutes from './routes/swiitchPartyRoutes.js';


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
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/sophia', sophiaRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/bridge', bridgeRoutes);
app.use('/api/framework', frameworkRoutes);
app.use('/api/v1/qr', qrRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/moonpay', moonpayRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/swiitch-party', swiitchPartyRoutes);

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
