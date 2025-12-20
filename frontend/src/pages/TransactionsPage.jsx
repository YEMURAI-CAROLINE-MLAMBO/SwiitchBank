import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadModal from '../components/UploadModal';
import swiitchSafeService from '../services/swiitchSafeService';
import { useAuth } from '../context/AuthContext';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get('/api/transactions');
        setTransactions(data);
      } catch (error) {
        setError('Error fetching transactions');
      }
    };
    fetchTransactions();
  }, []);

  const handleOpenModal = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionId(null);
  };

  const handleUpload = async (file) => {
    try {
      if (user) {
        await swiitchSafeService.uploadDocument(file, user.token, selectedTransactionId);
        handleCloseModal();
      }
    } catch (err) {
      setError('Error uploading document.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>
                <button onClick={() => handleOpenModal(transaction._id)}>Save to SwiitchSafe</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transactionId={selectedTransactionId}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default TransactionsPage;
