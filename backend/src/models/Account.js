import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Plaid account data
  plaidAccountId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  officialName: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['depository', 'credit', 'loan', 'investment', 'brokerage']
  },
  subtype: {
    type: String,
    required: true
  },

  // Balance information
  balances: {
    available: Number,
    current: Number,
    limit: Number,
    isoCurrencyCode: {
      type: String,
      default: 'USD'
    }
  },

  // Metadata
  mask: String,
  institution: {
    name: String,
    institutionId: String
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Timestamps
  lastSynced: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for performance
accountSchema.index({ user: 1, plaidAccountId: 1 }, { unique: true });
accountSchema.index({ user: 1, type: 1 });
accountSchema.index({ user: 1, isActive: 1 });

export default mongoose.model('Account', accountSchema);
