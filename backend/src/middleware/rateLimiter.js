import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 - allow more requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific limiters for different endpoints
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Stricter for expensive operations
  message: {
    error: 'Too many requests to this endpoint'
  }
});

export const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit AI calls to prevent API quota exhaustion
  message: {
    error: 'Too many AI requests, please wait a moment'
  }
});
