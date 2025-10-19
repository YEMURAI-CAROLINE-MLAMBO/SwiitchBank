import React, { useState } from 'react';

const TransactionsList = ({ transactions }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    search: ''
  });

  const filteredTransactions = transactions.filter(t => {
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="transactions-list">
      {/* Filters */}
      <div className="transaction-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
        >
          <option value="all">All Categories</option>
          <option value="Groceries">Groceries</option>
          <option value="Dining">Dining</option>
          <option value="Transportation">Transportation</option>
          <option value="Income">Income</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Transactions */}
      <div className="transactions">
        {filteredTransactions.map(transaction => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-icon">
              {transaction.amount > 0 ? '💰' : '💸'}
            </div>

            <div className="transaction-details">
              <div className="transaction-description">
                {transaction.description}
              </div>
              <div className="transaction-meta">
                <span className="category">{transaction.category}</span>
                <span className="date">{transaction.date}</span>
              </div>
            </div>

            <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
            </div>

            <button className="transaction-menu">⋯</button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
