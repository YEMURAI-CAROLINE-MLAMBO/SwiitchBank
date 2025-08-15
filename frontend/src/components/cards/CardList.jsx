import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import VirtualCard from './VirtualCard';
import LoadingSpinner from '../common/LoadingSpinner';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await api.get('/api/cards');
        setCards(response.data.cards);
      } catch (error) {
        console.error('Failed to fetch cards', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Cards</h2>
      {cards.length > 0 ? (
        <div className="space-y-4">
          {cards.map(card => (
            <VirtualCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <p>You don't have any cards yet.</p>
      )}
    </div>
  );
};

export default CardList;
