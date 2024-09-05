// src/components/StockCard.js
import React from 'react';

const StockCard = ({ stock }) => {
  return (
    <div className="stock-card">
      <h3>{stock.name}</h3>
      <p>{stock.price}</p>
    </div>
  );
};

export default StockCard;

