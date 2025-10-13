const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { connectDB } = require('./config/database.js');

// Import routes
const authRoutes = require('./routes/auth.js');
const growthRoutes = require('./routes/growth.js');
const businessAccountRoutes = require('./routes/businessAccounts.js');
const virtualCardRoutes = require('./routes/virtualCards.js');
const walletRoutesNew = require('./routes/wallets.js');
const gamificationRoutes = require('./routes/gamification.js');
const stripeRoutes = require('./routes/stripe.js');
const moonpayRoutes = require('./routes/moonpay.js');
const moonpayWebhookRoutes = require('./routes/moonpayWebhook.js');
const aiRoutes = require('./routes/ai.js'); // Import the new AI route
const transactionAnalysisRoutes = require('./routes/transactionAnalysis.js');

const app = express();

// Connect to MongoDB
connectDB();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
