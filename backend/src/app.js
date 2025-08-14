/**
 * Swiitch Bank MVP - Express Application Configuration
 * Configures middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const walletRoutes = require('./routes/wallet');
const kycRoutes = require('./routes/kyc');
const transactionRoutes = require('./routes/transactions');
const growthRoutes = require('./routes/growth');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit requests per window
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Swiitch Bank API',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/user/kyc', kycRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/growth', growthRoutes);

// API documentation endpoint (mock)
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'Swiitch Bank API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'POST /api/auth/logout',
        'GET /api/auth/profile'
      ],
      cards: [
        'POST /api/cards/issue',
        'GET /api/cards',
        'GET /api/cards/:id',
        'PUT /api/cards/:id/status'
      ],
      wallet: [
        'GET /api/wallet/balance',
        'POST /api/wallet/topup',
        'POST /api/wallet/convert'
      ],
      kyc: [
        'POST /api/user/kyc/submit',
        'GET /api/user/kyc/status'
      ],
      transactions: [
        'GET /api/transactions',
        'GET /api/transactions/:id'
      ],
      growth: [
        'GET /api/growth/referral',
        'POST /api/growth/referral/apply',
        'POST /api/growth/circle',
        'POST /api/growth/challenge'
      ]
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;