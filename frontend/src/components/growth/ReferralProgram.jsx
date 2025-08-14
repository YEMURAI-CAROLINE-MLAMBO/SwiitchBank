import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button, Modal } from '../common';

const ReferralProgram = () => {
  const { user } = useAuth();
  const [referralOffer, setReferralOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const loadReferralOffer = async () => {
      try {
        const response = await api.get('/growth/referral');
        setReferralOffer(response.data);
      } catch (error) {
        console.error('Failed to load referral offer', error);
      }
    };
    
    if (user) {
      loadReferralOffer();
    }
  }, [user]);
  
  if (!referralOffer) return <div>Loading referral program...</div>;
  
  return (
    <div className="referral-program">
      <h3>Invite Friends, Earn Rewards</h3>
      <p>Share your code and earn ${referralOffer.reward.amount} for each friend who joins</p>
      
      <Button onClick={() => setShowModal(true)}>
        Share Your Code
      </Button>
      
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