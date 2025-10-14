import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  marqetaTransactionToken: {
    type: String,
    required: true,
    unique: true,
  },
  marqetaCardToken: {
    type: String,
    required: true,
  },
  marqetaUserToken: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
  },
  merchantDetails: {
    type: Object,
  },
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
