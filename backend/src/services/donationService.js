import Transaction from '../models/Transaction.js';

const createTransactionRecord = async (transactionData) => {
  const transactionRecord = new Transaction(transactionData);
  await transactionRecord.save();
  return transactionRecord;
};

const updateTransactionStatus = async (id, status) => {
  const transaction = await Transaction.findByIdAndUpdate(
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
