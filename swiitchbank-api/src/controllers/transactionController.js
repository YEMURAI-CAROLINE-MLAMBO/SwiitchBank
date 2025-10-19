import { getTransactions } from '../services/transactionService.js';

export const getTransactionsController = async (req, res) => {
  try {
    const transactions = await getTransactions(req.user.id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting transactions' });
  }
};
