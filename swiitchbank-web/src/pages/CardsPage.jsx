import React from 'react';
import useVirtualCards from '../hooks/useVirtualCards';
import VirtualCardManager from '../components/cards/VirtualCardManager';
import { useAuth } from '../context/AuthContext';

function CardsPage() {
  const { currentUser } = useAuth();
  const { cards, isLoading, error } = useVirtualCards();

  if (!currentUser) {
    return (
      <div className="cards-page">
        <h1>My Cards</h1>
        <p>Please log in to view your virtual cards.</p>
      </div>
    );
  }

  return (
    <div className="cards-page">
      <h1>My Cards</h1>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="feedback-message error">Error fetching cards.</div>}
      {!isLoading && !error && cards.length > 0 ? (
        cards.map(card => <VirtualCardManager key={card.id} card={card} />)
      ) : (
        !isLoading && !error && <p>You don't have any virtual cards yet.</p>
      )}
    </div>
  );
}

export default CardsPage;
