import React from 'react';
import { useAuth } from '../context/AuthContext';
import WalletDashboard from '../components/wallet/WalletDashboard';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {user ? (
        <WalletDashboard />
      ) : (
        <>
          <h2>Welcome to SwiitchBank</h2>
          <p>Anytime Anywhere</p>
          {/* You could add a call to action here, like a link to the login or signup page */}
        </>
      )}
    </div>
  );
}

export default HomePage;
