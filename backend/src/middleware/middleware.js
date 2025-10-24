import morgan from 'morgan';
import express from 'express';
import requestCounter from './requestCounter.js';
import { transactionMiddleware } from './transactionMiddleware.js';
import { securityMiddleware } from './firewall.js';


export const setupMiddleware = (app) => {
  // Core Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security Middleware
  app.use(securityMiddleware);

  // Logging Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Custom Middleware
  app.use('/api/', requestCounter);
  app.use('/api/transactions', transactionMiddleware);
};
