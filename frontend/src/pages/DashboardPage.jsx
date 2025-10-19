import React, { useState, useEffect } from 'react';
import { useAuth, apiClient } from '../context/AuthContext';
import OverviewTab from '../components/dashboard/OverviewTab';
import TransactionsPage from './TransactionsPage';
import InsightsTab from '../components/dashboard/InsightsTab';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css'; // Dedicated stylesheet

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      };

      try {
        // This endpoint will need to be created in the backend.
        // It should aggregate the necessary data for the dashboard view.
        const response = await apiClient.get('/dashboard/summary');
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="header-title">My Dashboard</h1>
          <p className="header-subtitle">Welcome back, {user?.displayName || user?.email}!</p>
        </div>
        <div className="header-right">
          <button className="icon-button" title="Notifications">🔔</button>
          <button className="icon-button" title="Settings" onClick={() => navigate('/settings')}>⚙️</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-label">Total Net Worth ({dashboardData?.netWorth.baseCurrency})</div>
          <div className="stat-value">{formatCurrency(dashboardData?.netWorth.totalNetWorth, dashboardData?.netWorth.baseCurrency)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly Spending</div>
          <div className="stat-value">{formatCurrency(dashboardData?.monthlySpending || 0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Recent Income</div>
          <div className="stat-value">{formatCurrency(dashboardData?.recentIncome || 0)}</div>
        </div>
      </div>

      <nav className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          💳 Transactions
        </button>
        <button
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          🧠 AI Insights
        </button>
      </nav>

      <main className="tab-content">
        {activeTab === 'overview' && <OverviewTab data={dashboardData} />}
        {activeTab === 'transactions' && <TransactionsPage />}
        {activeTab === 'insights' && <InsightsTab />}
      </main>
    </div>
  );
};

export default DashboardPage;