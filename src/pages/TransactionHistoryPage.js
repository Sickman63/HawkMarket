// src/pages/TransactionHistoryPage.js
import React from 'react';
import useFetch from '../hooks/useFetch';

const TransactionHistoryPage = () => {
  const { data: transactions, loading, error } = useFetch('/api/transactions');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.date}: {transaction.stockName} - {transaction.type} - {transaction.quantity} shares at ${transaction.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistoryPage;

