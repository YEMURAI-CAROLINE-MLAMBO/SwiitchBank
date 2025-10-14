import request from 'supertest';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

process.env.JWT_SECRET = 'test-secret';

jest.unstable_mockModule('../src/middleware/rateLimiter.js', () => ({
  apiLimiter: (req, res, next) => next(),
  aiLimiter: (req, res, next) => next(),
  strictLimiter: (req, res, next) => next(),
}));

jest.unstable_mockModule('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn(() => Promise.resolve()),
    sendCommand: jest.fn().mockResolvedValue([1, Date.now()]),
    get: jest.fn(),
    setEx: jest.fn(),
    mGet: jest.fn(),
  })),
}));

jest.unstable_mockModule('../src/config/database.js', () => ({
  connectWithRetry: jest.fn(() => Promise.resolve()),
  createOptimalIndexes: jest.fn(() => Promise.resolve()),
}));

jest.unstable_mockModule('../src/models/User.js', () => {
  const User = jest.fn(function(data) {
    this.save = jest.fn().mockResolvedValue(data);
    Object.assign(this, data);
  });
  User.findOne = jest.fn();
  User.create = jest.fn();
  return { default: User };
});

jest.unstable_mockModule('bcryptjs', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');
const bcrypt = await import('bcryptjs');

describe('Auth Endpoints', () => {

  beforeEach(() => {
    User.findOne.mockClear();
    User.create.mockClear();
    bcrypt.compare.mockClear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
       User.findOne.mockResolvedValue({
        _id: 'some-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      });
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with correct credentials', async () => {
      const mockUser = {
        _id: 'some-id',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with incorrect credentials', async () => {
      const mockUser = {
        _id: 'some-id',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });
  });
});
