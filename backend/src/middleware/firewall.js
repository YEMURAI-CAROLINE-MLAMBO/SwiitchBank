import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import morgan from 'morgan';
import express from 'express';
import { InputSanitizer } from '../security/InputSanitizer.js';
import requestCounter from './requestCounter.js';
import { transactionMiddleware } from './transactionMiddleware.js';

// Define the sanitizer middleware
const sanitizerMiddleware = (req, res, next) => {
  const sanitizer = req.app.get('sanitizer') || InputSanitizer;
  req.body = sanitizer.sanitizeInput(req.body);
  req.query = sanitizer.sanitizeInput(req.query);
  req.params = sanitizer.sanitizeInput(req.params);
  next();
};

export const setupMiddleware = (app) => {
  // Core Middleware
  app.use(express.urlencoded({ extended: true }));

  // Security Middleware
  app.use(helmet());
  app.use(sanitizerMiddleware);

  // Rate Limiting Middleware (only in non-test environments)
  if (process.env.NODE_ENV !== 'test') {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    redisClient.connect().catch(console.error);

    const generalRateLimiter = rateLimit({
      store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
      }),
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP',
    });

    const authRateLimiter = rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 10,
      skipSuccessfulRequests: true,
      skip: (req) => !req.path.includes('/auth/'),
    });

    app.use(generalRateLimiter);
    app.use(authRateLimiter);
  }

  // Logging Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Custom Middleware
  app.use('/api/', requestCounter);
  app.use('/api/transactions', transactionMiddleware);
};
