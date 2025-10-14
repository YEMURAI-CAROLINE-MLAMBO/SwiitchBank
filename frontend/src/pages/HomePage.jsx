import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardPage from './DashboardPage';

function HomePage() {
  const { user } = useAuth();

  const isAuthenticated = user;


  return (
    <div className="home-page">
      {isAuthenticated ? (
        <DashboardPage />
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
