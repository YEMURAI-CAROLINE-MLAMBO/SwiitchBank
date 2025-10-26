import { describe, it, expect } from '@jest/globals';
import mongoose from 'mongoose';
import Transaction from '../src/models/Transaction.js';
import donationService from '../src/services/donationService.js';

describe('Donation Service', () => {
  const userId = new mongoose.Types.ObjectId();

  it('should create a new transaction record', async () => {
    const transactionData = {
      user: userId,
      amount: 100,
      currency: 'USD',
      status: 'pending',
      recipient: 'Test Recipient',
      type: 'tithe',
    };
    const transaction = await donationService.createTransactionRecord(transactionData);
    expect(transaction.amount).toBe(100);
    expect(transaction.status).toBe('pending');
  });

  it('should update the status of a transaction record', async () => {
    const transactionData = {
      user: userId,
      amount: 200,
      currency: 'USD',
      status: 'pending',
      recipient: 'Test Recipient',
      type: 'tithe',
    };
    const transaction = await donationService.createTransactionRecord(transactionData);
    const updatedTransaction = await donationService.updateTransactionStatus(transaction._id, 'completed');
    expect(updatedTransaction.status).toBe('completed');
  });
});
