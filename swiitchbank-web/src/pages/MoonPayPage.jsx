import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MoonPayPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState(0);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const { data } = await axios.get('/api/moonpay/currencies');
        setCurrencies(data);
      } catch (error) {
        setError('Error fetching currencies');
      }
    };
    fetchCurrencies();
  }, []);

  const handleGetQuote = async () => {
    try {
      const { data } = await axios.get('/api/moonpay/quote', {
        params: {
          baseCurrencyCode: selectedCurrency,
          quoteCurrencyCode: 'usd',
          baseCurrencyAmount: amount,
        },
      });
      setQuote(data);
    } catch (error) {
      setError('Error getting quote');
    }
  };

  return (
    <div>
      <h2>Buy Cryptocurrency</h2>
      <div>
        <label>Select Currency:</label>
        <select onChange={(e) => setSelectedCurrency(e.target.value)}>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.code}>
              {currency.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button onClick={handleGetQuote}>Get Quote</button>
      {quote && (
        <div>
          <h3>Quote</h3>
          <p>Price: {quote.quoteCurrencyAmount} USD</p>
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default MoonPayPage;
