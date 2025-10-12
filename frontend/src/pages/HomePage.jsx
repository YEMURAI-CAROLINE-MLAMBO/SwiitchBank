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
          <p>Your modern banking solution.</p>
          <div>
            <a href="/login" className="btn btn-primary">Login</a>
            <a href="/signup" className="btn btn-secondary">Sign Up</a>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
