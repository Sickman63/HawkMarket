// src/pages/DashboardPage.js
import React from 'react';
import useFetch from '../hooks/useFetch';
import StockList from '../components/StockList';

const DashboardPage = () => {
  const { data: stocks, loading, error } = useFetch('/api/stocks');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Stock Dashboard</h2>
      <StockList stocks={stocks} />
    </div>
  );
};

export default DashboardPage;

