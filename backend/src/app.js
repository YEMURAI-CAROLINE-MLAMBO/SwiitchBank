const express = require('express');
const { connectDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const growthRoutes = require('./routes/growth');
const businessAccountRoutes = require('./routes/businessAccounts');
const virtualCardRoutes = require('./routes/virtualCards');
const walletRoutesNew = require('./routes/wallets');
const gamificationRoutes = require('./routes/gamification');

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
