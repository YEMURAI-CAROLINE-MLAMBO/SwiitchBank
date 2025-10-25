import { jest, describe, it, expect, afterEach } from '@jest/globals';

const mockStripe = {
  webhooks: {
    constructEvent: jest.fn(),
  },
};

jest.unstable_mockModule('stripe', () => ({
  default: jest.fn(() => mockStripe),
}));

jest.unstable_mockModule('../src/models/User.js', () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule('../src/models/Transaction.js', () => ({
  default: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true),
  })),
}));

jest.unstable_mockModule('../src/services/HighCapacitySophiaService.js', () => ({
  default: {
    sendNotification: jest.fn(),
  },
}));

const { handleStripeWebhook } = await import('../src/services/paymentService.js');
const { default: User } = await import('../src/models/User.js');
const { default: Transaction } = await import('../src/models/Transaction.js');
const { default: HighCapacitySophiaService } = await import(
  '../src/services/HighCapacitySophiaService.js'
);

describe('paymentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleStripeWebhook', () => {
    it('should handle payment_intent.succeeded, create a transaction, and send a notification', async () => {
      const mockUser = { _id: 'user_123', firstName: 'John' };
      User.findById.mockResolvedValue(mockUser);

      const mockPaymentIntent = {
        id: 'pi_123',
        amount: 2000,
        currency: 'usd',
        metadata: { userId: 'user_123' },
      };

      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: mockPaymentIntent,
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const sig = 'test_signature';
      const rawBody = 'test_body';

      await handleStripeWebhook(rawBody, sig);

      expect(Transaction).toHaveBeenCalledWith({
        user: 'user_123',
        amount: 2000,
        currency: 'usd',
        stripePaymentIntentId: 'pi_123',
        status: 'succeeded',
      });
      expect(User.findById).toHaveBeenCalledWith('user_123');
      expect(HighCapacitySophiaService.sendNotification).toHaveBeenCalledWith(
        'Hi John, your payment of $20 was successful.'
      );
      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalled();
    });
  });
});
