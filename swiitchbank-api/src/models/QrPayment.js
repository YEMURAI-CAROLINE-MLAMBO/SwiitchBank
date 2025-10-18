import mongoose from 'mongoose';

const qrPaymentSchema = new mongoose.Schema({
  qr_id: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'expired'],
    default: 'pending',
  },
  recipient: {
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
  },
  memo: {
    type: String,
  },
  expires_at: {
    type: Date,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
}, { timestamps: true });

const QrPayment = mongoose.model('QrPayment', qrPaymentSchema);

export default QrPayment;