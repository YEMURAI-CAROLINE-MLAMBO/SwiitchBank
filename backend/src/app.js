import express from 'express';

// Import routes
import authRoutes from './routes/auth.js';
import businessAccountRoutes from './routes/businessAccounts.js';
import virtualCardRoutes from './routes/virtualCards.js';
import walletRoutesNew from './routes/wallets.js';
import stripeRoutes from './routes/stripe.js';
import sophiaRoutes from './routes/sophia.js'; // Import the new Sophia route
import transactionAnalysisRoutes from './routes/transactionAnalysis.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-accounts', businessAccountRoutes);
app.use('/api/virtual-cards', virtualCardRoutes);
app.use('/api/wallets', walletRoutesNew);
app.use('/api/stripe', stripeRoutes);
app.use('/api/sophia', sophiaRoutes); // Add the Sophia route to the app
app.use('/api/transaction-analysis', transactionAnalysisRoutes);

export default app;
