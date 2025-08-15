import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import api from '../../services/api';

const TopUpModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopUp = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/api/wallet/topup', { amount, currency: 'USD', source: 'debit_card' });
      // In a real app, you would probably want to refetch the wallet balance
      onClose();
    } catch (err) {
      setError('Failed to top up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Your Wallet">
      <div className="space-y-4">
        <Input
          label="Amount (USD)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={handleTopUp} disabled={loading}>
            {loading ? 'Processing...' : `Top Up $${amount}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TopUpModal;
