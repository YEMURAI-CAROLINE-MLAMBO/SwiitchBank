import React from 'react';
import { useAuth } from '../context/AuthContext';
import WalletDashboard from '../components/wallet/WalletDashboard';
import FiatCryptoBridge from '../components/fiat-crypto-bridge/FiatCryptoBridge';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {user ? (
        <>
          <WalletDashboard />
          <FiatCryptoBridge />
        </>
      ) : (
        <>
          <h2>Welcome to SwiitchBank</h2>
          <p>Your modern banking solution.</p>
          {/* You could add a call to action here, like a link to the login or signup page */}
        </>
      )}
    </div>
  );
}

export default HomePage;
