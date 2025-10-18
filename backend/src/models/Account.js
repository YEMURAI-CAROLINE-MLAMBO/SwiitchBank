import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  // Type of account, e.g., 'checking', 'savings', 'investment'
  accountType: {
    type: String,
    required: true,
    default: 'checking',
  },
  // Flag for the primary account in a specific currency
  isPrimary: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

accountSchema.index({ userId: 1, currency: 1 });

export default mongoose.model('Account', accountSchema);