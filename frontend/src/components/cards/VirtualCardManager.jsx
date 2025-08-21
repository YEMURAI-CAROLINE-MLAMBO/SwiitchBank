import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { firebase } from '../../firebase-config'; // Assuming firebase-config.js exists and is configured
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { Button } from '../common'; // Assuming a common Button component

const VirtualCardManager = () => {
  const { user } = useAuth();
  const [virtualCards, setVirtualCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore(firebase);
  const functions = getFunctions(firebase);
  const issueVirtualCardCallable = httpsCallable(functions, 'issueVirtualCard');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Listen for virtual cards for the current user
    const cardsQuery = query(collection(db, `users/${user.uid}/personalCards`));
    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVirtualCards(cardsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching virtual cards:", err);
      setError("Failed to load virtual cards.");
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();

  }, [user, db]);

  const handleIssueCard = async () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    try {
      setLoading(true);
      // Call the Cloud Function to issue a virtual card
      const result = await issueVirtualCardCallable({ userId: user.uid });
      console.log("Card issuance result:", result.data);
      // You might want to show a success message or handle the result data
      setLoading(false);
    } catch (err) {
      console.error("Error issuing virtual card:", err);
      setError(`Failed to issue virtual card: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading virtual cards...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="virtual-card-manager">
      <h3>Virtual Cards</h3>
      <Button onClick={handleIssueCard} disabled={loading}>
        {loading ? 'Issuing Card...' : 'Request New Virtual Card'}
      </Button>

      <h4>Your Cards:</h4>
      {virtualCards.length === 0 ? (
        <p>No virtual cards found.</p>
      ) : (
        <ul>
          {virtualCards.map(card => (
            <li key={card.id}>
              Card: **** **** **** {card.lastFour}, Expires: {new Date(card.expiry.seconds * 1000).toLocaleDateString()}, Status: {card.status}
              {/* Add more card details or actions here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VirtualCardManager;