import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock the 'rate-limit-redis' and 'redis' modules before importing the middleware
jest.unstable_mockModule('rate-limit-redis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    increment: jest.fn().mockResolvedValue({ totalHits: 1, resetTime: new Date() }),
    decrement: jest.fn(),
    resetKey: jest.fn(),
  })),
}));

jest.unstable_mockModule('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(() => Promise.resolve()),
    sendCommand: jest.fn().mockResolvedValue([1, Date.now()]),
  })),
}));

const { securityMiddleware } = await import('./firewall.js');

const app = express();
app.use(securityMiddleware);
app.get('/', (req, res) => res.status(200).send('OK'));

describe('Firewall Middleware', () => {
  describe('Helmet integration', () => {
    it('should set security-related HTTP headers', async () => {
      const res = await request(app).get('/');
      // Helmet sets a lot of headers, we'll check for a few common ones
      expect(res.headers['x-dns-prefetch-control']).toBe('off');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toBe('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toBe('noopen');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-xss-protection']).toBe('0');
    });
  });

  describe('Sanitizer integration', () => {
    it('should sanitize the request body, query, and params', () => {
      const sanitizerMiddleware = securityMiddleware[1]; // sanitizer is the second middleware
      const mockSanitizer = {
        sanitizeInput: jest.fn(input => {
          const sanitizedInput = {};
          for (const key in input) {
            sanitizedInput[key] = `sanitized_${input[key]}`;
          }
          return sanitizedInput;
        }),
      };

      const req = {
        app: {
          get: jest.fn().mockReturnValue(mockSanitizer),
        },
        body: { name: '<John Doe>' },
        query: { search: '<img src=x onerror=alert(1)>' },
        params: { id: '123<bad>' }
      };
      const res = {};
      const next = jest.fn();

      sanitizerMiddleware(req, res, next);

      expect(req.body).toEqual({ name: 'sanitized_<John Doe>' });
      expect(req.query).toEqual({ search: 'sanitized_<img src=x onerror=alert(1)>' });
      expect(req.params).toEqual({ id: 'sanitized_123<bad>' });
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Rate Limiting in non-test environment', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
    });

    afterAll(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should apply rate limiting', async () => {
        const appWithRateLimit = express();
        // Bust the cache to re-import the middleware with the new NODE_ENV
        const { securityMiddleware: reloadedMiddleware } = await import('./firewall.js?bustcache=' + Date.now());
        appWithRateLimit.use(reloadedMiddleware);
        appWithRateLimit.get('/', (req, res) => res.status(200).send('OK'));

      const res = await request(appWithRateLimit).get('/');
      expect(res.headers['x-ratelimit-limit']).toBeDefined();
      expect(res.headers['x-ratelimit-remaining']).toBeDefined();
    });
  });

  describe('Rate Limiting in test environment', () => {
    it('should not apply rate limiting', async () => {
      const res = await request(app).get('/');
      expect(res.headers['x-ratelimit-limit']).toBeUndefined();
      expect(res.headers['x-ratelimit-remaining']).toBeUndefined();
    });
  });
});
