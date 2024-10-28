import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  background-color: #282c34;
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #61dafb;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Balance = styled.span`
  font-size: 1.2rem;
  color: #61dafb;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #61dafb;
  color: white;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
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
  const [userInfo, setUserInfo] = useState({ username: '', balance: 0 });
  const [portfolio, setPortfolio] = useState([]);
  const [marketUpdates, setMarketUpdates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const result = await axios.get('http://localhost:3500/api/users/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(result.data);
        console.log('User Info:', result.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchPortfolio = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3500/api/portfolio', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPortfolio(response.data);
        console.log('Portfolio:', response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };

    const fetchMarketUpdates = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/stocks');
        setMarketUpdates(response.data);
        console.log('Market Updates:', response.data);
      } catch (error) {
        console.error('Error fetching market updates:', error);
      }
    };

    fetchUserInfo();
    fetchPortfolio();
    fetchMarketUpdates();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <UserInfo>
          <span>{userInfo.username}</span>
          <Balance>${userInfo.balance.toFixed(2)}</Balance>
        </UserInfo>
      </Header>
      <Section>
        <SectionTitle>Portfolio Overview</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Stock Symbol</Th>
              <Th>Stock Name</Th>
              <Th>Quantity</Th>
              <Th>Purchase Price</Th>
              <Th>Current Price</Th>
              <Th>Total Value</Th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock) => (
              <tr key={stock.stock_symbol}>
                <Td>{stock.stock_symbol}</Td>
                <Td>{stock.stock_name}</Td>
                <Td>{stock.quantity}</Td>
                <Td>${stock.purchase_price.toFixed(2)}</Td>
                <Td>${stock.current_price.toFixed(2)}</Td>
                <Td>${(stock.quantity * stock.current_price).toFixed(2)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
      <Section>
        <SectionTitle>Market Updates</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Symbol</Th>
              <Th>Name</Th>
              <Th>Price</Th>
            </tr>
          </thead>
          <tbody>
            {marketUpdates.map((stock) => (
              <tr key={stock.symbol}>
                <Td>{stock.symbol}</Td>
                <Td>{stock.name}</Td>
                <Td>${stock.price}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
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