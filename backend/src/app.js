import 'dotenv/config.js';
import express from 'express';
import { connectDB } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import growthRoutes from './routes/growth.js';
import businessAccountRoutes from './routes/businessAccounts.js';
import virtualCardRoutes from './routes/virtualCards.js';
import walletRoutesNew from './routes/wallets.js';
import gamificationRoutes from './routes/gamification.js';
import stripeRoutes from './routes/stripe.js';
import moonpayRoutes from './routes/moonpay.js';
import moonpayWebhookRoutes from './routes/moonpayWebhook.js';
import aiRoutes from './routes/ai.js'; // Import the new AI route
import transactionAnalysisRoutes from './routes/transactionAnalysis.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/business-accounts', businessAccountRoutes);
app.use('/api/virtual-cards', virtualCardRoutes);
app.use('/api/wallets', walletRoutesNew);
app.use('/api/users', gamificationRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/moonpay', moonpayRoutes);
app.use('/api/moonpay-webhook', moonpayWebhookRoutes);
app.use('/api/ai', aiRoutes); // Add the AI route to the app
app.use('/api/transaction-analysis', transactionAnalysisRoutes);

export default app;
