import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const TopUpVirtualCard = ({ onTopUpSuccess }) => {
  const [cardId, setCardId] = useState('');
  const [amount, setAmount] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopUp = async () => {
    if (!cardId || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setFeedbackMessage({ type: 'error', text: 'Please enter a valid card ID and a positive number for the amount.' });
      return;
    }

    const functions = getFunctions();
    const topUpVirtualCard = httpsCallable(functions, 'topUpVirtualCard');
    setFeedbackMessage(null);
    setIsLoading(true);

    try {
      await topUpVirtualCard({ cardId, amount: parseFloat(amount) });
      setFeedbackMessage({ type: 'success', text: 'Card topped up successfully!' });
      setCardId('');
      setAmount('');
      if (onTopUpSuccess) {
        onTopUpSuccess();
      }
    } catch (error) {
      console.error('Error topping up card:', error);
      setFeedbackMessage({ type: 'error', text: `Error topping up card: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Top Up Virtual Card</h2>
      {feedbackMessage && (
        <div className={`feedback-message ${feedbackMessage.type}`}>{feedbackMessage.text}</div>
      )}
      <div>
        <input type="text" placeholder="Card ID" value={cardId} onChange={(e) => setCardId(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button onClick={handleTopUp} disabled={isLoading}>
        {isLoading ? 'Topping Up...' : 'Top Up Card'}
      </button>
    </div>
  );
};

export default TopUpVirtualCard;
