import React from 'react';
import WalletBalance from '../dashboard/WalletBalance';
import CurrencyConverter from './CurrencyConverter';

const WalletOverview = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <WalletBalance />
        </div>
        <div>
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;
