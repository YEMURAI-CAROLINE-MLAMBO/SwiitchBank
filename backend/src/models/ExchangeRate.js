import mongoose from 'mongoose';

const exchangeRateSchema = new mongoose.Schema({
  baseCurrency: {
    type: String,
    required: true,
    uppercase: true
  },
  targetCurrency: {
    type: String,
    required: true,
    uppercase: true
  },
  rate: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['fixer', 'openexchangerates', 'cryptocompare', 'manual'],
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for fast rate lookups
exchangeRateSchema.index({ baseCurrency: 1, targetCurrency: 1, lastUpdated: -1 });

export default mongoose.model('ExchangeRate', exchangeRateSchema);
