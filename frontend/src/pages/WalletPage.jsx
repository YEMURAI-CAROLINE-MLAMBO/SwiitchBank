import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import WalletDashboard from '../components/wallet/WalletDashboard';
import VirtualCardManager from '../components/cards/VirtualCardManager';

function WalletPage() {
  const [virtualCards, setVirtualCards] = useState([]);
  const { currentUser } = useAuth(); // Get the current user from AuthContext

   const handleCreateCard = () => {
    console.log('Create Virtual Card button clicked');
    // TODO: Implement logic to call the createVirtualCard backend function
  };

  const handleTopUpCard = () => {
    console.log('Top Up Card button clicked');
    // TODO: Implement logic to call the topUpVirtualCard backend function
  };

  useEffect(() => {
    const fetchVirtualCards = async () => {
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
          console.error('Error fetching virtual cards:', error);
        }
      }
    };
    fetchVirtualCards();
  }, [currentUser]); // Refetch when currentUser changes

  return (
    <div className="wallet-page">
      <h1>My Wallet</h1>
      <WalletDashboard />
      <h2>Virtual Cards</h2>
      {virtualCards.map(card => (
        <VirtualCardManager key={card.id} card={card} />
      ))}
      <button onClick={handleCreateCard}>Create Virtual Card</button>
      <button onClick={handleTopUpCard}>Top Up Card</button>
    </div>
  );
}

export default WalletPage;
