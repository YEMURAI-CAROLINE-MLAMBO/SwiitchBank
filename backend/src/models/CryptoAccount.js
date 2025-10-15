import mongoose from 'mongoose';

const cryptoAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Exchange/Wallet Integration
  exchange: {
    type: String,
    enum: ['coinbase', 'binance', 'kraken', 'metamask', 'phantom', 'other'],
    required: true
  },
  apiKey: String, // Encrypted
  apiSecret: String, // Encrypted

  // Wallet Details
  walletAddress: String,
  walletType: {
    type: String,
    enum: ['exchange', 'hot_wallet', 'cold_wallet', 'defi']
  },

  // Balance Tracking
  balances: [{
    currency: {
      type: String,
      required: true, // 'BTC', 'ETH', 'USDC', etc.
      uppercase: true
    },
    amount: {
      type: Number,
      required: true
    },
    valueUSD: {
      type: Number,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastSynced: Date
}, {
  timestamps: true
});

export default mongoose.model('CryptoAccount', cryptoAccountSchema);
