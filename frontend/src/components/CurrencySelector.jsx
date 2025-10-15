import React, { useState } from 'react';

import axios from 'axios';
// This is a placeholder for a component that would display a live exchange rate.
const LiveRate = ({ fromCurrency, toCurrency }) => {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    const fetchRate = async () => {
      if (fromCurrency && toCurrency) {
        try {
          const response = await axios.get(`/api/currency/rates?base=${fromCurrency}&symbols=${toCurrency}`);
          setRate(response.data.rates[toCurrency].toFixed(4));
        } catch (error) {
          console.error("Failed to fetch live rate", error);
          setRate("N/A");
        }
      }
    };
    fetchRate();
  }, [fromCurrency, toCurrency]);

  return <span>{rate || '...'} {toCurrency}</span>;
};

const CurrencySelector = ({ onCurrencyChange, currentCurrency }) => {
  const [currencies] = useState([
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    // Crypto currencies
    { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
    { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
    { code: 'USDC', symbol: 'USDC', name: 'USD Coin' }
  ]);

  return (
    <div className="currency-selector">
      <select
        value={currentCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="currency-dropdown"
      >
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code} - {currency.name}
          </option>
        ))}
      </select>

      {/* Live exchange rate display */}
      <div className="exchange-rate-display">
        <span>1 {currentCurrency} = </span>
        <LiveRate fromCurrency={currentCurrency} toCurrency="USD" />
      </div>
    </div>
  );
};

export default CurrencySelector;
