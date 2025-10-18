import React, { useState } from 'react';

const ConnectBank = ({ onConnected }) => {
  const [step, setStep] = useState('select'); // 'select' | 'connecting' | 'success'
  const [selectedBank, setSelectedBank] = useState(null);

  const banks = [
    { id: 'chase', name: 'Chase', logo: '🏦' },
    { id: 'bankofamerica', name: 'Bank of America', logo: '🏛️' },
    { id: 'wellsfargo', name: 'Wells Fargo', logo: '💼' },
    { id: 'capitalone', name: 'Capital One', logo: '💳' }
  ];

  const connectBank = async (bankId) => {
    setStep('connecting');

    // Simulate Plaid connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('success');
    setTimeout(() => onConnected(), 1500);
  };

  if (step === 'select') {
    return (
      <div className="connect-bank">
        <h2>Connect Your Bank</h2>
        <p>Choose your bank to get started</p>

        <div className="bank-grid">
          {banks.map(bank => (
            <div
              key={bank.id}
              className={`bank-card ${selectedBank === bank.id ? 'selected' : ''}`}
              onClick={() => setSelectedBank(bank.id)}
            >
              <div className="bank-logo">{bank.logo}</div>
              <div className="bank-name">{bank.name}</div>
            </div>
          ))}
        </div>

        <button
          className="primary-button"
          disabled={!selectedBank}
          onClick={() => connectBank(selectedBank)}
        >
          Continue
        </button>
      </div>
    );
  }

  if (step === 'connecting') {
    return (
      <div className="connecting-screen">
        <div className="spinner"></div>
        <h3>Connecting to your bank...</h3>
        <p>This may take a few moments</p>
      </div>
    );
  }

  return (
    <div className="success-screen">
      <div className="success-icon">✅</div>
      <h3>Successfully Connected!</h3>
      <p>Your accounts are now linked</p>
    </div>
  );
};

export default ConnectBank;
