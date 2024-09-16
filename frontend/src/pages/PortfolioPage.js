// src/pages/PortfolioPage.js
import React from 'react';
import useFetch from '../hooks/useFetch';

const PortfolioPage = () => {
  const { data: portfolio, loading, error } = useFetch('/api/portfolio');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Your Portfolio</h2>
      <ul>
        {portfolio.map(item => (
          <li key={item.id}>
            {item.stockName}: {item.quantity} shares at ${item.averagePrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioPage;

