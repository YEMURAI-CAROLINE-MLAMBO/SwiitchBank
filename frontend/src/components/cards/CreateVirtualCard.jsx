import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const CreateVirtualCard = ({ onCardCreated }) => {
  const [newCardType, setNewCardType] = useState('');
  const [newCardNickname, setNewCardNickname] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCard = async () => {
    if (!newCardType || !newCardNickname) {
      alert('Please enter both card type and nickname.');
      return;
    }

    const functions = getFunctions();
    const createVirtualCard = httpsCallable(functions, 'createVirtualCard');
    setFeedbackMessage(null); // Clear previous feedback message
    setIsLoading(true);

    try {
      const result = await createVirtualCard({ type: newCardType, nickname: newCardNickname });
      setFeedbackMessage({ type: 'success', text: 'Virtual card created successfully!' });
      setNewCardType('');
      setNewCardNickname('');
      if (onCardCreated) {
        onCardCreated();
      }
    } catch (error) {
      console.error('Error creating virtual card:', error);
      setFeedbackMessage({ type: 'error', text: `Error creating virtual card: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Virtual Card</h2>
      {feedbackMessage && (
        <div className={`feedback-message ${feedbackMessage.type}`}>{feedbackMessage.text}</div>
      )}
      <div>
        <input type="text" placeholder="Card Type" value={newCardType} onChange={(e) => setNewCardType(e.target.value)} />
        <input type="text" placeholder="Nickname" value={newCardNickname} onChange={(e) => setNewCardNickname(e.target.value)} />
      </div>
      <button onClick={handleCreateCard} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Virtual Card'}
      </button>
    </div>
  );
};

export default CreateVirtualCard;
