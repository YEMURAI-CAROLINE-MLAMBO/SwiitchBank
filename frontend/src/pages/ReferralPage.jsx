import React from 'react';

const ReferralPage = () => {
  const referralCode = 'REF12345'; // This would typically come from the user's data

  const handleShare = () => {
    // TODO: Implement sharing functionality (e.g., using the Web Share API)
    alert(`Share this code with your friends: ${referralCode}`);
  };

  return (
    <div>
      <h1>Referral Program</h1>
      <p>Invite your friends and earn rewards!</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Your Referral Code</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{referralCode}</p>
        <button onClick={handleShare} style={{ padding: '10px', marginTop: '10px' }}>Share</button>
      </div>
    </div>
  );
};

export default ReferralPage;
