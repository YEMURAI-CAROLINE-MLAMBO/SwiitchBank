// Only these update types are allowed
const ProgressUpdateTypes = {
  COMPLETED: 'shipped_feature',
  IN_PROGRESS: 'active_development',
  METRIC_ACHIEVED: 'goal_met',
  LEARNING: 'data_insight',
  DECISION_MADE: 'binary_choice'
};

// Template for all communications
const ProgressUpdateTemplate = {
  format: `
    [ACTION] [METRIC] [IMPACT]

    ACTION: What was done
    METRIC: How it's measured
    IMPACT: Why it matters
    NEXT: Immediate next step
  `,

  examples: {
    good: "Shipped multi-currency support → 100% global coverage → Users can now see all currencies → Next: Fiat-crypto bridge",
    bad: "Thinking about maybe adding some currency features, what do you think? Could be good for international users maybe."
  }
};
