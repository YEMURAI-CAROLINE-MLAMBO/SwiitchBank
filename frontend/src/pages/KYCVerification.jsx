import React from 'react';
import KYCForm from '../components/kyc/KYCForm';

const KYCVerification = () => {
  const handleSubmit = (data) => {
    console.log('KYC Data:', data);
    // Here you would typically call an API to submit the KYC data
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">KYC Verification</h1>
      <KYCForm onSubmit={handleSubmit} />
    </div>
  );
};

export default KYCVerification;
