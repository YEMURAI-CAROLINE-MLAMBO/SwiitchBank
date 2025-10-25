import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have a null value
    },
    status: {
      type: String,
      enum: ['succeeded', 'failed', 'completed', 'pending'],
      required: true,
    },
    // Adding other fields from qrController to make the model more generic
    type: { type: String },
    category: { type: String },
    description: { type: String },
    related_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    plaidTransactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
