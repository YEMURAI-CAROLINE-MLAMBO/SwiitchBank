import Finance from 'tvm-financejs';
const finance = new Finance();

class BehavioralModel {
  /**
   * SPENDING BEHAVIOR MODELING
   */
  static modelSpendingBehavior(transactions, userProfile) {
    const patterns = {
      // Temporal patterns
      seasonal: this.analyzeSeasonalPatterns(transactions),
      weekly: this.analyzeWeeklyPatterns(transactions),
      monthly: this.analyzeMonthlyPatterns(transactions),

      // Category patterns
      categoryClustering: this.analyzeCategoryClusters(transactions),
      merchantPreferences: this.analyzeMerchantPreferences(transactions),

      // Behavioral biases
      biases: this.detectBehavioralBiases(transactions, userProfile)
    };

    return {
      patterns,
      spendingPersona: this.determineSpendingPersona(patterns),
      predictionModel: this.buildSpendingPredictionModel(patterns),
      interventionPoints: this.identifyInterventionOpportunities(patterns)
    };
  }

  /**
   * INVESTMENT BEHAVIOR MODELING
   */
  static modelInvestmentBehavior(trades, marketConditions, userProfile) {
    const behavior = {
      // Risk tolerance assessment
      riskTolerance: this.assessRiskTolerance(trades, marketConditions),

      // Behavioral biases detection
      biases: {
        lossAversion: this.measureLossAversion(trades),
        recencyBias: this.measureRecencyBias(trades, marketConditions),
        herdBehavior: this.detectHerdBehavior(trades, marketConditions),
        overconfidence: this.measureOverconfidence(trades)
      },

      // Performance attribution
      performance: this.attributePerformance(trades, marketConditions)
    };

    return {
      behavior,
      personalizedAdvice: this.generateBehavioralAdvice(behavior),
      optimalStrategy: this.recommendOptimalStrategy(behavior, userProfile)
    };
  }

  // --- Helper Methods ---

  // Spending Behavior Helpers
  static analyzeSeasonalPatterns(transactions) {
    if (!transactions || transactions.length === 0) return {};
    const monthlySpending = Array(12).fill(0);
    transactions.forEach(t => {
        const month = new Date(t.date).getMonth();
        monthlySpending[month] += t.amount;
    });

    const winterSpending = monthlySpending[11] + monthlySpending[0] + monthlySpending[1]; // Dec, Jan, Feb
    const summerSpending = monthlySpending[5] + monthlySpending[6] + monthlySpending[7]; // Jun, Jul, Aug

    return {
        winterSpending: winterSpending > summerSpending ? "high" : "low",
        summerSpending: summerSpending > winterSpending ? "high" : "low",
    };
  }
  static analyzeWeeklyPatterns(transactions) {
    if (!transactions || transactions.length === 0) return {};
    let weekdaySpending = 0;
    let weekendSpending = 0;
    transactions.forEach(t => {
        const day = new Date(t.date).getDay();
        if (day === 0 || day === 6) { // Sunday or Saturday
            weekendSpending += t.amount;
        } else {
            weekdaySpending += t.amount;
        }
    });
    return { weekendSpike: weekendSpending > weekdaySpending };
  }
  static analyzeCategoryClusters(transactions) {
    if (!transactions || transactions.length === 0) return {};
    const categoryTotals = {};
    let totalSpending = 0;
    transactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        totalSpending += t.amount;
    });

    if (totalSpending === 0) return {};

    const categoryClusters = {};
    for (const category in categoryTotals) {
        categoryClusters[category] = categoryTotals[category] / totalSpending;
    }
    return categoryClusters;
  }
  static analyzeMerchantPreferences(transactions) {
     if (!transactions || transactions.length === 0) return {};
    const merchantTotals = {};
    transactions.forEach(t => {
        merchantTotals[t.merchant] = (merchantTotals[t.merchant] || 0) + t.amount;
    });
    // Return top 3 merchants
    const sortedMerchants = Object.entries(merchantTotals).sort((a, b) => b[1] - a[1]);
    return Object.fromEntries(sortedMerchants.slice(0, 3));
  }
  static detectBehavioralBiases(transactions, userProfile) { return { presentBias: true, confirmationBias: false }; } // Placeholder
  static determineSpendingPersona(patterns) {
    if(!patterns || !patterns.categoryClustering) return "Unknown";

    const topCategory = Object.keys(patterns.categoryClustering).reduce((a, b) => patterns.categoryClustering[a] > patterns.categoryClustering[b] ? a : b, '');

    if (topCategory === 'Travel') return "Globetrotter";
    if (topCategory === 'Food' && patterns.weekly?.weekendSpike) return "Social Foodie";
    if (topCategory === 'Shopping') return "Fashionista";

    return "Balanced Spender";
  }
  static buildSpendingPredictionModel(patterns) { return { /* ... */ }; } // Placeholder for ML model
  static identifyInterventionOpportunities(patterns) {
      if(patterns.categoryClustering?.Food > 0.4) {
        return ["High spending in 'Food' category detected. Consider setting a budget."];
      }
      return [];
  }

  // Investment Behavior Helpers
  static assessRiskTolerance(trades, marketConditions) {
    if (!trades || trades.length === 0) return "Unknown";
    const pnlValues = trades.map(t => t.pnl);
    const meanPnl = pnlValues.reduce((sum, p) => sum + p, 0) / pnlValues.length;
    const squaredDiffs = pnlValues.map(p => Math.pow(p - meanPnl, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / pnlValues.length;
    const stdDev = Math.sqrt(variance); // Volatility of returns

    const lossAversion = this.measureLossAversion(trades);

    if (stdDev > 1000) return "High"; // High volatility in PnL
    if (stdDev > 500 || lossAversion === "High") return "Moderate";
    return "Low";
  }
  static measureLossAversion(trades) {
      if (!trades || trades.length === 0) return "Unknown";
      const realizedLosses = trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0);
      return Math.abs(realizedLosses) > 1000 ? "High" : "Low";
  }
  static measureRecencyBias(trades, marketConditions) {
    if (!trades || trades.length < 5) return false;
    const recentTrades = trades.slice(-5);
    const recentMarketReturn = marketConditions.recentMarketReturn || 0;
    // If user is buying heavily in a recently booming market, suggest recency bias.
    const buyingTrades = recentTrades.filter(t => t.action === 'buy').length;
    return recentMarketReturn > 0.05 && buyingTrades >= 4;
  }
  static detectHerdBehavior(trades, marketConditions) {
    if (!trades || !marketConditions.popularStocks) return false;
    const userTradedStocks = new Set(trades.map(t => t.symbol));
    const popularStocks = new Set(marketConditions.popularStocks);

    let intersectionSize = 0;
    userTradedStocks.forEach(stock => {
        if(popularStocks.has(stock)) {
            intersectionSize++;
        }
    });

    // If more than 50% of user's trades are in "popular" stocks, suggest herd behavior.
    return (intersectionSize / userTradedStocks.size) > 0.5;
  }
  static measureOverconfidence(trades) {
    if (!trades || trades.length < 10) return false;
    const winRate = trades.filter(t => t.pnl > 0).length / trades.length;
    const highFrequency = trades.length > 20; // Example: more than 20 trades in a period
    // High win rate combined with high frequency trading can be a sign of overconfidence.
    return winRate > 0.7 && highFrequency;
  }
  static attributePerformance(trades, marketConditions) { return { alpha: 0.01, beta: 1.1 }; } // Placeholder
  static generateBehavioralAdvice(behavior) {
      const advice = [];
      if (behavior.biases.lossAversion === "High") {
          advice.push("Your trading patterns show a strong aversion to realizing losses. Consider setting stop-loss orders to manage downside risk automatically.");
      }
      if (behavior.biases.herdBehavior) {
          advice.push("There are indications of herd behavior. Ensure your investment decisions are based on your own research, not just market trends.");
      }
      if(advice.length === 0) {
          return "Your investment strategy appears balanced and rational.";
      }
      return advice.join(' ');
  }
  static recommendOptimalStrategy(behavior, userProfile) { return "Continue with a balanced portfolio, consider adding index funds."; }
}
