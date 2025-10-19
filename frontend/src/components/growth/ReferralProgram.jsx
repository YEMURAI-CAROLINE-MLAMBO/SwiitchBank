import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Button, Modal } from '../common';
import { httpsCallable } from 'firebase/functions';
// frontend/src/components/growth/ReferralProgram.jsx
const ReferralProgram = () => {
  const { user } = useAuth();
  const [referralOffer, setReferralOffer] = useState(null);
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
    }
  }, [user]);
  
  const handleCopyLink = () => {
    if (referralOffer && referralOffer.code) {
      // Assuming the referral link is the app URL with the referral code
      const referralLink = `${window.location.origin}?referral=${referralOffer.code}`;
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          alert('Referral link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy referral link: ', err);
        });
    }
  };

  const handleShareWhatsApp = () => {
    if (referralOffer && referralOffer.shareMessage) {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(referralOffer.shareMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleShareInstagram = () => {
    // Instagram sharing is more complex and often requires deep linking or using their API.
    // This is a placeholder. In a real app, you'd integrate with Instagram sharing options.
    alert('Instagram sharing is not fully implemented yet. You can copy the link and share manually!');
    console.log("Attempting to share on Instagram with message:", referralOffer?.shareMessage);
  };

  if (!referralOffer) return <div>Loading referral program...</div>;
  
  return (
    <div className="referral-program">
      <h3>Invite Friends, Earn Rewards</h3>
      <p>Share your code and earn ${referralOffer.reward.amount} for each friend who joins</p>
      {referralOffer.referralCode && (
        <p>Your Referral Code: <strong>{referralOffer.referralCode}</strong></p>
      )}

      <h4>Referred Users:</h4>
      <ul>
        {referralOffer.completedReferrals && referralOffer.completedReferrals.length > 0 ? (
          referralOffer.completedReferrals.map(referral => (
            <li key={referral.id}>User ID: {referral.referred_id}, Reward: ${referral.reward_amount} {referral.reward_currency}</li>
          ))
        ) : (
          <li>No users referred yet.</li>
        )}
      </ul>

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