import Transaction from '../models/Transaction.js';

export const getTransactions = async (userId) => {
  const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
  return transactions;
};
