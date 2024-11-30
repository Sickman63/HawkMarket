import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BuySellStocks from './components/BuySellStocks';
import Leaderboards from './components/Leaderboards';
import StockList from './components/StockList';
import AccountSettings from './components/AccountSettings';
import GlobalStyle from './globalStyles';
import NavBar from './components/NavBar';

function AppContent() {
  const location = useLocation();

  const hideNavBarRoutes = ['/', '/signup', '/login'];

  return (
    <>
      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stocks" element={<StockList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy-sell" element={<BuySellStocks />} />
        <Route path="/leaderboard" element={<Leaderboards />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;