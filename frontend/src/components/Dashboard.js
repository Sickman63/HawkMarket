import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [marketUpdates, setMarketUpdates] = useState([]);

  useEffect(() => {
    axios.get('/api/portfolio')
      .then(response => setPortfolio(response.data))
      .catch(error => console.error('Error fetching portfolio:', error));

    axios.get('/api/market-updates')
      .then(response => setMarketUpdates(response.data))
      .catch(error => console.error('Error fetching market updates:', error));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Portfolio Overview</h2>
        {/* Render portfolio data */}
      </div>
      <div>
        <h2>Market Updates</h2>
        {/* Render market updates */}
      </div>
      <div>
        <Link to="/buy-sell"><button>Buy & Sell Stocks</button></Link>
        <Link to="/portfolio"><button>Portfolio Overview</button></Link>
        <Link to="/leaderboard"><button>Leaderboards</button></Link>
        <Link to="/transaction-history"><button>Transaction History</button></Link>
      </div>
    </div>
  );
};

export default Dashboard;