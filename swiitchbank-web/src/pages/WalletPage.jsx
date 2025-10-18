import React from 'react';
import { useAuth } from '../context/AuthContext';
import useVirtualCards from '../hooks/useVirtualCards';
import WalletDashboard from '../components/wallet/WalletDashboard';
import VirtualCardManager from '../components/cards/VirtualCardManager';
import CreateVirtualCard from '../components/cards/CreateVirtualCard';
import TopUpVirtualCard from '../components/cards/TopUpVirtualCard';

function WalletPage() {
  const { currentUser } = useAuth();
  const { cards, isLoading, error, refetch } = useVirtualCards();

  if (!currentUser) {
    return (
      <div className="wallet-page">
        <h1>My Wallet</h1>
        <p>Please log in to view your wallet and virtual cards.</p>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <h1>My Wallet</h1>
      <WalletDashboard />
      <h2>Virtual Cards</h2>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="feedback-message error">Error fetching virtual cards.</div>}
      {!isLoading && !error && cards.map(card => (
        <VirtualCardManager key={card.id} card={card} />
      ))}
      <CreateVirtualCard onCardCreated={refetch} />
      <TopUpVirtualCard onTopUpSuccess={refetch} />
    </div>
  );
}

export default WalletPage;
