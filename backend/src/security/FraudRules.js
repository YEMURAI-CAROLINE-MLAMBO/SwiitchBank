class FraudRules {
  static initializeFraudRules() {
    return {
      // Amount-based rules
      amountRules: [
        {
          name: 'unusual_amount',
          condition: (tx, history) => tx.amount > history.avgAmount * 3,
          risk: 0.7,
          message: 'Transaction amount significantly higher than average'
        },
        {
          name: 'round_amount_fraud',
          condition: (tx) => tx.amount % 1000 === 0 && tx.amount > 5000,
          risk: 0.4,
          message: 'Suspicious round amount transaction'
        }
      ],

      // Frequency rules
      frequencyRules: [
        {
          name: 'rapid_succession',
          condition: (tx, history) => {
            const recent = history.lastHourTransactions;
            return recent.length > 5 && tx.amount > history.avgAmount;
          },
          risk: 0.8,
          message: 'Multiple large transactions in short period'
        }
      ],

      // Geographic rules
      geographicRules: [
        {
          name: 'impossible_travel',
          condition: (tx, user) => {
            const lastLocation = user.lastKnownLocation;
            const currentLocation = tx.location;
            const distance = this.calculateDistance(lastLocation, currentLocation);
            const timeDiff = tx.timestamp - user.lastTransactionTime;
            return distance > 500 && timeDiff < 3600000; // 500km in 1 hour
          },
          risk: 0.9,
          message: 'Impossible travel detected'
        }
      ],

      // Device rules
      deviceRules: [
        {
          name: 'new_device',
          condition: (tx, user) => !user.trustedDevices.includes(tx.deviceId),
          risk: 0.3,
          message: 'Transaction from unrecognized device'
        },
        {
          name: 'suspicious_user_agent',
          condition: (tx) => this.isSuspiciousUserAgent(tx.userAgent),
          risk: 0.6,
          message: 'Suspicious browser/device detected'
        }
      ]
    };
  }

  static async checkAllRules(transaction, userContext) {
    const violations = [];
    const fraudRules = FraudRules.initializeFraudRules();

    for (const [category, rules] of Object.entries(fraudRules)) {
      for (const rule of rules) {
        if (await rule.condition(transaction, userContext)) {
          violations.push({
            category,
            rule: rule.name,
            risk: rule.risk,
            message: rule.message
          });
        }
      }
    }

    return violations;
  }

  // --- Placeholder Implementations ---

  static calculateDistance(location1, location2) {
    return 0; // No distance
  }

  static isSuspiciousUserAgent(userAgent) {
    return false; // Not suspicious
  }
}

export default FraudRules;
