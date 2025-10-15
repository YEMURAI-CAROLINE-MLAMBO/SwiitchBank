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
  // MULTI-CURRENCY TRANSACTION DATA
  // These fields are not required to avoid a breaking change for existing documents.
  // A data migration would be needed to make them required.
  originalAmount: {
    type: Number
  },
  originalCurrency: {
    type: String,
    uppercase: true
  },

  // Converted amounts (for user's base currency)
  convertedAmount: Number,
  convertedCurrency: String,
  exchangeRate: Number, // Rate used for conversion
  exchangeRateDate: Date,

  // FX Metadata
  fxFee: Number,
  fxProvider: String,
  crossBorder: {
    type: Boolean,
    default: false
  },
  internationalDetails: {
    country: String,
    merchantCountry: String,
    fxMarkup: Number
  }
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
