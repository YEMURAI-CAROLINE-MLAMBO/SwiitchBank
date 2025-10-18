import express from 'express';
import { setupMiddleware } from './middleware/middleware.js';
import authRoutes from './routes/auth.js';
import businessAccountRoutes from './routes/businessAccounts.js';
import virtualCardRoutes from './routes/virtualCards.js';
import walletRoutesNew from './routes/wallets.js';
import stripeRoutes from './routes/stripe.js';
import sophiaRoutes from './routes/sophia.js';
import transactionAnalysisRoutes from './routes/transactionAnalysis.js';
import bridgeRoutes from './routes/bridgeRoutes.js';
import frameworkRoutes from './routes/framework.js';
import qrRoutes from './routes/qr.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import config from './config/config.js';

const app = express();

// Setup Middleware
setupMiddleware(app);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-accounts', businessAccountRoutes);
app.use('/api/virtual-cards', virtualCardRoutes);
app.use('/api/wallets', walletRoutesNew);
app.use('/api/stripe', stripeRoutes);
app.use('/api/sophia', sophiaRoutes);
app.use('/api/transaction-analysis', transactionAnalysisRoutes);
app.use('/api/bridge', bridgeRoutes);
app.use('/api/framework', frameworkRoutes);
app.use('/api/v1/qr', qrRoutes);
app.use('/api/exchange', exchangeRoutes);

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

export default app;
