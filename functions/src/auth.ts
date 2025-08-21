import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Assuming you have a firebaseConfig.js file exporting 'db'

function WalletDashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState(null);

  // Listen for real-time updates to the user's personal wallet
  useEffect(() => {
    if (!user) {
      setLoadingWallet(false);
      return;
    }

    const walletRef = doc(db, 'users', user.uid, 'personalWallet'); // Adjust path if needed

    const unsubscribeWallet = onSnapshot(walletRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setWallet(docSnapshot.data());
        setError(null); // Clear any previous errors
      } else {
        setWallet(null); // Wallet document doesn't exist
        setError('Wallet not found.'); // Set an error message
      }
      setLoadingWallet(false);
    }, (err) => {
      console.error('Error fetching wallet:', err);
      setError('Failed to load wallet data.');
      setLoadingWallet(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribeWallet();
  }, [user]); // Rerun effect if user changes

  // Listen for real-time updates to the user's transactions
  useEffect(() => {
    if (!user) {
      setLoadingTransactions(false);
      return;
    }

    // Query for transactions related to the user, ordered by timestamp
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid), // Filter by user ID
      orderBy('timestamp', 'desc') // Order by timestamp (newest first)
    );

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (querySnapshot) => {
      const userTransactions = [];
      querySnapshot.forEach((doc) => {
        userTransactions.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(userTransactions);
      setLoadingTransactions(false);
    }, (err) => {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transaction history.');
      setLoadingTransactions(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribeTransactions();
  }, [user]); // Rerun effect if user changes


  if (!user) {
    return <div>Please log in to view your wallet.</div>;
  }

  if (loadingWallet || loadingTransactions) {
    return <div>Loading wallet data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="wallet-dashboard">
      <h2>My Wallet</h2>
      {wallet ? (
        <div className="wallet-balance">
          Current Balance: {wallet.balance?.toFixed(2) || '0.00'} {wallet.currency || ''}
        </div>
      ) : (
        <div className="wallet-balance">No wallet found.</div>
      )}

      <h3>Transaction History</h3>
      {transactions.length > 0 ? (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <span>{transaction.type?.toUpperCase()}</span> - {transaction.amount?.toFixed(2) || '0.00'} {transaction.currency || ''} - {transaction.timestamp?.toDate().toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
}

export default WalletDashboard;
        
