
import mongoose from 'mongoose';

const repaymentSchema = new mongoose.Schema({
  dueDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
});

const loanSchema = new mongoose.Schema({
  loanOfferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanOffer',
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  repaymentSchedule: [repaymentSchema],
  status: {
    type: String,
    enum: ['active', 'paid', 'defaulted'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;
