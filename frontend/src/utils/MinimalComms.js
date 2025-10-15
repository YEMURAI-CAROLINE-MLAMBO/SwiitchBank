// Replace discussions with status updates
const CommunicationProtocol = {
  // Approved message types only
  messageTypes: {
    STATUS_UPDATE: 'Current progress against plan',
    DECISION_NEEDED: 'Binary choice with context',
    BLOCKER: 'Specific obstacle with proposed solutions',
    SUCCESS: 'Measured outcome achieved'
  },

  // Banned communication patterns
  bannedPatterns: [
    'What do you think about...',
    'Maybe we should consider...',
    'I have a concern that...',
    'We could potentially...',
    'One idea might be...'
  ],

  // Approved communication templates
  templates: {
    decisionRequest: `
      DECISION NEEDED:
      - Option A: [specific action]
      - Option B: [specific alternative]
      - Context: [relevant data]
      - Recommendation: [data-driven suggestion]
      - Deadline: [specific time]
    `,

    statusUpdate: `
      STATUS: [In Progress/Complete/Blocked]
      Progress: [specific accomplishment]
      Next: [immediate next action]
      ETA: [specific timeframe]
      Metrics: [key metrics tracking]
    `,

    blockerReport: `
      BLOCKER: [specific obstacle]
      Impact: [on what timeline]
      Solutions: [2-3 specific options]
      Recommendation: [preferred solution]
      Help Needed: [specific ask]
    `
  }
};

export default CommunicationProtocol;
