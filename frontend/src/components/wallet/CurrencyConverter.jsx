import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import api from '../../services/api';

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [amount, setAmount] = useState(100);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetQuote = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/crypto/quote', { fromCurrency, toCurrency, amount });
      setQuote(response.data);
    } catch (error) {
      console.error('Failed to get quote', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Currency Converter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          label="From"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        />
        <Input
          label="To"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        />
      </div>
      <Button onClick={handleGetQuote} disabled={loading} className="mt-4">
        {loading ? 'Getting Quote...' : 'Get Quote'}
      </Button>
      {quote && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>You will receive approximately: {quote.amount} {toCurrency}</p>
          <p className="text-sm text-gray-500">Rate: 1 {fromCurrency} = {quote.price} {toCurrency}</p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
