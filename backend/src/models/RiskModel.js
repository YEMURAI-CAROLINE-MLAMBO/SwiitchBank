import Finance from 'tvm-financejs';
const finance = new Finance();

class RiskModel {
  /**
   * PORTFOLIO RISK ASSESSMENT
   */
  static assessPortfolioRisk(portfolio, marketData, portfolioReturns, riskFreeRate, confidenceLevel = 0.95) {
    return {
      // Value at Risk (VaR)
      valueAtRisk: this.calculatePortfolioVaR(portfolio, marketData, confidenceLevel),

      // Conditional VaR (Expected Shortfall)
      expectedShortfall: this.calculateExpectedShortfall(portfolio, marketData, confidenceLevel),

      // Stress Testing
      stressTests: {
        marketCrash: this.stressTestMarketCrash(portfolio, marketData),
        interestRateShock: this.stressTestInterestRates(portfolio, marketData),
        inflationSpike: this.stressTestInflation(portfolio, marketData)
      },

      // Risk Decomposition
      riskDecomposition: this.decomposePortfolioRisk(portfolio, marketData),

      // Risk-Adjusted Returns
      riskAdjustedMetrics: {
        sharpeRatio: this.calculateSharpeRatio(portfolioReturns, riskFreeRate),
        sortinoRatio: this.calculateSortinoRatio(portfolioReturns, riskFreeRate), // Assuming similar input for simplicity
        calmarRatio: this.calculateCalmarRatio(portfolioReturns, riskFreeRate) // Assuming similar input for simplicity
      }
    };
  }

  /**
   * CREDIT RISK MODELING
   */
  static assessCreditRisk(debts, income, assets) {
    const probabilityOfDefault = this.calculatePD(debts, income, assets);
    const lossGivenDefault = this.calculateLGD(assets, debts);
    const exposureAtDefault = this.calculateEAD(debts);

    const expectedLoss = probabilityOfDefault * lossGivenDefault * exposureAtDefault;
    const unexpectedLoss = this.calculateUnexpectedLoss(probabilityOfDefault, lossGivenDefault, exposureAtDefault);

    return {
      creditScore: this.calculateCreditScore(probabilityOfDefault),
      probabilityOfDefault,
      lossGivenDefault,
      exposureAtDefault,
      expectedLoss,
      unexpectedLoss,
      riskGrade: this.assignRiskGrade(probabilityOfDefault, expectedLoss)
    };
  }

  /**
   * LIQUIDITY RISK MODELING
   */
  static assessLiquidityRisk(cashFlows, assets, liabilities) {
    const metrics = {
      currentRatio: assets.current / liabilities.current,
      quickRatio: (assets.current - assets.inventory) / liabilities.current,
      cashRatio: assets.cash / liabilities.current,

      // Cash Flow-based metrics
      operatingCashFlowRatio: cashFlows.operating / liabilities.current,
      cashConversionCycle: this.calculateCashConversionCycle(assets, liabilities),

      // Stress scenarios
      survivalPeriod: this.calculateSurvivalPeriod(assets.cash, cashFlows.operating, liabilities.current)
    };

    return {
      metrics,
      riskLevel: this.determineLiquidityRiskLevel(metrics),
      recommendations: this.generateLiquidityRecommendations(metrics)
    };
  }

  // --- Helper Methods ---

  // Portfolio Risk Helpers
  static calculatePortfolioVaR(portfolio, marketData, confidenceLevel) {
    // Simplified parametric VaR
    const portfolioValue = portfolio.totalValue;
    const portfolioStdDev = marketData.volatility;
    const zScore = 1.645; // For 95% confidence
    return portfolioValue * portfolioStdDev * zScore;
  }
  static calculateExpectedShortfall(portfolio, marketData, confidenceLevel) {
    // Typically more complex, returning a value slightly higher than VaR
    return this.calculatePortfolioVaR(portfolio, marketData, confidenceLevel) * 1.2;
  }
  static stressTestMarketCrash(portfolio, marketData) { return portfolio.totalValue * -0.3; } // 30% loss
  static stressTestInterestRates(portfolio, marketData) { return portfolio.bondsValue * -0.05; } // 5% loss on bonds
  static stressTestInflation(portfolio, marketData) { return portfolio.cashValue * -0.03; } // 3% loss on cash
  static decomposePortfolioRisk(portfolio, marketData) {
    const totalValue = portfolio.totalValue || (portfolio.equityValue + portfolio.bondsValue);
    if (totalValue === 0) return { equityRisk: "0%", bondRisk: "0%" };

    const equityWeight = (portfolio.equityValue || 0) / totalValue;
    const bondWeight = (portfolio.bondsValue || 0) / totalValue;

    // Simplified: risk contribution is proportional to weight
    return {
        equityRisk: `${(equityWeight * 100).toFixed(0)}%`,
        bondRisk: `${(bondWeight * 100).toFixed(0)}%`,
    };
  }
  static calculateSharpeRatio(portfolioReturns, riskFreeRate) {
    if (!portfolioReturns || portfolioReturns.length < 2) return 0;

    const meanReturn = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
    const excessReturns = portfolioReturns.map(r => r - meanReturn);

    // Correctly calculate the standard deviation of excess returns
    const meanExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
    const squaredDiffs = excessReturns.map(r => Math.pow(r - meanExcessReturn, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / (excessReturns.length - 1); // Use n-1 for sample stdev
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    return (meanReturn - riskFreeRate) / stdDev;
  }
  static calculateSortinoRatio(portfolioReturns, riskFreeRate) {
    // Simplified Sortino: similar to Sharpe but only considers downside deviation
    if (!portfolioReturns || portfolioReturns.length < 2) return 0;

    const meanReturn = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
    const downsideReturns = portfolioReturns.filter(r => r < meanReturn);
    const squaredDiffs = downsideReturns.map(r => Math.pow(r - meanReturn, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / (downsideReturns.length -1);
    const downsideStdDev = Math.sqrt(variance);

    if (downsideStdDev === 0) return 0;

    return (meanReturn - riskFreeRate) / downsideStdDev;
  }
  static calculateCalmarRatio(portfolioReturns, riskFreeRate) {
      // Simplified Calmar: Annualized return over max drawdown
      if (!portfolioReturns || portfolioReturns.length === 0) return 0;

      const meanReturn = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
      const annualizedReturn = meanReturn * 12; // Assuming monthly returns

      let peak = -Infinity;
      let maxDrawdown = 0;
      portfolioReturns.forEach(r => {
          if (r > peak) peak = r;
          const drawdown = (peak - r) / peak;
          if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      });

      if (maxDrawdown === 0) return Infinity; // or handle as an edge case

      return annualizedReturn / maxDrawdown;
  }

  // Credit Risk Helpers
  static calculatePD(debts, income, assets) { return (debts.total / (income.annual + assets.total)) || 0.1; }
  static calculateLGD(assets, debts) { return Math.max(0, debts.total - assets.liquid) / debts.total || 0.4; }
  static calculateEAD(debts) { return debts.total * 0.9; } // Assume 90% is exposed
  static calculateUnexpectedLoss(pd, lgd, ead) { return ead * Math.sqrt(pd * (1 - pd) * lgd * lgd); }
  static calculateCreditScore(pd) { return Math.round(300 + (1 - pd) * 550); } // Scale 300-850
  static assignRiskGrade(pd, expectedLoss) {
      if (pd > 0.5) return 'High Risk';
      if (pd > 0.2) return 'Medium Risk';
      return 'Low Risk';
  }

  // Liquidity Risk Helpers
  static calculateCashConversionCycle(assets, liabilities) {
    // Placeholder. A real calculation needs Revenue and COGS.
    // Using a proxy based on current assets and liabilities.
    const inventoryRatio = assets.inventory / assets.current || 0.5;
    const liabilityRatio = liabilities.current / assets.current || 0.5;
    return 30 + (inventoryRatio * 30) - (liabilityRatio * 15); // Base of 30 days, adjusted by asset/liability structure
  }
  static calculateSurvivalPeriod(cash, cashFlow, liabilities) { return cash / (liabilities.current - cashFlow.operating) || 12; } // Months
  static determineLiquidityRiskLevel(metrics) {
      if (metrics.currentRatio < 1.0) return 'High';
      if (metrics.quickRatio < 0.5) return 'Medium';
      return 'Low';
  }
  static generateLiquidityRecommendations(metrics) {
      if (metrics.currentRatio < 1.0) return "Increase liquid assets or reduce short-term debt.";
      return "Liquidity position is stable.";
  }
}
