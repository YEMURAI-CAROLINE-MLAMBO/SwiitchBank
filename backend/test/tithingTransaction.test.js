import mongoose from 'mongoose';
import TithingTransaction from '../src/models/tithingTransaction.js';
import tithingTransactionService from '../src/services/tithingTransactionService.js';

describe('Tithing Transaction Service', () => {
  it('should create a new transaction record', async () => {
    const transactionData = {
      transactionId: 'test-tithe-1',
      amount: 100,
      recipient: 'Test Recipient',
      type: 'tithe',
    };
    const transaction = await tithingTransactionService.createTransactionRecord(transactionData);
    expect(transaction.transactionId).toBe('test-tithe-1');
  });

  it('should update the status of a transaction record', async () => {
    const transactionData = {
      transactionId: 'test-tithe-2',
      amount: 200,
      recipient: 'Test Recipient',
      type: 'tithe',
    };
    const transaction = await tithingTransactionService.createTransactionRecord(transactionData);
    const updatedTransaction = await tithingTransactionService.updateTransactionStatus(transaction._id, 'completed');
    expect(updatedTransaction.status).toBe('completed');
  });
});
