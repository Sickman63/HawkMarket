import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BuySellStocks from './components/BuySellStocks';
import PortfolioOverview from './components/PortfolioOverview';
import Leaderboards from './components/Leaderboards';
import TransactionHistory from './components/TransactionHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy-sell" element={<BuySellStocks />} />
        <Route path="/portfolio" element={<PortfolioOverview />} />
        <Route path="/leaderboard" element={<Leaderboards />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App;