const SecurityConfig = {
  dataConfiscation: {
    enabled: true,
    autoQuarantine: true,
    threatThresholds: {
      LOW: 0.3,
      MEDIUM: 0.6,
      HIGH: 0.8,
      CRITICAL: 0.9
    }
  },

  validation: {
    maxStringLength: 1000,
    maxObjectDepth: 10,
    maxArrayLength: 100,
    allowedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'BTC', 'ETH'],
    maxTransactionAmount: 1000000
  },

  monitoring: {
    alertOnCritical: true,
    autoBlockUsers: false, // Manual review recommended
    retentionDays: 90,
    realTimeScanning: true
  },

  patterns: {
    updateFrequency: '24h', // Update threat patterns daily
    externalFeeds: true, // Use external threat intelligence
    customPatterns: [] // Add custom patterns here
  }
};

export default SecurityConfig;