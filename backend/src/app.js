import express from 'express';
import CrashAnalytics from './analytics/CrashAnalytics.js';
import AutoRecovery from './recovery/AutoRecovery.js';
import MemorySafety from './security/MemorySafety.js';
import requestCounter from './middleware/requestCounter.js';
import { apiLimiter, aiLimiter } from './middleware/rateLimiter.js';
import performanceMiddleware from '../monitoring/performance.js';
import authRoutes from './routes/auth.js';
import businessAccountRoutes from './routes/businessAccounts.js';
import virtualCardRoutes from './routes/virtualCards.js';
import walletRoutesNew from './routes/wallets.js';
import stripeRoutes from './routes/stripe.js';
import sophiaRoutes from './routes/sophia.js'; // Import the new Sophia route
import transactionAnalysisRoutes from './routes/transactionAnalysis.js';
import bridgeRoutes from './routes/bridgeRoutes.js';
import frameworkRoutes from './routes/framework.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(performanceMiddleware);
app.use('/api/', apiLimiter);
app.use('/api/', requestCounter); // Add the request counter middleware

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-accounts', businessAccountRoutes);
app.use('/api/virtual-cards', virtualCardRoutes);
app.use('/api/wallets', walletRoutesNew);
app.use('/api/stripe', stripeRoutes);
app.use('/api/sophia', sophiaRoutes); // Add the Sophia route to the app
app.use('/api/transaction-analysis', transactionAnalysisRoutes);
app.use('/api/bridge', bridgeRoutes);
app.use('/api/framework', frameworkRoutes);

export default app;
