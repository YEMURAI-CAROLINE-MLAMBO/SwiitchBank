import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import { apiLimiter } from './rateLimiter.js';
import requestCounter from './requestCounter.js';
import { securityMiddleware } from './SecurityMiddleware.js';
import { transactionMiddleware } from './transactionMiddleware.js';

export const setupMiddleware = (app) => {
  // Core Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security Middleware
  app.use(helmet());
  app.use(securityMiddleware);

  // Logging Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Rate Limiting Middleware
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api/', apiLimiter);
  }

  // Custom Middleware
  app.use('/api/', requestCounter);
  app.use('/api/transactions', transactionMiddleware);
};
