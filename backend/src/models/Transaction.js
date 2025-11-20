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
    type: {
      type: String,
      enum: [
        'deposit',
        'withdrawal',
        'transfer',
        'payment',
        'donation',
        'zakat',
        'offering',
        'tithe',
        'first fruit',
        'sadaqa',
        'dakshina',
        'daan',
        'general donation',
        'specific cause',
        'local event',
        'fundraiser',
      ],
    },
    givingType: { type: String },
    subCategory: { type: String },
    donation: { type: String },
    category: { type: String },
    description: { type: String },
    recipient: { type: String },
    related_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    plaidTransactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
