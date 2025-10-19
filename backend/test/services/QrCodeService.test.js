import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the qrcode library
jest.unstable_mockModule('qrcode', () => ({
  default: {
    toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mocked-qr-code'),
  },
}));

const QrCodeService = (await import('../../src/services/QrCodeService.js')).default;

describe('QrCodeService', () => {
  const testSecret = 'test-secret';

  it('should generate a signed P2P QR code payload and data URI', async () => {
    const recipientId = '60d5f2f5c7b5f9b3f8f9b3a5';
    const amount = 50.00;
    const currency = 'USD';
    const memo = 'Dinner payment';
    const expiresIn = 300;

    const { payload, signature, qrDataUri } = await QrCodeService.generateP2pQrCode(
      recipientId,
      amount,
      currency,
      memo,
      expiresIn,
      testSecret // Pass the secret
    );

    expect(payload.recipient).toBe(recipientId);
    expect(payload.signature).toBeDefined();
    expect(qrDataUri).toContain('data:image/png;base64,mocked-qr-code');
  });

  it('should sign and verify a payload successfully', () => {
    const payload = {
      recipient: '60d5f2f5c7b5f9b3f8f9b3a5',
      amount: 50.00,
    };

    const signature = QrCodeService.signPayload(payload, testSecret);
    const signedPayload = { ...payload, signature };

    const isValid = QrCodeService.verifyP2pQrCode(signedPayload, testSecret);
    expect(isValid).toBe(true);
  });

  it('should fail verification if the payload is tampered with', () => {
    const payload = {
      recipient: '60d5f2f5c7b5f9b3f8f9b3a5',
      amount: 50.00,
    };

    const signature = QrCodeService.signPayload(payload, testSecret);
    const tamperedPayload = { ...payload, amount: 100.00, signature };

    const isValid = QrCodeService.verifyP2pQrCode(tamperedPayload, testSecret);
    expect(isValid).toBe(false);
  });
});