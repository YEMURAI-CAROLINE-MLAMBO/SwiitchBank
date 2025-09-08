import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../FirebaseConfig';
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import './WalletDashboard.css';

const WalletDashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Use a single loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.uid;

    // Listen for real-time updates to the wallet document
    const walletRef = doc(db, `users/${userId}/personalWallet/wallet`); // Adjust path if needed
    const unsubscribeWallet = onSnapshot(
      walletRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setWallet(docSnap.data());
          setError(null); // Clear any previous errors
        } else {
          setWallet(null); // Wallet document doesn't exist
          setError('Wallet not found.'); // Set an error message
        }
        // setLoading(false); // Don't set loading to false until transactions are also loaded
      },
      (err) => {
        console.error('Error fetching wallet:', err);
        setError('Failed to load wallet data.');
        setLoading(false);
      }
    );

    // Listen for real-time updates to the transactions collection
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId), // Filter transactions by user ID
      orderBy('timestamp', 'desc'), // Order by timestamp
      limit(10) // Limit to the last 10 transactions
    );

    const unsubscribeTransactions = onSnapshot(
      q,
      (querySnapshot) => {
        const transactionsList = [];
        querySnapshot.forEach((doc) => {
          transactionsList.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(transactionsList);
        setLoading(false); // Set loading to false after transactions are loaded
      },
      (err) => {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions.');
        setLoading(false); // Set loading to false in case of transaction errors
      }
    );

    // Clean up listeners on component unmount
    return () => {
      unsubscribeWallet();
      unsubscribeTransactions();
    };
  }, [user]); // Re-run effect if user changes

  // Render loading state
  if (loading) {
    return <div>Loading wallet data...</div>;
  }

  // Render error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Render not authenticated state
  if (!user) {
    return (
      <div className="not-authenticated">
        Please log in to view your wallet.
      </div>
    );
  }

  // Render wallet dashboard
  return (
    <div className="wallet-dashboard">
      <h3>My Wallet</h3>
      {wallet ? (
        <div className="wallet-summary">
          <p>
            Balance: {wallet.currency} {wallet.balance?.toFixed(2) || '0.00'}
          </p>
          {/* Add more wallet details if needed */}
        </div>
      ) : (
        <div className="no-wallet">No wallet found.</div>
      )}
      <h4>Recent Transactions</h4>
      {transactions.length > 0 ? (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className={`transaction-item ${transaction.type}`}
            >
              <span className="transaction-description">
                {transaction.description || 'Transaction'}
              </span>
              <span className="transaction-amount">
                {transaction.type === 'debit' ? '-' : '+'}
                {transaction.amount?.toFixed(2) || '0.00'}{' '}
                {transaction.currency || ''}
              </span>
              <span className="transaction-date">
                {transaction.timestamp?.toDate().toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-transactions">No recent transactions.</div>
      )}
      {/* Example button for issuing a virtual card (will connect to function later) */}
      <button onClick={() => console.log('Issue virtual card clicked')}>
        Issue Virtual Card
      </button>
    </div>
  );
};

export default WalletDashboard;
