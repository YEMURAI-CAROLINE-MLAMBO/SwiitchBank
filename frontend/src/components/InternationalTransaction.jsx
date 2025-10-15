import React from 'react';
import CurrencyAmount from './CurrencyAmount.jsx';

const InternationalTransaction = ({ transaction }) => {
  return (
    <div className={`transaction-item international`}>
      <div className="transaction-flag">
        {transaction.internationalDetails?.country && (
          <span className={`fi fi-${transaction.internationalDetails.country.toLowerCase()}`}></span>
        )}
      </div>

      <div className="transaction-details">
        <div className="description">
          {transaction.description}
          {transaction.crossBorder && (
            <span className="international-badge">🌍 International</span>
          )}
        </div>

        <div className="transaction-meta">
          <span className="category">{transaction.category}</span>
          <span className="date">{transaction.date}</span>
          {transaction.internationalDetails?.merchantCountry && (
            <span className="country">{transaction.internationalDetails.merchantCountry}</span>
          )}
        </div>
      </div>

      <div className="transaction-amounts">
        <CurrencyAmount
          amount={transaction.amount}
          currency={transaction.currency}
          showOriginal={true}
        />

        {transaction.fxFee > 0 && (
          <div className="fx-fee">
            FX Fee: <CurrencyAmount amount={transaction.fxFee} currency={transaction.currency} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InternationalTransaction;
