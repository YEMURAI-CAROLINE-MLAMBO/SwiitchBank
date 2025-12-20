import mongoose from 'mongoose';

const swiitchSafeDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    ocrText: {
      type: String,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  },
  { timestamps: true }
);

export default mongoose.model('SwiitchSafeDocument', swiitchSafeDocumentSchema);
