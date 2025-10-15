import React, { useState, useEffect } from 'react';
import { useUserCurrency } from '../context/UserCurrencyContext.jsx';
import axios from 'axios';

// This is a placeholder for a function that would convert currency.
const convertCurrency = async (amount, from, to) => {
    try {
        const response = await axios.post('/api/currency/convert', { amount, from, to });
        return response.data;
    } catch (error) {
        console.error('Error converting currency:', error);
        // Return a default conversion on error to avoid crashing
        return { convertedAmount: amount, rate: 1 };
    }
};

const CurrencyAmount = ({ amount, currency, showOriginal = true, className = '' }) => {
  const { currency: userCurrency } = useUserCurrency(); // From context
  const [converted, setConverted] = useState(null);

  useEffect(() => {
    const convertAmount = async () => {
      if (currency !== userCurrency) {
        const result = await convertCurrency(amount, currency, userCurrency);
        setConverted(result);
      }
    };

    convertAmount();
  }, [amount, currency, userCurrency]);

  const formatAmount = (amt, curr) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2
    }).format(amt);
  };

  return (
    <div className={`currency-amount ${className}`}>
      {/* Primary amount in user's currency */}
      <span className="primary-amount">
        {converted ? formatAmount(converted.convertedAmount, userCurrency) : formatAmount(amount, currency)}
      </span>

      {/* Original amount if different currency */}
      {showOriginal && converted && currency !== userCurrency && (
        <span className="original-amount">
          {formatAmount(amount, currency)}
        </span>
      )}

      {/* Exchange rate info */}
      {converted && (
        <div className="exchange-info">
          Rate: 1 {currency} = {converted.rate} {userCurrency}
        </div>
      )}
    </div>
  );
};

export default CurrencyAmount;
