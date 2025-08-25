import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig'; // Assuming you have firebaseConfig.js in src
import { doc, onSnapshot, collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Button } from '../common'; // Assuming common Button component

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
    const unsubscribeWallet = onSnapshot(walletRef, (docSnap) => {
      if (docSnap.exists()) {
        setWallet(docSnap.data());
        setError(null); // Clear any previous errors
      } else {
        setWallet(null); // Wallet document doesn't exist
        setError('Wallet not found.'); // Set an error message
      }
      // setLoading(false); // Don't set loading to false until transactions are also loaded
    }, (err) => {
      console.error("Error fetching wallet:", err);
      setError("Failed to load wallet data.");
      setLoading(false);
    });

    // Listen for real-time updates to the transactions collection
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId), // Filter transactions by user ID
      orderBy('timestamp', 'desc'), // Order by timestamp
      limit(10) // Limit to the last 10 transactions
    );

    const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
      const transactionsList = [];
      querySnapshot.forEach((doc) => {
        transactionsList.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsList);
      setLoading(false); // Set loading to false after transactions are loaded
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
      setLoading(false); // Set loading to false in case of transaction errors
    });


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
    return <div className="not-authenticated">Please log in to view your wallet.</div>;
  }


  // Render wallet dashboard
  return (
    <div className="wallet-dashboard">
      <h3>My Wallet</h3>
      {wallet ? (<div className="wallet-summary"><p>Balance: {wallet.currency} {wallet.balance?.toFixed(2) || '0.00'}</p>{/* Add more wallet details if needed */}</div>) : (<div className="no-wallet">No wallet found.</div>)}
      <h4>Recent Transactions</h4>
      {transactions.length > 0 ? (<ul className="transaction-list">{transactions.map(transaction => (<li key={transaction.id} className={`transaction-item ${transaction.type}`}><span className="transaction-description">{transaction.description || 'Transaction'}</span><span className="transaction-amount">{transaction.type === 'debit' ? '-' : '+'}{transaction.amount?.toFixed(2) || '0.00'} {transaction.currency || ''}</span><span className="transaction-date">{transaction.timestamp?.toDate().toLocaleString()}</span></li>))}</ul>) : (<div className="no-transactions">No recent transactions.</div>)}
      {/* Example button for issuing a virtual card (will connect to function later) */}
      <Button onClick={() => console.log('Issue virtual card clicked')}>Issue Virtual Card</Button>
    </div>);
};

export default WalletDashboard;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
<<<<<<< HEAD
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

import { db } from '../../firebaseConfig'; // Assuming you have firebaseConfig.js in src
import { doc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { Button } from '../common'; // Assuming common Button component

const WalletDashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.uid;
    const walletRef = doc(db, `users/${userId}/personalWallet/wallet`); // Adjust path if needed

    // Listen for real-time updates to the wallet document
    const unsubscribeWallet = onSnapshot(walletRef, (docSnap) => {
      if (docSnap.exists()) {
        setWallet(docSnap.data());
      } else {
        setWallet(null); // Wallet document doesn't exist
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching wallet:", err);
      setError("Failed to load wallet data.");
      setLoading(false);
    });

    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId), // Filter transactions by user ID
      orderBy('timestamp', 'desc'), // Order by timestamp
      limit(10) // Limit to the last 10 transactions
    );


    // Listen for real-time updates to the transactions collection
    const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
      const transactionsList = [];
      querySnapshot.forEach((doc) => {
        transactionsList.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsList);
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
    });


    // Clean up listeners on component unmount
    return () => {
      unsubscribeWallet();
      unsubscribeTransactions();
    };
  }, [user]); // Re-run effect if user changes

  if (loading) {
>>>>>>> cafcf5e (Changes before Firebase Studio auto-run

  return (
    <div className="wallet-dashboard">
<<<<<<< HEAD
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
=======
      <h3>My Wallet</h3>
      {wallet ? (
        <div className="wallet-summary">
          <p>Balance: {wallet.currency} {wallet.balance.toFixed(2)}</p>
          {/* Add more wallet details if needed */}
        </div>
      ) : (
        <div className="no-wallet">No wallet found.</div>
      )}

<<<<<<< HEAD
      <h4>Recent Transactions</h4>
      {transactions.length > 0 ? (
        <ul className="transaction-list">
          {transactions.map(transaction => (
            <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
              <span className="transaction-description">{transaction.description || 'Transaction'}</span>
  
=======
export default WalletDashboard;
>>>>>>> ddeeda8d883ffc3923ec58acd2eee5dfb8473380
