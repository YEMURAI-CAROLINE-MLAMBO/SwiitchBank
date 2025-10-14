import React from 'react';
import '../../styles/richmont-enhancement.css';

/**
 * HOC to enhance existing components with Richmont styling
 */
export const withRichmontEnhancement = (WrappedComponent) => {
  return function RichmontEnhanced(props) {
    return (
      <div className="richmont-enhanced-container">
        <WrappedComponent
          {...props}
          className={`${props.className || ''} richmont-enhanced`}
        />
      </div>
    );
  };
};

/**
 * Specific enhancements for existing SwitchBank components
 */
export const RichmontEnhancements = {
  // Enhance existing FinancialOverview
  enhanceFinancialOverview: (OriginalComponent) => {
    return function EnhancedFinancialOverview(props) {
      return (
        <div className="richmont-financial-section">
          <div className="richmont-section-header">
            <h2 className="richmont-heading">Financial Overview</h2>
            <div className="richmont-accent-bar"></div>
          </div>
          <OriginalComponent {...props} />
        </div>
      );
    };
  },

  // Enhance existing TransactionList
  enhanceTransactionList: (OriginalComponent) => {
    return function EnhancedTransactionList(props) {
      return (
        <div className="richmont-transaction-section">
          <div className="richmont-section-header">
            <h2 className="richmont-heading">Recent Transactions</h2>
            <div className="richmont-accent-bar"></div>
          </div>
          <div className="richmont-card">
            <OriginalComponent {...props} />
          </div>
        </div>
      );
    };
  },

  // Enhance existing InsightsDashboard
  enhanceInsightsDashboard: (OriginalComponent) => {
    return function EnhancedInsightsDashboard(props) {
      return (
        <div className="richmont-insights-section">
          <div className="richmont-section-header">
            <h2 className="richmont-heading">AI Financial Insights</h2>
            <div className="richmont-accent-bar"></div>
          </div>
          <div className="richmont-card richmont-insights-card">
            <OriginalComponent {...props} />
          </div>
        </div>
      );
    };
  }
};
