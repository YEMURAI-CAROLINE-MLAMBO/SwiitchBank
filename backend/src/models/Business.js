const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', BusinessSchema);
