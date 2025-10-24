import TithingTransaction from '../models/tithingTransaction.js';

const createTransactionRecord = async (transactionData) => {
  const transactionRecord = new TithingTransaction(transactionData);
  await transactionRecord.save();
  return transactionRecord;
};

const updateTransactionStatus = async (id, status) => {
  const transaction = await TithingTransaction.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  return transaction;
};

export default {
  createTransactionRecord,
  updateTransactionStatus,
};
