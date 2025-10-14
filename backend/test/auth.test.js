import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';

jest.mock('../src/config/database.js', () => ({
  connectDB: jest.fn(() => Promise.resolve()),
  disconnectDB: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/models/User.js');


describe('Auth Endpoints', () => {

  beforeEach(() => {
    User.findOne.mockClear();
    User.create.mockClear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'some-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        // Mongoose .save() returns a promise, so we mock it.
        save: jest.fn().mockResolvedValue(true),
      });

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
        password: 'hashedpassword', // In a real scenario, this would be hashed
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
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
        matchPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);
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
