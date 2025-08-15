import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // This is a placeholder endpoint
        const response = await api.get('/api/transactions');
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <ul className="divide-y divide-gray-200">
        {transactions.length > 0 ? (
          transactions.map(tx => (
            <li key={tx.id} className="py-4 flex justify-between">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
              </div>
              <p className={`font-semibold ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
              </p>
            </li>
          ))
        ) : (
          <p>No transactions yet.</p>
        )}
      </ul>
    </div>
  );
};

export default TransactionHistory;
