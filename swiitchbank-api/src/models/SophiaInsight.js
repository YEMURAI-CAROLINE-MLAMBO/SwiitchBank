import mongoose from 'mongoose';

const sophiaInsightSchema = new mongoose.Schema({
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Insight metadata
  type: {
    type: String,
    required: true,
    enum: [
      'spending_pattern',
      'savings_opportunity',
      'budget_alert',
      'investment_suggestion',
      'debt_management',
      'financial_health',
      'goal_progress'
    ]
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  // AI analysis data
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  impact: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  timeframe: {
    type: String,
    enum: ['immediate', 'short_term', 'long_term'],
    required: true
  },

  // Actionable data
  recommendedActions: [{
    action: String,
    priority: Number,
    estimatedSavings: Number,
    timeline: String
  }],

  // Context data
  relevantTransactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  dataTimeRange: {
    start: Date,
    end: Date
  },

  // User interaction
  isRead: {
    type: Boolean,
    default: false
  },
  isActioned: {
    type: Boolean,
    default: false
  },
  userFeedback: {
    type: String,
    enum: ['helpful', 'not_helpful', 'dismissed']
  },

  // Expiration
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 } // TTL index
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
sophiaInsightSchema.index({ user: 1, type: 1 });
sophiaInsightSchema.index({ user: 1, impact: 1 });
sophiaInsightSchema.index({ user: 1, isRead: 1 });
sophiaInsightSchema.index({ user: 1, createdAt: -1 });
sophiaInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('SophiaInsight', sophiaInsightSchema);
