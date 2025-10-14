import React from 'react';

const OverviewTab = () => {
  return (
    <div className="overview-tab">
      {/* Accounts Summary */}
      <section className="accounts-section">
        <h3>Your Accounts</h3>
        <div className="accounts-list">
          <div className="account-item">
            <div className="account-info">
              <div className="account-icon">🏦</div>
              <div>
                <div className="account-name">Chase Checking</div>
                <div className="account-number">••• 4582</div>
              </div>
            </div>
            <div className="account-balance">$8,452</div>
          </div>
          <div className="account-item">
            <div className="account-info">
              <div className="account-icon">💳</div>
              <div>
                <div className="account-name">Capital One Savings</div>
                <div className="account-number">••• 7391</div>
              </div>
            </div>
            <div className="account-balance">$4,006</div>
          </div>
        </div>
      </section>

      {/* Spending by Category */}
      <section className="spending-section">
        <h3>Spending by Category</h3>
        <div className="category-chart">
          <div className="category-item">
            <div className="category-bar" style={{width: '40%'}}></div>
            <span>🛒 Groceries</span>
            <span>$487</span>
          </div>
          <div className="category-item">
            <div className="category-bar" style={{width: '25%'}}></div>
            <span>🍽️ Dining</span>
            <span>$324</span>
          </div>
          <div className="category-item">
            <div className="category-bar" style={{width: '15%'}}></div>
            <span>🚗 Transportation</span>
            <span>$198</span>
          </div>
        </div>
      </section>

      {/* Recent Transactions Preview */}
      <section className="recent-transactions">
        <h3>Recent Transactions</h3>
        <div className="transactions-preview">
          <div className="transaction-item">
            <div className="transaction-main">
              <span>Whole Foods Market</span>
              <span className="amount negative">-$84.52</span>
            </div>
            <div className="transaction-date">Today</div>
          </div>
          <div className="transaction-item">
            <div className="transaction-main">
              <span>Starbucks</span>
              <span className="amount negative">-$5.75</span>
            </div>
            <div className="transaction-date">Yesterday</div>
          </div>
        </div>
        <button className="view-all-button">View All Transactions →</button>
      </section>
    </div>
  );
};

export default OverviewTab;
