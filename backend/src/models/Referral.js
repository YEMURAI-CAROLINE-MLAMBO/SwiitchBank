import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referredId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rewardAmount: {
    type: Number,
    required: true,
  },
  rewardCurrency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Referral', ReferralSchema);
