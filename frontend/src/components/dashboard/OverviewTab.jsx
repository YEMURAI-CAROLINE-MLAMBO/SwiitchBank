import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OverviewTab.css'; // Dedicated stylesheet for this component

const OverviewTab = ({ data }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!data) {
    return <div>Loading overview...</div>;
  }

  const { netWorth, spendingAnalysis, recentTransactions } = data;

  return (
    <div className="overview-tab-grid">
      {/* Accounts Summary */}
      <section className="dashboard-card accounts-summary">
        <h3 className="card-title">Your Accounts</h3>
        <div className="accounts-list">
          {netWorth?.currencyBreakdown?.length > 0 ? (
            netWorth.currencyBreakdown.map(({ currency, totalBalance }) => (
              <div className="account-item" key={currency}>
                <div className="account-info">
                  <div className="account-icon">{currency}</div>
                  <div>
                    <div className="account-name">{currency} Balance</div>
                    <div className="account-balance">{formatCurrency(totalBalance, currency)}</div>
                  </div>
                </div>
                <div className="account-value-base">
                  ~ {formatCurrency(totalBalance * (netWorth.rates[currency] || 1), netWorth.baseCurrency)}
                </div>
              </div>
            ))
          ) : (
            <p className="no-data-message">No account data available.</p>
          )}
        </div>
      </section>

      {/* Spending by Category */}
      <section className="dashboard-card spending-category">
        <h3 className="card-title">Spending by Category</h3>
        <div className="category-list">
          {spendingAnalysis?.topCategories?.length > 0 ? (
            spendingAnalysis.topCategories.map(({ category, totalAmount }) => (
              <div className="category-item" key={category}>
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">{formatCurrency(totalAmount)}</span>
                </div>
                {/* Visual bar would go here */}
              </div>
            ))
          ) : (
            <p className="no-data-message">Not enough data for spending analysis.</p>
          )}
        </div>
      </section>

      {/* Recent Transactions Preview */}
      <section className="dashboard-card recent-transactions">
        <h3 className="card-title">Recent Transactions</h3>
        <div className="transactions-preview-list">
          {recentTransactions?.length > 0 ? (
            recentTransactions.map((tx) => (
              <div className="transaction-item" key={tx._id}>
                <div className="transaction-icon">🛒</div>
                <div className="transaction-details">
                  <span className="transaction-merchant">{tx.merchant?.name || 'N/A'}</span>
                  <span className="transaction-date">{new Date(tx.created_time).toLocaleDateString()}</span>
                </div>
                <span className={`transaction-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(tx.amount, tx.currency)}
                </span>
              </div>
            ))
          ) : (
            <p className="no-data-message">You have no recent transactions.</p>
          )}
        </div>
        <button className="view-all-button" onClick={() => navigate('/transactions')}>
          View All Transactions →
        </button>
      </section>
    </div>
  );
};

export default OverviewTab;