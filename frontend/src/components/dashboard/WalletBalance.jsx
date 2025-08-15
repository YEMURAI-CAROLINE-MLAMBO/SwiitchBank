import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import TopUpModal from '../wallet/TopUpModal';

const WalletBalance = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        // This is a placeholder endpoint
        const response = await api.get('/api/wallet');
        setWallets(response.data.wallets);
      } catch (error) {
        console.error('Failed to fetch wallet balance', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Your Wallets</h2>
      {wallets.map(wallet => (
        <div key={wallet.id} className="mb-4">
          <p className="text-gray-500">{wallet.currency}</p>
          <p className="text-2xl font-bold">${wallet.balance.toFixed(2)}</p>
        </div>
      ))}
      <Button onClick={() => setIsTopUpOpen(true)} variant="primary">Top Up</Button>
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </div>
  );
};

export default WalletBalance;
