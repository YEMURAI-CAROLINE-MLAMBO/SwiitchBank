import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  businessAddress: {
    type: String,
    required: true,
  },
  taxId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.model('Business', BusinessSchema);
