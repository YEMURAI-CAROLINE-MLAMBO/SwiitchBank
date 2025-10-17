import express from 'express';
import CrashAnalytics from './analytics/CrashAnalytics.js';
import AutoRecovery from './recovery/AutoRecovery.js';
import MemorySafety from './security/MemorySafety.js';
import requestCounter from './middleware/requestCounter.js';
import { apiLimiter, aiLimiter } from './middleware/rateLimiter.js';
import performanceMiddleware from '../monitoring/performance.js';
import { securityMiddleware } from './middleware/SecurityMiddleware.js';
import { analyzeTransaction, protectLogin } from './middleware/security.js';
import authRoutes from './routes/auth.js';
import businessAccountRoutes from './routes/businessAccounts.js';
import virtualCardRoutes from './routes/virtualCards.js';
import walletRoutesNew from './routes/wallets.js';
import stripeRoutes from './routes/stripe.js';
import sophiaRoutes from './routes/sophia.js'; // Import the new Sophia route
import transactionAnalysisRoutes from './routes/transactionAnalysis.js';
import bridgeRoutes from './routes/bridgeRoutes.js';
import frameworkRoutes from './routes/framework.js';
import qrRoutes from './routes/qr.js';
import config from './config/appConfig.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityMiddleware);
app.use(performanceMiddleware);

// Use Redis-based rate limiting only in non-test environments
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', apiLimiter);
}

app.use('/api/', requestCounter); // Add the request counter middleware

// API Routes
app.use('/api/auth', protectLogin, authRoutes);
app.use('/api/business-accounts', businessAccountRoutes);
app.use('/api/virtual-cards', analyzeTransaction, virtualCardRoutes);
app.use('/api/wallets', analyzeTransaction, walletRoutesNew);
app.use('/api/stripe', analyzeTransaction, stripeRoutes);
app.use('/api/sophia', sophiaRoutes); // Add the Sophia route to the app
app.use('/api/transaction-analysis', analyzeTransaction, transactionAnalysisRoutes);
app.use('/api/bridge', bridgeRoutes);
app.use('/api/framework', frameworkRoutes);
app.use('/api/v1/qr', qrRoutes);

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
