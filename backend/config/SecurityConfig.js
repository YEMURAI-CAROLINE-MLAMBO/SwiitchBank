const SecurityConfig = {
  fraud: {
    riskThresholds: {
      low: 0.3,
      medium: 0.6,
      high: 0.8,
      critical: 0.95
    },

    autoBlock: {
      enabled: true,
      threshold: 0.9, // Auto-block above 90% risk
      holdPeriod: 86400000 // 24 hours
    },

    mfaTriggers: [
      'new_device',
      'unusual_location',
      'large_transfer',
      'sensitive_operation'
    ]
  },

  monitoring: {
    realTimeScanning: true,
    behavioralAnalysis: true,
    amlScreening: true,
    cryptoMonitoring: true
  },

  reporting: {
    sarThreshold: 0.8, // Suspicious Activity Reporting
    ctrThreshold: 10000, // Currency Transaction Reporting
    auditLogRetention: 2592000000 // 30 days
  }
};

export default SecurityConfig;
