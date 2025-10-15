import Finance from 'tvm-financejs';
const finance = new Finance();

class ScenarioEngine {
  /**
   * COMPREHENSIVE SCENARIO ANALYSIS
   */
  static analyzeFinancialScenarios(baseCase, scenarios) {
    const results = {};

    for (const [scenarioName, scenario] of Object.entries(scenarios)) {
      results[scenarioName] = this.runScenarioAnalysis(baseCase, scenario);
    }

    return {
      scenarios: results,
      sensitivity: this.analyzeCrossScenarioSensitivity(results),
      optimalActions: this.determineOptimalActions(results),
      earlyWarningSignals: this.identifyWarningSignals(results)
    };
  }

  /**
   * RETIREMENT SCENARIOS
   */
  static createRetirementScenarios(baseScenario) {
    return {
      baseCase: baseScenario,

      optimistic: {
        ...baseScenario,
        expectedReturn: baseScenario.expectedReturn + 0.02, // +2% returns
        inflation: baseScenario.expectedInflation - 0.01,   // -1% inflation
        lifeExpectancy: baseScenario.lifeExpectancy + 5     // Live 5 years longer
      },

      pessimistic: {
        ...baseScenario,
        expectedReturn: baseScenario.expectedReturn - 0.03, // -3% returns
        inflation: baseScenario.expectedInflation + 0.02,   // +2% inflation
        lifeExpectancy: baseScenario.lifeExpectancy - 3,    // Live 3 years less
        healthcareCosts: baseScenario.healthcareCosts * 1.5 // 50% higher healthcare
      },

      marketCrash: {
        ...baseScenario,
        marketEvents: [
          { year: 5, return: -0.35 }, // 35% market crash
          { year: 6, return: 0.15 }   // Partial recovery
        ]
      }
    };
  }

  /**
   * REAL ESTATE SCENARIOS
   */
  static createRealEstateScenarios(property, market) {
    return {
      baseCase: {
        appreciation: market.historicalAppreciation,
        rentalGrowth: market.inflation + 0.01,
        vacancyRate: market.averageVacancy
      },

      boomMarket: {
        appreciation: market.historicalAppreciation + 0.04,
        rentalGrowth: market.inflation + 0.03,
        vacancyRate: market.averageVacancy * 0.7
      },

      recession: {
        appreciation: -0.02,
        rentalGrowth: market.inflation - 0.02,
        vacancyRate: market.averageVacancy * 1.8
      },

      highInflation: {
        appreciation: market.inflation + 0.02,
        rentalGrowth: market.inflation + 0.04,
        vacancyRate: market.averageVacancy
      }
    };
  }

  // --- Helper Methods ---
  static runScenarioAnalysis(baseCase, scenario) {
    // Run a simple, deterministic retirement projection based on scenario parameters
    let portfolioValue = baseCase.initialPortfolio;

    for (let year = baseCase.currentAge; year <= baseCase.lifeExpectancy; year++) {
        const marketReturn = scenario.expectedReturn ?? baseCase.expectedReturn;
        const inflation = scenario.inflation ?? baseCase.expectedInflation;

        // Handle special market events
        const marketEvent = scenario.marketEvents?.find(e => e.year === (year - baseCase.currentAge));
        const currentYearReturn = marketEvent ? marketEvent.return : marketReturn;

        if (year < baseCase.retirementAge) {
            const contribution = baseCase.annualContribution * Math.pow(1 + inflation, year - baseCase.currentAge);
            portfolioValue = portfolioValue * (1 + currentYearReturn) + contribution;
        } else {
            const withdrawal = (baseCase.withdrawalStrategy?.rate || 0.04) * portfolioValue;
            portfolioValue = portfolioValue * (1 + currentYearReturn) - withdrawal;
        }
    }

    return {
      finalPortfolioValue: portfolioValue,
      success: portfolioValue > 0
    };
  }
  static analyzeCrossScenarioSensitivity(results) {
    const outcomes = Object.values(results).map(r => r.finalPortfolioValue);
    const maxOutcome = Math.max(...outcomes);
    const minOutcome = Math.min(...outcomes);
    const range = maxOutcome - minOutcome;

    let sensitivity = "Low";
    if (range > 500000) sensitivity = "High";
    else if (range > 200000) sensitivity = "Medium";

    return { sensitivity, range: `$${range.toFixed(0)}` };
  }
  static determineOptimalActions(results) {
    let bestScenario = 'baseCase';
    let maxReturn = -Infinity;

    for (const [name, result] of Object.entries(results)) {
        if (result.finalPortfolioValue > maxReturn) {
            maxReturn = result.finalPortfolioValue;
            bestScenario = name;
        }
    }
    return `The '${bestScenario}' scenario yields the highest projected outcome of $${maxReturn.toFixed(0)}.`;
  }
  static identifyWarningSignals(results) {
    const warnings = [];
    if (results.pessimistic?.success === false) {
        warnings.push("Warning: Under pessimistic assumptions, your portfolio is projected to run out of funds.");
    }
    if (results.marketCrash?.finalPortfolioValue < (results.baseCase.finalPortfolioValue / 2)) {
        warnings.push("Warning: A market crash early in your projection significantly reduces your final portfolio value.");
    }
    return warnings.length > 0 ? warnings : ["No critical warning signals identified in the analyzed scenarios."];
  }
}
