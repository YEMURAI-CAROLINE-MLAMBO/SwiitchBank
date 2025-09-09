import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FiatCryptoBridge = () => {
  const [rates, setRates] = useState(null);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [amount, setAmount] = useState(0);
  const [tradeResult, setTradeResult] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await api.get('/api/fiat-crypto-bridge/rates');
        setRates(response.data);
      } catch (error) {
        console.error('Failed to fetch rates', error);
      }
    };

    fetchRates();
  }, []);

  const handleTrade = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/fiat-crypto-bridge/trade', {
        fromCurrency,
        toCurrency,
        amount,
      });
      setTradeResult(response.data);
    } catch (error) {
      console.error('Failed to perform trade', error);
      setTradeResult({ success: false, message: 'Failed to perform trade' });
    }
  };

  return (
    <div>
      <h3>Fiat-Crypto Bridge</h3>
      <div>
        <h4>Exchange Rates</h4>
        {rates ? (
          <ul>
            {Object.entries(rates).map(([pair, rate]) => (
              <li key={pair}>
                {pair}: {rate}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading rates...</p>
        )}
      </div>
      <div>
        <h4>Perform a Trade</h4>
        <form onSubmit={handleTrade}>
          <div>
            <label>From:</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          <div>
            <label>To:</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button type="submit">Trade</button>
        </form>
        {tradeResult && (
          <div>
            <p>
              {tradeResult.success
                ? `Trade successful: ${tradeResult.message}`
                : `Trade failed: ${tradeResult.message}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiatCryptoBridge;
