import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button, Modal } from '../common';
// frontend/src/components/growth/ReferralProgram.jsx
const ReferralProgram = () => {
  const { user } = useAuth();
  const [referralOffer, setReferralOffer] = useState(null);
  const [referralStatus, setReferralStatus] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadReferralOffer = async () => {
      try {
        const response = await api.get('/api/growth/referral'); // Use absolute path
        setReferralOffer(response.data);
      } catch (error) {
        console.error('Failed to load referral offer', error);
      }
    };

    if (user) {
      loadReferralOffer();
      loadReferralStatus();
    }
  }, [user]);

  const loadReferralStatus = async () => {
    try {
      const response = await api.get('/api/growth/referral/status');
      setReferralStatus(response.data);
    } catch (error) {
      console.error('Failed to load referral status', error);
    }
  };

  if (!referralOffer) return <div>Loading referral program...</div>;

  return (
    <div className="referral-program">
      <h3>Invite Friends, Earn Rewards</h3>
      <p>
        Share your code and earn ${referralOffer.reward.amount} for each friend
        who joins
      </p>
      {referralOffer.referralCode && (
        <p>
          Your Referral Code: <strong>{referralOffer.referralCode}</strong>
        </p>
      )}

      <h4>Referred Users:</h4>
      <ul>
        {referralStatus.length > 0 ? (
          referralStatus.map((referral) => (
            <li key={referral.referred_id}>
              {referral.referred_id} - {referral.status}
            </li>
          ))
        ) : (
          <li>No users referred yet.</li>
        )}
      </ul>

      <Button onClick={() => setShowModal(true)}>Share Your Code</Button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Share SwiitchBank</h2>
          <p>{referralOffer.shareMessage}</p>
          <div className="share-options">
            <button>Copy Link</button>
            <button>Share via WhatsApp</button>
            <button>Share via Instagram</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReferralProgram;
