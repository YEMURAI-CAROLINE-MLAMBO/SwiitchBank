import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import QrPayment from '../../src/models/QrPayment.js';
import connectDatabase from '../../src/config/database.js';

// Mock services at the top level
jest.unstable_mockModule('../../src/services/QrCodeService.js', () => ({
  default: {
    generateP2pQrCode: jest.fn(),
    verifyP2pQrCode: jest.fn(),
  },
}));
jest.unstable_mockModule('../../src/services/WebhookService.js', () => ({
  default: {
    trigger: jest.fn(),
  },
}));

describe('QR Code API Endpoints', () => {
  let app, token, user, recipient, QrCodeService, WebhookService;

  beforeEach(async () => {
    // Dynamically import services here to ensure mocks are used
    QrCodeService = (await import('../../src/services/QrCodeService.js')).default;
    WebhookService = (await import('../../src/services/WebhookService.js')).default;

    // Import the app *after* mocks are established
    app = (await import('../../src/app.js')).default;

    const mongoTestUri = 'mongodb://localhost:27017/swiitchbank_test';
    process.env.JWT_SECRET = 'a-secure-jwt-secret-for-testing';
    process.env.QR_CODE_HMAC_SECRET = 'a-secure-qr-code-hmac-secret-for-testing';
    await connectDatabase(mongoTestUri);

    user = await User.create({
        swiitchBankId: `user_${new mongoose.Types.ObjectId()}`,
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        balance: 100,
    });
    recipient = await User.create({
        swiitchBankId: `recipient_${new mongoose.Types.ObjectId()}`,
        email: 'recipient@example.com',
        password: 'password123',
        firstName: 'Recipient',
        lastName: 'User',
        balance: 50,
    });

    const jwt = (await import('jsonwebtoken')).default;
    token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await QrPayment.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/v1/qr/generate', () => {
    it('should generate a QR code successfully', async () => {
      QrCodeService.generateP2pQrCode.mockResolvedValue({
        payload: { expires: Math.floor(Date.now() / 1000) + 300 },
        signature: 'mock-signature',
        qrDataUri: 'data:image/png;base64,mocked-qr-code',
      });

      const res = await request(app)
        .post('/api/v1/qr/generate')
        .set('x-auth-token', token)
        .send({
          type: 'p2p',
          amount: 50,
          currency: 'USD',
          recipient_id: recipient._id.toString(),
          expires_in: 300,
        });

      expect(res.statusCode).toEqual(200);
      expect(QrCodeService.generateP2pQrCode).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/qr/confirm', () => {
    it('should confirm a payment successfully', async () => {
        const qrPayment = await QrPayment.create({
            qr_id: 'test-payment-id',
            status: 'pending',
            recipient: recipient._id,
            amount: 50,
            currency: 'USD',
            signature: 'test-signature',
            expires_at: new Date(Date.now() + 60000),
        });

        const res = await request(app)
            .post('/api/v1/qr/confirm')
            .set('x-auth-token', token)
            .send({ payment_id: qrPayment.qr_id });

        expect(res.statusCode).toEqual(200);

        const updatedPayer = await User.findById(user._id);
        expect(updatedPayer.balance).toBe(50);

        expect(WebhookService.trigger).toHaveBeenCalledTimes(2);
    });
  });
});