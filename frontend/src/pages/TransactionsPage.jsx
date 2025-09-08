import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../FirebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsList = [];
      querySnapshot.forEach((doc) => {
        transactionsList.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!user) {
    return <div className="not-authenticated">Please log in to view your transactions.</div>;
  }

  return (
    <div>
      <h1>Transactions</h1>
      {transactions.length > 0 ? (
        <ul className="transaction-list-full">
          {transactions.map(transaction => (
            <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
              <div className="transaction-details">
                <span className="transaction-description">{transaction.description || 'Transaction'}</span>
                <span className="transaction-date">{transaction.timestamp?.toDate().toLocaleString()}</span>
              </div>
              <span className="transaction-amount">{transaction.type === 'debit' ? '-' : '+'}{transaction.amount?.toFixed(2) || '0.00'} {transaction.currency || ''}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-transactions">No transactions found.</div>
      )}
    </div>
  );
};

export default TransactionsPage;
