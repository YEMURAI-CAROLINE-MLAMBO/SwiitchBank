import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { InputSanitizer } from '../security/InputSanitizer.js';

let rateLimitingMiddleware = [];

// Initialize Redis client and rate limiters, but not for tests
if (process.env.NODE_ENV !== 'test') {
  const redisClient = createClient({
    url: process.env.REDIS_URL
  });
  redisClient.connect().catch(console.error);

  const generalRateLimiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
  });

  const authRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    skip: (req) => !req.path.includes('/auth/')
  });

  rateLimitingMiddleware = [generalRateLimiter, authRateLimiter];
}

// Define the sanitizer middleware
const sanitizerMiddleware = (req, res, next) => {
  const sanitizer = req.app.get('sanitizer') || InputSanitizer;
  req.body = sanitizer.sanitizeInput(req.body);
  req.query = sanitizer.sanitizeInput(req.query);
  req.params = sanitizer.sanitizeInput(req.params);
  next();
};

// Build the security middleware array
const baseSecurityMiddleware = [
  helmet(),
  sanitizerMiddleware
];

export const securityMiddleware = [...baseSecurityMiddleware, ...rateLimitingMiddleware];
