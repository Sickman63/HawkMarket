// frontend/src/components/Portfolio.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem('token');
      const result = await axios.get('http://localhost:3500/api/portfolioRoute', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(result.data);
    };

    fetchPortfolio();
  }, []);

  return (
    <div>
      <h2>Your Portfolio</h2>
      <table>
        <thead>
          <tr>
            <th>Stock Symbol</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((stock) => (
            <tr key={stock.stock_symbol}>
              <td>{stock.stock_symbol}</td>
              <td>{stock.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;