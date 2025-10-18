import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { generateQrCode, confirmPayment } from '../../src/controllers/qrController.js';
import User from '../../src/models/User.js';
import QrPayment from '../../src/models/QrPayment.js';

describe('QR Code Controller', () => {
  let req, res, user, payer;

  beforeEach(async () => {
    user = new User({
      swiitchBankId: 'user456',
      email: 'recipient@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Recipient',
    });
    await user.save();

    payer = new User({
        swiitchBankId: 'user123',
        email: 'payer@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Payer',
        balance: 200,
    });
    await payer.save();

    req = {
      body: {},
      user: { id: payer._id.toString() },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('generateQrCode', () => {
    it('should generate a QR code successfully', async () => {
      const mockQrCodeService = {
        generateP2pQrCode: jest.fn().mockResolvedValue({
          payload: { expires: Date.now() / 1000 + 300 },
          signature: 'test-signature',
          qrDataUri: 'test-qr-data',
        }),
      };
      req.body = {
        amount: 100,
        currency: 'USD',
        recipient_id: user._id.toString(),
        expires_in: 300,
      };

      await generateQrCode(mockQrCodeService)(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.any(Object));
      expect(mockQrCodeService.generateP2pQrCode).toHaveBeenCalled();
    });
  });

  describe('confirmPayment', () => {
    it('should confirm a payment successfully', async () => {
      const mockWebhookService = {
        trigger: jest.fn().mockResolvedValue(),
      };
      const qrPayment = new QrPayment({
        qr_id: 'payment123',
        recipient: user._id,
        amount: 100,
        currency: 'USD',
        status: 'pending',
        signature: 'test-signature', // Add required signature
        expires_at: new Date(Date.now() + 300000), // Add required expiration
      });
      await qrPayment.save();

      req.body = { payment_id: 'payment123' };

      await confirmPayment(mockWebhookService)(req, res);

      expect(res.json).toHaveBeenCalledWith({
        transaction_id: expect.any(Object),
        status: 'completed',
      });
      expect(mockWebhookService.trigger).toHaveBeenCalled();
    });
  });
});