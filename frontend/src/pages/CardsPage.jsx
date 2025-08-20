import React from 'react';
import VirtualCardManager from '../components/cards/VirtualCardManager';

function CardsPage() {
  return (
    <div className="cards-page">
      <h1>My Cards</h1>
      <VirtualCardManager />
    </div>
  );
}

export default CardsPage;
