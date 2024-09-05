// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/portfolio" component={PortfolioPage} />
        <Route path="/transactions" component={TransactionHistoryPage} />
      </Switch>
    </Router>
  );
};

export default Routes;

