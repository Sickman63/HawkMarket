import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
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

const Title = styled.h1`
  font-size: 2.5rem;
  color: #282c34;
`;

const Section = styled.section`
  width: 80%;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #282c34;
  margin-bottom: 1rem;
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

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [marketUpdates, setMarketUpdates] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get('/api/portfolio');
        setPortfolio(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };

    const fetchMarketUpdates = async () => {
      try {
        const response = await axios.get('/api/stocks');
        setMarketUpdates(response.data);
      } catch (error) {
        console.error('Error fetching market updates:', error);
      }
    };

    fetchPortfolio();
    fetchMarketUpdates();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
      </Header>
      <Section>
        <SectionTitle>Portfolio Overview</SectionTitle>
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
      </Section>
      <Section>
        <SectionTitle>Market Updates</SectionTitle>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {marketUpdates.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.name}</td>
                <td>${stock.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <Nav>
        <Button to="/buy-sell">Buy & Sell Stocks</Button>
        <Button to="/portfolio">Portfolio Overview</Button>
        <Button to="/leaderboard">Leaderboards</Button>
        <Button to="/transaction-history">Transaction History</Button>
      </Nav>
    </Container>
  );
};

export default Dashboard;