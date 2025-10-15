import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Personalization
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },

  // Financial Context (Optional)
  lifeStage: {
    type: String,
    enum: ['student', 'early_career', 'established', 'planning_retirement', 'retired'],
    default: 'early_career'
  },
  financialGoals: [{
    type: String,
    enum: ['emergency_fund', 'debt_free', 'home_ownership', 'retirement', 'investment', 'education']
  }],
  riskTolerance: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    default: 'moderate'
  },

  // Plaid Integration
  plaidAccessToken: {
    type: String,
    sparse: true // Allows null for multiple users
  },
  plaidItemId: {
    type: String,
    sparse: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ plaidItemId: 1 });

export default mongoose.model('User', userSchema);
