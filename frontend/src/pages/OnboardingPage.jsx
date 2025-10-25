import React, { useState } from 'react';
import Welcome from '../components/onboarding/Welcome';
import ConnectBank from '../components/onboarding/ConnectBank';
import Tutorial from '../components/onboarding/Tutorial';

const OnboardingPage = ({ onComplete }) => {
  const [step, setStep] = useState('welcome');

  const handleGetStarted = () => {
    setStep('tutorial');
  };

  const handleStart = () => {
    setStep('connect_bank');
  };

  return (
    <div className="onboarding-container">
      {step === 'welcome' && <Welcome onGetStarted={handleGetStarted} />}
      {step === 'tutorial' && <Tutorial onStart={handleStart} />}
      {step === 'connect_bank' && <ConnectBank onConnected={onComplete} />}
    </div>
  );
};

export default OnboardingPage;
