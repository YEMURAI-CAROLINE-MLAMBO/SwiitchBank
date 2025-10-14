import React, { useState } from 'react';
import OverviewTab from '../components/dashboard/OverviewTab';
import TransactionsPage from './TransactionsPage';
import InsightsTab from '../components/dashboard/InsightsTab';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your financial overview.</p>
        </div>
        <div className="header-right">
          <button className="icon-button">🔔</button>
          <button className="icon-button">⚙️</button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-value">$12,458</div>
          <div className="stat-label">Total Balance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">$2,847</div>
          <div className="stat-label">Monthly Spending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">$1,250</div>
          <div className="stat-label">Monthly Income</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          💳 Transactions
        </button>
        <button
          className={activeTab === 'insights' ? 'active' : ''}
          onClick={() => setActiveTab('insights')}
        >
          🧠 Insights
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'transactions' && <TransactionsPage />}
        {activeTab === 'insights' && <InsightsTab />}
      </div>
    </div>
  );
};

export default DashboardPage;
