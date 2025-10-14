import React from 'react';
import '../../styles/clean-but-useful.css';
import { RichmontEnhancements } from '../enhancements/RichmontEnhancer';

// Import existing SwitchBank components
import FinancialOverview from '../FinancialOverview';
import TransactionList from '../TransactionList';
import InsightsDashboard from '../InsightsDashboard';
import ChatInterface from '../ChatInterface';

// Create enhanced versions
const EnhancedFinancialOverview = RichmontEnhancements.enhanceFinancialOverview(FinancialOverview);
const EnhancedTransactionList = RichmontEnhancements.enhanceTransactionList(TransactionList);
const EnhancedInsightsDashboard = RichmontEnhancements.enhanceInsightsDashboard(InsightsDashboard);

const EnhancedDashboard = () => {
  return (
    <div className="enhanced-dashboard smart-clean">
      {/* Enhanced Header */}
      <header className="richmont-header">
        <div className="richmont-logo-section">
          <h1 className="richmont-logo">SwitchBank</h1>
        </div>
        <nav className="richmont-nav">
          {/* Existing navigation enhanced */}
        </nav>
      </header>

      {/* Main Content - Enhanced Existing Components */}
      <main className="enhanced-main-content">
        <section className="dashboard-grid">
          <div className="grid-column">
            <EnhancedFinancialOverview />
            <EnhancedTransactionList />
          </div>

          <div className="grid-column">
            <EnhancedInsightsDashboard />
            <ChatInterface /> {/* Enhanced separately */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EnhancedDashboard;
