import React, { useState } from 'react';

const VirtualCard = ({ card }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Use placeholder data if no card is passed
  const displayCard = card || {
    last_four: '1234',
    expiry_date: '12/25',
    card_holder: 'Jules Verne',
    cvv: '123'
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">SwiitchBank</h3>
        <img src="/mastercard-logo.svg" alt="Mastercard" className="h-8" />
      </div>
      <div className="text-center text-2xl font-mono tracking-widest mb-6">
        {showDetails ? displayCard.card_number : `**** **** **** ${displayCard.last_four}`}
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs">Card Holder</p>
          <p className="font-medium">{displayCard.card_holder}</p>
        </div>
        <div>
          <p className="text-xs">Expires</p>
          <p className="font-medium">{displayCard.expiry_date}</p>
        </div>
        <div className="text-center">
          <p className="text-xs">CVV</p>
          <p className="font-medium">{showDetails ? displayCard.cvv : '***'}</p>
        </div>
      </div>
      <button onClick={() => setShowDetails(!showDetails)} className="mt-4 text-xs underline">
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
    </div>
  );
};

export default VirtualCard;
