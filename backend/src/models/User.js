import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // MULTI-CURRENCY CORE
  baseCurrency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  supportedCurrencies: [{
    currency: {
      type: String,
      required: true,
      uppercase: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    conversionRate: Number, // Latest rate to base currency
    lastUpdated: Date
  }],

  // International Settings
  locale: {
    type: String,
    default: 'en-US'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  dateFormat: {
    type: String,
    default: 'MM/DD/YYYY'
  },

  // Currency Preferences
  currencyPreferences: {
    autoConvert: {
      type: Boolean,
      default: true
    },
    showOriginalCurrency: {
      type: Boolean,
      default: true
    },
    rateUpdateFrequency: {
      type: String,
      enum: ['realtime', 'daily', 'weekly'],
      default: 'daily'
    }
  }
});

export default mongoose.model('User', UserSchema);
