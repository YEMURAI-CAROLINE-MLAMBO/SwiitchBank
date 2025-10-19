import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReferralPage = () => {
  const [userData, setUserData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const { data } = await axios.get('/api/referral/code');
        setUserData(data);
      } catch (error) {
        setError('Error fetching referral code');
      }
    };
    fetchReferralCode();
  }, []);

  const handleShare = async () => {
    if (navigator.share && userData) {
      try {
        await navigator.share({
          title: 'Join SwiitchBank!',
          text: `Join SwiitchBank and get exclusive rewards! Use my referral code: ${userData.referralCode}`,
          url: userData.referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (userData) {
      navigator.clipboard.writeText(userData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading your referral information...</div>;
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Invite Friends, Get Rewarded</h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>Share your unique referral link with friends. When they sign up, you both get a bonus!</p>

      <div style={{ margin: '2rem 0' }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Unique Referral Link</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <input
            type="text"
            value={userData.referralLink}
            readOnly
            style={{ padding: '0.8rem', fontSize: '1rem', width: '300px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <button onClick={handleCopy} style={{ padding: '0.8rem 1.5rem', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <button onClick={handleShare} style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}>
        Share with Friends
      </button>
    </div>
  );
};

export default ReferralPage;
