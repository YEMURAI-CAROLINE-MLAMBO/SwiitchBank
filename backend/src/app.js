/**
 * @file Express application configuration for the Swiitch Bank MVP.
 * @description Sets up and configures the Express application with various middleware, routes, and error handling.
 */
/**
 * Swiitch Bank MVP - Express Application Configuration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const walletRoutes = require('./routes/wallet');
const kycRoutes = require('./routes/kyc');
const transactionRoutes = require('./routes/transactions');
const growthRoutes = require('./routes/growth');
const businessAccountRoutes = require('./routes/businessAccounts');
const virtualCardRoutes = require('./routes/virtualCards');
const walletRoutesNew = require('./routes/wallets'); // Renamed to avoid conflict if 'wallet' is used elsewhere
// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Security middleware
/**
 * @description Configures security headers using Helmet.
 * @see {@link https://helmetjs.github.io/}
 */
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
/**
 * @description Configures Cross-Origin Resource Sharing (CORS) for allowing requests from specified origins.
 * @see {@link https://www.npmjs.com/package/cors}
 */
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
/**
 * @description Configures rate limiting to protect against brute-force attacks.
 * @see {@link https://www.npmjs.com/package/express-rate-limit}
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit requests per window
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
/**
 * @description Parses incoming JSON payloads.
 * @see {@link https://expressjs.com/en/api.html#express.json}
 */
app.use(express.json({ limit: '10mb' }));
/**
 * @description Parses incoming URL-encoded payloads.
 * @see {@link https://expressjs.com/en/api.html#express.urlencoded}
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Logging
/** @description Configures HTTP request logging using Morgan and sends output to the custom logger. */
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
/**
 * @description Mounts the imported route handlers under specific API paths.
 */
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes); // Assuming 'cardRoutes' is for physical cards or a different card system
app.use('/api/wallet', walletRoutes);
app.use('/api/user/kyc', kycRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/business-accounts', businessAccountRoutes);
app.use('/api/virtual-cards', virtualCardRoutes);
app.use('/api/wallets', walletRoutesNew); // Mounted the new wallet routes

// API documentation endpoint (mock)
/**
 * @description Mock endpoint for API documentation.
 * TODO: Replace with a proper documentation generation tool like Swagger/OpenAPI.
 * @route GET /api/docs
 * @returns {object} JSON object containing API documentation information.
 */
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
/**
 * @description Middleware to handle 404 (Not Found) errors.
 * @see {@link backend/src/middleware/errorHandler.js}
 */
app.use(notFound);
/**
 * @description General error handling middleware.
 * @see {@link backend/src/middleware/errorHandler.js}
 */
app.use(errorHandler);

module.exports = app;