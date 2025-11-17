import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConnectBank = ({ onConnected }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState('select'); // 'select' | 'connecting' | 'success'
  const [selectedBank, setSelectedBank] = useState(null);

  const banks = [
    { id: 'chase', name: t('connect_bank.chase'), logo: '🏦' },
    { id: 'bankofamerica', name: t('connect_bank.bankofamerica'), logo: '🏛️' },
    { id: 'wellsfargo', name: t('connect_bank.wellsfargo'), logo: '💼' },
    { id: 'capitalone', name: t('connect_bank.capitalone'), logo: '💳' }
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
        <h2>{t('connect_bank.title')}</h2>
        <p>{t('connect_bank.subtitle')}</p>

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
          {t('connect_bank.button')}
        </button>
      </div>
    );
  }

  if (step === 'connecting') {
    return (
      <div className="connecting-screen">
        <div className="spinner"></div>
        <h3>{t('connect_bank.connecting.title')}</h3>
        <p>{t('connect_bank.connecting.subtitle')}</p>
      </div>
    );
  }

  return (
    <div className="success-screen">
      <div className="success-icon">✅</div>
      <h3>{t('connect_bank.success.title')}</h3>
      <p>{t('connect_bank.success.subtitle')}</p>
    </div>
  );
};

export default ConnectBank;
