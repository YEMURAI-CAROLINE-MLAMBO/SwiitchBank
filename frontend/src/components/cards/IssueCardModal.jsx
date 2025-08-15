import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../services/api';

const IssueCardModal = ({ isOpen, onClose, onCardIssued }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIssueCard = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/api/cards/issue', { card_type: 'VIRTUAL', currency: 'USD' });
      onCardIssued();
      onClose();
    } catch (err) {
      setError('Failed to issue card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue New Virtual Card">
      <p className="mb-4">You are about to issue a new virtual Mastercard. This card will be linked to your primary USD wallet.</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-end space-x-4">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button onClick={handleIssueCard} disabled={loading}>
          {loading ? 'Issuing...' : 'Confirm'}
        </Button>
      </div>
    </Modal>
  );
};

export default IssueCardModal;
