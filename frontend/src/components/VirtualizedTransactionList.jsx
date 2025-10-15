import React from 'react';
import { List } from 'react-window';

const VirtualizedTransactionList = ({ transactions }) => {
  const TransactionRow = ({ index, style }) => (
    <div style={style} className="transaction-row">
      <div className="transaction-description">
        {transactions[index].description}
      </div>
      <div className="transaction-amount">
        ${transactions[index].amount}
      </div>
      <div className="transaction-date">
        {new Date(transactions[index].date).toLocaleDateString()}
      </div>
    </div>
  );

  return (
    <List
      height={400}
      itemCount={transactions.length}
      itemSize={60}
      width="100%"
    >
      {TransactionRow}
    </List>
  );
};

export default VirtualizedTransactionList;
