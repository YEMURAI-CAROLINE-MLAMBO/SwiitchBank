import { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const useVirtualCards = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchCards = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const db = getFirestore();
      const cardsCollection = collection(db, 'virtualCards');
      const q = query(cardsCollection, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const cardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardsData);
    } catch (err) {
      setError(err);
      console.error('Error fetching virtual cards:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return { cards, isLoading, error, refetch: fetchCards };
};

export default useVirtualCards;