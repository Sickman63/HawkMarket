import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  color: #282c34;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const Button = styled(Link)`
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: white;
  background-color: #61dafb;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #21a1f1;
  }
`;

const Home = () => {
  return (
    <Container>
      <Header>
        <Logo>Welcome to HawkMarket!</Logo>
        <Nav>
          <Button to="/signup">Sign Up</Button>
          <Button to="/login">Login</Button>
          <Button to="/dashboard">Dashboard</Button>
          <Button to="/buy-sell">Buy & Sell Stocks</Button>
          <Button to="/portfolio">Portfolio Overview</Button>
          <Button to="/leaderboard">Leaderboards</Button>
          <Button to="/transaction-history">Transaction History</Button>
        </Nav>
      </Header>
      {/* Other components or elements */}
    </Container>
  );
};

export default Home;