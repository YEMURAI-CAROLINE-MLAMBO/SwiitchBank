import React, { useState } from 'react';

const VirtualCardManager = ({ card }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="virtual-card-manager">
      <h4>{card.nickname}</h4>
      <p>Type: {card.type}</p>
      <button onClick={toggleShowDetails}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      {showDetails && (
        <div>
          <p>Card Number: {card.cardNumber}</p>
          <p>CVV: {card.cvv}</p>
          <p>Expiry Date: {card.expiryDate}</p>
        </div>
      )}
    </div>
  );
};

export default VirtualCardManager;
