import React from 'react';

const TransactionList = ({ className }) => {
  return (
    <div className={className}>
      <h4>Original Transaction List MVP Component</h4>
      <ul>
        <li>Transaction 1: -$50.00</li>
        <li>Transaction 2: +$200.00</li>
        <li>Transaction 3: -$25.50</li>
      </ul>
    </div>
  );
};

export default TransactionList;
