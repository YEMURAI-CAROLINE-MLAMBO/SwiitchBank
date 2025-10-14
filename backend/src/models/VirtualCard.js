import mongoose from 'mongoose';

const VirtualCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'frozen'],
    default: 'active',
  },
  type: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('VirtualCard', VirtualCardSchema);
