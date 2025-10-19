import React from 'react';

const Welcome = ({ onGetStarted }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="logo">🧠 SwiitchBank</div>
        <h1>Your Intelligent Financial Partner</h1>
        <p>See your finances clearly. Make smarter decisions.</p>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Clear Overview</h3>
            <p>See all your accounts in one place</p>
          </div>
          <div className="feature-card">
            <div className="icon">🧠</div>
            <h3>Sophia AI</h3>
            <p>Get personalized financial advice</p>
          </div>
          <div className="feature-card">
            <div className="icon">🚀</div>
            <h3>Smart Insights</h3>
            <p>Understand your spending patterns</p>
          </div>
        </div>

        <button className="primary-button" onClick={onGetStarted}>
          Connect Your Accounts
        </button>
      </div>
    </div>
  );
};

export default Welcome;
