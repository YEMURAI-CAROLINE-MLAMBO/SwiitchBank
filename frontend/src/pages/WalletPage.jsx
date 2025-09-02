import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import WalletDashboard from '../components/wallet/WalletDashboard';
import VirtualCardManager from '../components/cards/VirtualCardManager';
import CreateVirtualCard from '../components/cards/CreateVirtualCard';
import TopUpVirtualCard from '../components/cards/TopUpVirtualCard';

function WalletPage() {
  const [virtualCards, setVirtualCards] = useState([]);
  const { currentUser } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVirtualCards = useCallback(async () => {
    setIsLoading(true);
    if (currentUser) {
      const db = getFirestore();
      const virtualCardsCollection = collection(db, 'virtualCards');
      const q = query(virtualCardsCollection, where('userId', '==', currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);
        const cardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVirtualCards(cardsData);
      } catch (error) {
        console.error('Error fetching virtual cards:', error);
        setFeedbackMessage({ type: 'error', text: 'Error fetching virtual cards.' });
        setVirtualCards([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setVirtualCards([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchVirtualCards();
  }, [fetchVirtualCards]);

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
      <CreateVirtualCard onCardCreated={fetchVirtualCards} />
      <TopUpVirtualCard onTopUpSuccess={fetchVirtualCards} />
    </div>
  );
}

export default WalletPage;
