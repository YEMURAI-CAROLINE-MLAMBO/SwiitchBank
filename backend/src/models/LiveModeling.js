class LiveModeling {
  /**
   * REAL-TIME MODEL UPDATING WITH NEW DATA
   */
  static updateModelWithNewData(existingModel, newData) {
    const updatedModel = {
      ...existingModel,

      // Update projections with latest actuals
      projections: this.updateProjections(existingModel.projections, newData),

      // Recalibrate assumptions
      assumptions: this.recalibrateAssumptions(existingModel.assumptions, newData),

      // Update risk metrics
      riskMetrics: this.updateRiskMetrics(existingModel.riskMetrics, newData),

      // Generate new insights
      insights: this.generateNewInsights(existingModel, newData)
    };

    const changes = this.identifyMaterialChanges(existingModel, updatedModel);
    return {
      updatedModel,
      changes: changes,
      alerts: this.generateModelAlerts(updatedModel),
      recommendations: this.updateRecommendations(updatedModel, changes)
    };
  }

  /**
   * PREDICTIVE ALERT SYSTEM
   */
  static generatePredictiveAlerts(financialModel, thresholds) {
    const alerts = [];

    // Cash flow alerts
    if (financialModel.cashFlowProjection.minimumBalance < thresholds.minCashBalance) {
      alerts.push({
        type: 'cash_flow_warning',
        severity: 'high',
        message: 'Projected cash balance below minimum threshold',
        projectedDate: financialModel.cashFlowProjection.criticalDate,
        recommendedAction: 'Increase cash reserves or reduce expenses'
      });
    }

    // Investment risk alerts
    if (financialModel.riskMetrics.valueAtRisk > thresholds.maxVaR) {
      alerts.push({
        type: 'portfolio_risk_warning',
        severity: 'medium',
        message: 'Portfolio risk exceeds comfortable level',
        currentVaR: financialModel.riskMetrics.valueAtRisk,
        recommendedAction: 'Consider rebalancing to reduce risk exposure'
      });
    }

    // Goal achievement alerts
    financialModel.goals.forEach(goal => {
      if (goal.probabilityOfSuccess < thresholds.minGoalProbability) {
        alerts.push({
          type: 'goal_risk_warning',
          severity: 'medium',
          goal: goal.name,
          currentProbability: goal.probabilityOfSuccess,
          recommendedAction: 'Increase savings rate or adjust goal timeline'
        });
      }
    });

    return alerts;
  }

  // --- Helper Methods ---
  static updateProjections(projections, newData) {
    // In a real system, this would re-run parts of FinancialModel.js
    // For now, we'll keep it simple.
    return projections;
  }
  static recalibrateAssumptions(assumptions, newData) {
    // e.g., if inflation data is new, update inflation assumption
    if (newData.economicData?.inflationRate) {
        return { ...assumptions, inflation: newData.economicData.inflationRate };
    }
    return assumptions;
  }
  static updateRiskMetrics(riskMetrics, newData) {
    if (newData.marketPerformance < -0.05) { // 5% market drop
      return { ...riskMetrics, valueAtRisk: riskMetrics.valueAtRisk * 1.1 }; // Increase VaR by 10%
    }
    return riskMetrics;
  }
  static generateNewInsights(existingModel, newData) {
    const insights = [];
    if (newData.marketPerformance < -0.05) {
        insights.push("A recent market downturn has increased your portfolio's risk profile.");
    }
    if (newData.userSpending?.monthlyChange > 0.1) {
        insights.push(`Your spending has increased by over 10% last month. It might be a good time to review your budget.`);
    }
    return insights.length > 0 ? insights : ["Your financial model is stable. No new critical insights."];
  }
  static identifyMaterialChanges(existingModel, updatedModel) {
    const changes = [];
    const varChange = updatedModel.riskMetrics.valueAtRisk - existingModel.riskMetrics.valueAtRisk;

    if ((varChange / existingModel.riskMetrics.valueAtRisk) > 0.05) { // More than 5% increase
      changes.push({
          change: 'Value at Risk (VaR) Increased Significantly',
          from: existingModel.riskMetrics.valueAtRisk.toFixed(0),
          to: updatedModel.riskMetrics.valueAtRisk.toFixed(0)
      });
    }

    // Example check for goal probability (assuming it exists on the model)
    const goalProbChange = (updatedModel.goals?.[0].probability || 0) - (existingModel.goals?.[0].probability || 0);
    if(goalProbChange < -0.1) {
        changes.push({
            change: 'Retirement Goal Probability Decreased',
            from: existingModel.goals[0].probability,
            to: updatedModel.goals[0].probability
        });
    }
    return changes;
  }
  static generateModelAlerts(updatedModel) {
    const thresholds = { minCashBalance: 1000, maxVaR: 5000, minGoalProbability: 0.6 };
    return this.generatePredictiveAlerts(updatedModel, thresholds);
  }
  static updateRecommendations(updatedModel, changes) {
    const recommendations = [];
    const hasVaRIncrease = changes.some(c => c.change.includes('Value at Risk'));
    const hasGoalDecrease = changes.some(c => c.change.includes('Goal Probability Decreased'));

    if (hasVaRIncrease) {
        recommendations.push("Your portfolio risk has increased. Consider rebalancing towards less volatile assets.");
    }
    if (hasGoalDecrease) {
        recommendations.push("Your goal probability has dropped. Consider increasing your savings rate or adjusting your goal's timeline.");
    }
    return recommendations.length > 0 ? recommendations : ["Continue with your current financial plan."];
  }
}
