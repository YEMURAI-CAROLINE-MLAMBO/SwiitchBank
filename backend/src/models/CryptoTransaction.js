import mongoose from 'mongoose';

const cryptoTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cryptoAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CryptoAccount',
    required: true
  },

  // Transaction Core
  type: {
    type: String,
    enum: ['buy', 'sell', 'transfer', 'swap', 'staking', 'yield'],
    required: true
  },
  baseCurrency: {
    type: String,
    required: true, // 'BTC', 'ETH', etc.
    uppercase: true
  },
  quoteCurrency: {
    type: String,
    required: true, // 'USD', 'USDT', etc.
    uppercase: true
  },
  baseAmount: Number,
  quoteAmount: Number,

  // Price & Fees
  price: Number,
  fees: [{
    currency: String,
    amount: Number
  }],

  // Bridge Transactions
  isBridgeTransaction: {
    type: Boolean,
    default: false
  },
  bridgeDetails: {
    fromAsset: String,
    toAsset: String,
    bridgeFee: Number,
    bridgeService: String // 'LayerSwap', 'SideShift', etc.
  },

  // Metadata
  transactionHash: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('CryptoTransaction', cryptoTransactionSchema);
