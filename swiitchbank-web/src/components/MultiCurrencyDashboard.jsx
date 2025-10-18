import React, { useState, useEffect } from 'react';
import CurrencySelector from './CurrencySelector.jsx';
import CurrencyAmount from './CurrencyAmount.jsx';
import axios from 'axios';

const MultiCurrencyDashboard = () => {
  const [netWorth, setNetWorth] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    const fetchNetWorth = async () => {
      try {
        const response = await axios.get(`/api/currency/net-worth?currency=${selectedCurrency}`);
        setNetWorth(response.data);
      } catch (error) {
        console.error('Error fetching net worth:', error);
      }
    };
    fetchNetWorth();
  }, [selectedCurrency]);

  return (
    <div className="multi-currency-dashboard">
      {/* Currency Header */}
      <div className="currency-header">
        <h1>Global Financial Overview</h1>
        <CurrencySelector
          currentCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />
      </div>

      {/* Multi-Currency Net Worth */}
      <div className="global-net-worth">
        <h2>Total Net Worth</h2>
        <CurrencyAmount
          amount={netWorth.totalNetWorth || 0}
          currency={netWorth.baseCurrency || selectedCurrency}
          className="net-worth-amount"
        />

        {/* Currency Allocation Chart */}
        <div className="currency-allocation">
          <h3>Currency Allocation</h3>
          <div className="allocation-chart">
            {netWorth.currencyBreakdown?.map(currency => (
              <div key={currency.fromCurrency} className="currency-allocation-item">
                <div className="currency-info">
                  <span className="currency-code">{currency.fromCurrency}</span>
                  <span className="currency-percentage">
                    {netWorth.totalNetWorth > 0 ? ((currency.convertedAmount / netWorth.totalNetWorth) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="allocation-bar">
                  <div
                    className="allocation-fill"
                    style={{ width: `${netWorth.totalNetWorth > 0 ? (currency.convertedAmount / netWorth.totalNetWorth) * 100 : 0}%` }}
                  ></div>
                </div>
                <CurrencyAmount
                  amount={currency.amount}
                  currency={currency.fromCurrency}
                  className="currency-amount"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Border Insights */}
      <div className="cross-border-insights">
        <h3>🌍 International Activity</h3>
        <div className="insight-cards">
          <div className="insight-card">
            <div className="insight-value">{netWorth.countriesVisited || 0}</div>
            <div className="insight-label">Countries Spent In</div>
          </div>
          <div className="insight-card">
            <CurrencyAmount
              amount={netWorth.internationalSpending || 0}
              currency={selectedCurrency}
              className="insight-value"
            />
            <div className="insight-label">International Spending</div>
          </div>
          <div className="insight-card">
            <CurrencyAmount
              amount={netWorth.fxFees || 0}
              currency={selectedCurrency}
              className="insight-value"
            />
            <div className="insight-label">Total FX Fees</div>
          </div>
        </div>
      </div>

      {/* Sophia Multi-Currency Advice */}
      <div className="sophia-currency-advice">
        <h4>🧠 Sophia's Currency Strategy</h4>
        <p>{netWorth.currencyAdvice || "No advice available at the moment."}</p>
      </div>
    </div>
  );
};

export default MultiCurrencyDashboard;
