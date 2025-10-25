import React from 'react';

const Tutorial = ({ onStart }) => {
  return (
    <div className="tutorial-screen">
      <div className="tutorial-content">
        <div className="logo">🧠 SwiitchBank</div>
        <h1>How SwiitchBank Works</h1>
        <p>This tutorial will walk you through the key features of the app.</p>

        <div className="tutorial-steps">
          <div className="tutorial-step">
            <div className="icon">📊</div>
            <h3>Unified Dashboard</h3>
            <p>View all your financial accounts in one place for a clear overview of your net worth.</p>
          </div>
          <div className="tutorial-step">
            <div className="icon">🧠</div>
            <h3>AI-Powered Insights</h3>
            <p>Our AI, Sophia, analyzes your spending and provides personalized advice to help you save money.</p>
          </div>
          <div className="tutorial-step">
            <div className="icon">💳</div>
            <h3>Smart Cards</h3>
            <p>Create virtual and physical cards with custom spending limits and security features.</p>
          </div>
        </div>

        <button className="primary-button" onClick={onStart}>
          Connect Your Accounts
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
