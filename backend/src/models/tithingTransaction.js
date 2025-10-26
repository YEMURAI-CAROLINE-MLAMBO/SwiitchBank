import mongoose from 'mongoose';

const tithingTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  recipient: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['tithe', 'covenant_seed', 'covenant_partnership'],
    required: true,
  },
});

export default mongoose.model('TithingTransaction', tithingTransactionSchema);
