import express from 'express';
import { setupMiddleware } from './middleware/middleware.js';
import { errors } from 'celebrate';
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
import config from './config/config.js';

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
app.use('/api/tickets', ticketRoutes);

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

export default app;
