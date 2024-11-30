import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #1c1e26;
  color: #f5f5f5;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Logo = styled.h1`
  font-size: 3rem;
  color: #61dafb;
  margin-bottom: 1rem;
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  color: #adb5bd;
  text-align: center;
  margin-bottom: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const Button = styled(Link)`
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  color: white;
  background-color: #4a90e2;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ab8;
  }
`;

const Home = () => {
  return (
    <Container>
      <Header>
        <Logo>Welcome to HawkMarket!</Logo>
        <Tagline>Your one-stop platform for stock trading and portfolio management.</Tagline>
        <Nav>
          <Button to="/signup">Sign Up</Button>
          <Button to="/login">Login</Button>
        </Nav>
      </Header>
    </Container>
  );
};

export default Home;
