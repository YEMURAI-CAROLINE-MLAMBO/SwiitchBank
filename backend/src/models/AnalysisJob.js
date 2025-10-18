import mongoose from 'mongoose';

const analysisJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'complete', 'failed'],
    required: true,
    default: 'queued',
  },
  transactionCount: {
    type: Number,
    required: true,
  },
  result: {
    type: mongoose.Schema.Types.Mixed, // Store the JSON result of the analysis
  },
  error: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

analysisJobSchema.index({ userId: 1, status: 1 });
analysisJobSchema.index({ createdAt: -1 });

export default mongoose.model('AnalysisJob', analysisJobSchema);