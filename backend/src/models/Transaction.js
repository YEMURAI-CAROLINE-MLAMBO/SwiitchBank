import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Account reference
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true
  },

  // Plaid transaction data
  plaidTransactionId: {
    type: String,
    required: true,
    unique: true
  },
  plaidCategoryId: String,

  // Core transaction data
  name: {
    type: String,
    required: true,
    trim: true
  },
  merchantName: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  currency: {
    type: String,
    default: 'USD'
  },

  // Enhanced categorization
  category: {
    type: String,
    required: true,
    default: 'Uncategorized',
    index: true
  },
  subcategory: String,
  categoryConfidence: {
    type: Number,
    default: 1.0
  },

  // Location data
  location: {
    city: String,
    region: String,
    country: String,
    address: String,
    postalCode: String,
    lat: Number,
    lon: Number
  },

  // Payment metadata
  paymentChannel: {
    type: String,
    enum: ['online', 'in_store', 'other']
  },
  pending: {
    type: Boolean,
    default: false
  },

  // AI-enhanced fields
  tags: [String],
  notes: String,
  importance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for optimal query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, amount: 1 });
transactionSchema.index({ user: 1, merchantName: 1 });
transactionSchema.index({ date: 1, category: 1 });
transactionSchema.index({ user: 1, pending: 1 });

// Text index for search functionality
transactionSchema.index({
  name: 'text',
  merchantName: 'text',
  notes: 'text'
});

export default mongoose.model('Transaction', transactionSchema);
