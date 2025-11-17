import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';

// Define mocks outside of the describe block. This is crucial for jest.unstable_mockModule.
const mockSave = jest.fn();
const mockTransactionConstructor = jest.fn((data) => ({
  ...data,
  save: mockSave,
}));
mockTransactionConstructor.findByIdAndUpdate = jest.fn();

jest.unstable_mockModule('../src/models/Transaction.js', () => ({
  __esModule: true,
  default: mockTransactionConstructor,
}));

const mockCreateManualPaymentNotification = jest.fn();
jest.unstable_mockModule('../src/services/notificationService.js', () => ({
  __esModule: true,
  default: {
    createManualPaymentNotification: mockCreateManualPaymentNotification,
  },
}));

describe('Donation Service', () => {
  let donationService;

  beforeEach(async () => {
    // Reset modules to ensure the test runs with fresh mocks each time.
    jest.resetModules();
    // Clear mock history before each test.
    jest.clearAllMocks();

    // Dynamically import the service *after* mocks are defined and modules are reset.
    donationService = (await import('../src/services/donationService.js')).default;
  });

  describe('createDonation', () => {
    it('should create a donation transaction and send a notification', async () => {
      const donationData = {
        amount: 100,
        recipient: 'Global Aid',
        type: 'donation',
        user: new mongoose.Types.ObjectId().toString(),
        currency: 'USD',
      };
      const expectedSavedTransaction = { ...donationData, _id: new mongoose.Types.ObjectId().toString() };
      mockSave.mockResolvedValue(expectedSavedTransaction);

      const result = await donationService.createDonation(donationData);

      expect(mockTransactionConstructor).toHaveBeenCalledWith(expect.objectContaining(donationData));
      expect(mockSave).toHaveBeenCalled();
      expect(mockCreateManualPaymentNotification).toHaveBeenCalledWith(
        `Your ${donationData.type} to ${donationData.recipient}`,
        donationData.amount,
        `Thank you for your generous contribution.`
      );
      expect(result).toEqual(expectedSavedTransaction);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should find and update the status of a transaction', async () => {
      const transactionId = new mongoose.Types.ObjectId().toString();
      const newStatus = 'completed';
      const updatedTransaction = { _id: transactionId, status: newStatus };

      mockTransactionConstructor.findByIdAndUpdate.mockResolvedValue(updatedTransaction);

      const result = await donationService.updateTransactionStatus(transactionId, newStatus);

      expect(mockTransactionConstructor.findByIdAndUpdate).toHaveBeenCalledWith(
        transactionId,
        { status: newStatus },
        { new: true }
      );
      expect(result).toEqual(updatedTransaction);
    });
  });
});
