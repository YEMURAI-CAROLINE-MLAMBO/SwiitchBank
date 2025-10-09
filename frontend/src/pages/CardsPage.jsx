import React, { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import VirtualCardManager from '../components/cards/VirtualCardManager';
import CreateVirtualCard from '../components/cards/CreateVirtualCard';

function CardsPage() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const cardsQuery = query(
      collection(db, 'users', currentUser.uid, 'virtualCards')
    );

    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching virtual cards:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCardCreated = () => {
    // The onSnapshot listener will automatically refresh the list.
    // We can add any additional UI feedback here if needed.
    console.log("New card created, list will update.");
  };

  return (
    <div className="cards-page">
      <h1>My Cards</h1>
      <CreateVirtualCard onCardCreated={handleCardCreated} />
      {isLoading ? (
        <p>Loading cards...</p>
      ) : cards.length > 0 ? (
        cards.map(card => (
          <VirtualCardManager key={card.id} card={card} />
        ))
      ) : (
        <p>No virtual cards found. Create one to get started!</p>
      )}
    </div>
  );
}

export default CardsPage;
