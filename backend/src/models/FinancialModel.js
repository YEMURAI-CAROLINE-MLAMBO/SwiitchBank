import Finance from 'tvm-financejs';
const finance = new Finance();

class FinancialModel {
  /**
   * PERSONAL FINANCIAL STATEMENT MODELING
   */
  static createPersonalFinancialStatements(userId, historicalData, projections = {}) {
    const model = {
      // Income Statement Projection
      incomeStatement: this.projectIncomeStatement(historicalData.income, projections.incomeGrowth),

      // Balance Sheet Projection
      balanceSheet: this.projectBalanceSheet(historicalData.assets, historicalData.liabilities, projections),

      // Cash Flow Statement Projection
      cashFlowStatement: this.projectCashFlowStatement(historicalData.cashFlows, projections),

      // Key Financial Ratios
      financialRatios: this.calculateFinancialRatios(historicalData, projections),

      // Sensitivity Analysis
      sensitivity: this.analyzeSensitivity(projections, historicalData)
    };

    return model;
  }

  /**
   * INCOME STATEMENT PROJECTION
   */
  static projectIncomeStatement(historicalIncome, growthAssumptions) {
    const periods = 60; // 5 years monthly
    const projection = [];

    let currentRevenue = historicalIncome.monthlyAverage;

    for (let i = 0; i < periods; i++) {
      const period = {
        month: i + 1,
        revenue: currentRevenue,
        operatingExpenses: this.calculateOperatingExpenses(currentRevenue, growthAssumptions.expenseRatio),
        taxes: this.calculateTaxes(currentRevenue, growthAssumptions.taxRate),
        interestExpense: this.calculateInterestExpense(historicalIncome.debt, growthAssumptions.interestRate, historicalIncome.nper || 60, i + 1)
      };

      period.netIncome = period.revenue - period.operatingExpenses - period.taxes - period.interestExpense;
      period.operatingCashFlow = period.netIncome + this.calculateDepreciation(historicalIncome.assets);

      projection.push(period);

      // Apply growth rate
      currentRevenue *= (1 + growthAssumptions.monthlyGrowthRate);
    }

    return {
      projection,
      summary: this.summarizeIncomeStatement(projection),
      keyMetrics: this.calculateIncomeStatementMetrics(projection)
    };
  }

  /**
   * BALANCE SHEET PROJECTION
   */
  static projectBalanceSheet(assets, liabilities, projections) {
    return {
      assets: {
        current: this.projectCurrentAssets(assets.current, projections.assetGrowth),
        fixed: this.projectFixedAssets(assets.fixed, projections.depreciation),
        investments: this.projectInvestments(assets.investments, projections.investmentReturn)
      },
      liabilities: {
        current: this.projectCurrentLiabilities(liabilities.current, projections.liabilityGrowth),
        longTerm: this.projectLongTermDebt(liabilities.longTerm, projections.debtRepayment)
      },
      equity: this.calculateEquityProjection(assets, liabilities, projections.netIncome)
    };
  }

  /**
   * DISCOUNTED CASH FLOW (DCF) VALUATION
   */
  static calculateDCF(freeCashFlows, growthRate, discountRate, terminalGrowthRate = 0.02) {
    const projectionPeriod = freeCashFlows.length;
    const lastFCF = freeCashFlows[freeCashFlows.length - 1] || 0;

    // Calculate terminal value and its present value
    const terminalValue = (lastFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
    const presentValueTerminal = terminalValue / Math.pow(1 + discountRate, projectionPeriod);

    // Use the NPV function for the projected cash flows
    const npvOfFlows = finance.NPV(discountRate, ...freeCashFlows);

    const enterpriseValue = npvOfFlows + presentValueTerminal;

    return {
      enterpriseValue,
      equityValue: enterpriseValue - this.calculateNetDebt(freeCashFlows),
      npvOfFlows,
      terminalValue: {
        value: terminalValue,
        presentValue: presentValueTerminal,
        assumption: `Perpetual growth rate: ${terminalGrowthRate}`
      },
      sensitivity: this.analyzeDCVSensitivity(freeCashFlows, growthRate, discountRate)
    };
  }

  // --- Helper Methods ---

  // Income Statement Helpers
  static calculateOperatingExpenses(revenue, expenseRatio) { return revenue * expenseRatio; }
  static calculateTaxes(revenue, taxRate) { return revenue * taxRate; }
  static calculateInterestExpense(debt, interestRate, nper, per = 1) {
    // Using IPMT to calculate interest for a given period
    // Assumes the debt is a loan with regular payments, which is a reasonable approximation.
    return Math.abs(finance.IPMT(interestRate, per, nper, -debt));
  }
  static calculateDepreciation(assets) { return (assets.fixed || 0) * 0.05; } // Simplified straight-line
  static summarizeIncomeStatement(projection) {
    return projection.reduce((summary, period) => {
      summary.totalRevenue += period.revenue;
      summary.totalNetIncome += period.netIncome;
      return summary;
    }, { totalRevenue: 0, totalNetIncome: 0 });
  }
  static calculateIncomeStatementMetrics(projection) {
    const netProfitMargin = this.summarizeIncomeStatement(projection).totalNetIncome / this.summarizeIncomeStatement(projection).totalRevenue;
    return { netProfitMargin };
  }

  // Balance Sheet Helpers
  static projectCurrentAssets(current, growth) { return current * (1 + (growth || 0)); }
  static projectFixedAssets(fixed, depreciation) { return fixed - (depreciation || 0); }
  static projectInvestments(investments, returnRate) { return investments * (1 + (returnRate || 0)); }
  static projectCurrentLiabilities(current, growth) { return current * (1 + (growth || 0)); }
  static projectLongTermDebt(debt, repayment) { return debt - (repayment || 0); }
  static calculateEquityProjection(assets, liabilities, netIncome) {
      const totalAssets = (assets.current || 0) + (assets.fixed || 0) + (assets.investments || 0);
      const totalLiabilities = (liabilities.current || 0) + (liabilities.longTerm || 0);
      return totalAssets - totalLiabilities + (netIncome || 0);
  }

  // DCF Helpers
  static calculateTerminalValue(lastFCF, terminalGrowth, discountRate) {
    return (lastFCF * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
  }
  static calculateNetDebt(cashFlows) {
    // Simplified: assume net debt is a fraction of the final year's cash flow
    return (cashFlows[cashFlows.length - 1] || 0) * 0.1;
  }

  // Placeholder for complex methods
  static projectCashFlowStatement(incomeStatement, balanceSheet_current, balanceSheet_previous) {
    if (!balanceSheet_previous) {
        // Can't calculate changes for the first period
        return { cfo: incomeStatement.netIncome + this.calculateDepreciation(balanceSheet_current.assets), cfi: 0, cff: 0, netCashFlow: 0 };
    }

    const netIncome = incomeStatement.netIncome;
    const depreciation = this.calculateDepreciation(balanceSheet_current.assets);

    // Cash Flow from Operations (CFO) - simplified
    const deltaWorkingCapital = (balanceSheet_current.assets.current - balanceSheet_current.liabilities.current) - (balanceSheet_previous.assets.current - balanceSheet_previous.liabilities.current);
    const cfo = netIncome + depreciation - deltaWorkingCapital;

    // Cash Flow from Investing (CFI)
    const capex = (balanceSheet_current.assets.fixed - balanceSheet_previous.assets.fixed) + depreciation;
    const cfi = -capex;

    // Cash Flow from Financing (CFF)
    const deltaDebt = (balanceSheet_current.liabilities.longTerm - balanceSheet_previous.liabilities.longTerm);
    const cff = deltaDebt; // Simplified: assumes changes in long-term debt are the only financing activities

    const netCashFlow = cfo + cfi + cff;
    return { cfo, cfi, cff, netCashFlow };
  }
  static calculateFinancialRatios(balanceSheet, incomeStatement) {
    const debtToEquity = (balanceSheet.liabilities.current + balanceSheet.liabilities.longTerm) / balanceSheet.equity;
    const returnOnEquity = incomeStatement.netIncome / balanceSheet.equity;
    return { debtToEquity, returnOnEquity };
  }
  static analyzeSensitivity(projections, historical) {
    // Simple sensitivity: vary revenue growth
    const optimisticGrowth = projections.incomeGrowth.monthlyGrowthRate * 1.2;
    const pessimisticGrowth = projections.incomeGrowth.monthlyGrowthRate * 0.8;

    const optimisticCase = this.projectIncomeStatement(historical.income, { ...projections.incomeGrowth, monthlyGrowthRate: optimisticGrowth });
    const pessimisticCase = this.projectIncomeStatement(historical.income, { ...projections.incomeGrowth, monthlyGrowthRate: pessimisticGrowth });

    return {
        optimisticNetIncome: this.summarizeIncomeStatement(optimisticCase.projection).totalNetIncome,
        pessimisticNetIncome: this.summarizeIncomeStatement(pessimisticCase.projection).totalNetIncome,
    };
  }
  static analyzeDCVSensitivity(freeCashFlows, growthRate, discountRate) {
      // Create a sensitivity table for DCF valuation
      const rates = [discountRate * 0.9, discountRate, discountRate * 1.1];
      const growthRates = [growthRate * 0.9, growthRate, growthRate * 1.1];

      const sensitivityTable = rates.map(dr => {
          return growthRates.map(gr => {
              return this.calculateDCF(freeCashFlows, gr, dr).enterpriseValue;
          });
      });
      return {
          note: "Enterprise Value Sensitivity to Discount Rate (rows) and Growth Rate (columns)",
          discountRates: rates,
          growthRates: growthRates,
          table: sensitivityTable
      };
  }
}
