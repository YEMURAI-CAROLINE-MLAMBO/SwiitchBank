import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import WalletDashboard from '../components/wallet/WalletDashboard';
import { getFunctions, httpsCallable } from 'firebase/functions';
import VirtualCardManager from '../components/cards/VirtualCardManager';

function WalletPage() {
  const [virtualCards, setVirtualCards] = useState([]);
  const { currentUser } = useAuth(); // Get the current user from AuthContext
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
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating virtual card:', error);
      setFeedbackMessage({ type: 'error', text: `Error creating virtual card: ${error.message}` });
    }
  };

  const handleTopUpCard = async () => {
    const cardId = prompt('Enter the ID of the card to top up:');
    if (!cardId) return;

    const amount = prompt('Enter the amount to top up:');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
 setFeedbackMessage({ type: 'error', text: 'Please enter a valid positive number for the amount.' });
      return;
    }

    const functions = getFunctions();
    const topUpVirtualCard = httpsCallable(functions, 'topUpVirtualCard');
 setFeedbackMessage(null); // Clear previous feedback message
    setIsLoading(true);

    try {
      const result = await topUpVirtualCard({ cardId, amount: parseFloat(amount) });
      setFeedbackMessage({ type: 'success', text: 'Card topped up successfully!' });
    } catch (error) {
      setIsLoading(false);
 setFeedbackMessage(null); // Clear previous feedback message
      console.error('Error topping up card:', error);
      setFeedbackMessage({ type: 'error', text: `Error topping up card: ${error.message}` });
    }
  };

  useEffect(() => {
    const fetchVirtualCards = async () => {
      setIsLoading(true);
      if (currentUser) {
        const db = getFirestore();
        const virtualCardsCollection = collection(db, 'virtualCards');
        // Assuming you store virtual cards with a userId field
        const q = query(virtualCardsCollection, where('userId', '==', currentUser.uid));

        try {
          const querySnapshot = await getDocs(q);
          const cardsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVirtualCards(cardsData);
        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching virtual cards:', error);
 setVirtualCards([]); // Clear cards on error or no user
        }
      setIsLoading(false);
      } else {
 setVirtualCards([]); // Clear cards if no user is logged in
 setIsLoading(false);
      }
    };
    fetchVirtualCards();
  }, [currentUser]); // Refetch when currentUser changes

  // Render loading state or a message if no user
  if (!currentUser) {
    return <div className="wallet-page"><h1>My Wallet</h1><p>Please log in to view your wallet and virtual cards.</p></div>;
  }

  return (
    <div className="wallet-page">
      {isLoading && <div className="loading">Loading...</div>}
      <h1>My Wallet</h1>
      <WalletDashboard />
      <h2>Virtual Cards</h2>
      {virtualCards.map(card => (
        <VirtualCardManager key={card.id} card={card} />
      ))}
      {feedbackMessage && (
        <div className={`feedback-message ${feedbackMessage.type}`}>{feedbackMessage.text}</div>
      )}
      <h2>Create New Virtual Card</h2>
      <div>
        <input type="text" placeholder="Card Type" value={newCardType} onChange={(e) => setNewCardType(e.target.value)} />
        <input type="text" placeholder="Nickname" value={newCardNickname} onChange={(e) => setNewCardNickname(e.target.value)} />
      </div>
      <button onClick={handleCreateCard}>Create Virtual Card</button>
      <button onClick={handleTopUpCard}>Top Up Card</button>
    </div>
  );
}

export default WalletPage;
