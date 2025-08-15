import React from 'react';
import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';
import VirtualCard from '../cards/VirtualCard';

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Card</h2>
          <VirtualCard />
          <div className="mt-6">
            <TransactionHistory />
          </div>
        </div>
        <div>
          <WalletBalance />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
