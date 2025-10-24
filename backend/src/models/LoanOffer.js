
import mongoose from 'mongoose';

const loanOfferSchema = new mongoose.Schema({
  funderId: {
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
    default: 'USD',
  },
  interestRate: {
    type: Number,
    required: true,
  },
  term: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'accepted', 'cancelled'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const LoanOffer = mongoose.model('LoanOffer', loanOfferSchema);

export default LoanOffer;
