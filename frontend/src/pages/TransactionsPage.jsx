import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../FirebaseConfig';
import { collection, query, where, orderBy, onSnapshot, limit, getDocs, startAfter } from 'firebase/firestore';
import TransactionsList from '../components/transactions/TransactionsList';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsList = [];
      querySnapshot.forEach((doc) => {
        transactionsList.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsList);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchMoreTransactions = async () => {
    if (!hasMore) return;

    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const newTransactions = [];
    querySnapshot.forEach((doc) => {
      newTransactions.push({ id: doc.id, ...doc.data() });
    });

    setTransactions(prevTransactions => [...prevTransactions, ...newTransactions]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(querySnapshot.docs.length === 10);
  };

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
      <TransactionsList transactions={transactions} />
      {hasMore && <button onClick={fetchMoreTransactions}>Load More</button>}
    </div>
  );
};

export default TransactionsPage;
