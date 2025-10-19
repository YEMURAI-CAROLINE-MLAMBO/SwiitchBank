import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import Ticket from '../../src/models/Ticket.js';

describe('Ticket Routes', () => {
  let user;

  beforeAll(async () => {
    // Create a user to associate with the ticket
    user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      swiitchBankId: '123456789',
    });
    await user.save();
  });

  afterAll(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket', async () => {
      const ticketData = {
        userId: user._id,
        subject: 'Test Ticket',
        description: '<p>This is a test ticket description.</p>',
        priority: 'Medium',
      };

      const res = await request(app)
        .post('/api/tickets')
        .send(ticketData)
        .expect(201);

      expect(res.body.message).toBe('Ticket created successfully!');
      expect(res.body.ticket.subject).toBe(ticketData.subject);
      expect(res.body.ticket.description).toBe('<p>This is a test ticket description.</p>'); // Check sanitized description
    });

    it('should return a 400 error if required fields are missing', async () => {
      const ticketData = {
        userId: user._id,
        // Missing subject and description
      };

      await request(app)
        .post('/api/tickets')
        .send(ticketData)
        .expect(400);
    });
  });
});
