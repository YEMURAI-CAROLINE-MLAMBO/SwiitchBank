import tithingTransactionService from '../services/tithingTransactionService.js';

const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const transaction = await tithingTransactionService.updateTransactionStatus(id, status);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction status.' });
  }
};

export default {
  updateTransactionStatus,
};
