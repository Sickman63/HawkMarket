import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1c1e26;
  color: #f5f5f5;
`;

const Header = styled.header`
  width: 100%;
  padding: 20px;
  background-color: #2c3e50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Nav = styled.nav`
  display: flex;
  background-color: #2e3241;
  width: 100%;
  padding: 1rem;
  justify-content: center;
`;

const NavLink = styled(Link)`
  margin: 0 1.5rem;
  padding: 0.5rem 1rem;
  color: #f5f5f5;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4a90e2;
  }
`;

const OverviewSection = styled.section`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 1rem;
  background-color: #2e3241;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const StatBlock = styled.div`
  text-align: center;
  flex: 1;
  padding: 1rem;
`;

const Section = styled.section`
  width: 80%;
  background-color: #2e3241;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  color: #f5f5f5;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #4a90e2;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #444;
`;

const PerformanceChart = styled.div`
  width: 100%;
  height: 400px;
  margin-top: 2rem;
`;

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({ username: '', balance: 100000, buyingPower: 99982, dailyChange: 0 });
  const [portfolio, setPortfolio] = useState([]);
  const [marketUpdates, setMarketUpdates] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const result = await axios.get('/api/users/user-info', { headers: { Authorization: `Bearer ${token}` } });
        setUserInfo(result.data);

        const portfolioRes = await axios.get('/api/portfolio', { headers: { Authorization: `Bearer ${token}` } });
        setPortfolio(portfolioRes.data);

        const marketRes = await axios.get('/api/stocks');
        setMarketUpdates(marketRes.data);

        setPerformanceData({
          labels: ['1W', '1M', '3M', '6M', '1Y'],
          datasets: [{
            label: 'Account Value',
            data: [100000, 101500, 98000, 102000, 105000],
            fill: true,
            borderColor: '#4a90e2',
            backgroundColor: 'rgba(74, 144, 226, 0.2)'
          }]
        });

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Nav>
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/buy-sell">Trade</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
      </Nav>

      <Header>
        <h1>Dashboard</h1>
        <div>
          <p>Balance: ${userInfo.balance.toFixed(2)}</p>
          <p>Buying Power: ${userInfo.buyingPower.toFixed(2)}</p>
        </div>
      </Header>

      <OverviewSection>
        <StatBlock>
          <h3>Account Value</h3>
          <p>${userInfo.balance.toFixed(2)}</p>
        </StatBlock>
        <StatBlock>
          <h3>Buying Power</h3>
          <p>${userInfo.buyingPower.toFixed(2)}</p>
        </StatBlock>
        <StatBlock>
          <h3>Today's Change</h3>
          <p style={{ color: userInfo.dailyChange < 0 ? 'red' : 'green' }}>
            ${userInfo.dailyChange.toFixed(2)} (0.72%)
          </p>
        </StatBlock>
      </OverviewSection>

      <PerformanceChart>
        {performanceData.labels.length > 0 && <Line data={performanceData} />}
      </PerformanceChart>

      <Section>
        <h2>Portfolio Overview</h2>
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
            {portfolio.length > 0 ? portfolio.map(stock => (
              <tr key={stock.symbol}>
                <Td>{stock.symbol}</Td>
                <Td>{stock.name}</Td>
                <Td>{stock.quantity}</Td>
                <Td>${stock.purchasePrice.toFixed(2)}</Td>
                <Td>${stock.currentPrice.toFixed(2)}</Td>
                <Td>${(stock.quantity * stock.currentPrice).toFixed(2)}</Td>
              </tr>
            )) : (
              <tr>
                <Td colSpan="6">No portfolio data available</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>

      <Section>
        <h2>Market Updates</h2>
        <Table>
          <thead>
            <tr>
              <Th>Symbol</Th>
              <Th>Name</Th>
              <Th>Price</Th>
            </tr>
          </thead>
          <tbody>
            {marketUpdates.length > 0 ? marketUpdates.slice(0, 5).map(stock => (
              <tr key={stock.symbol}>
                <Td>{stock.symbol}</Td>
                <Td>{stock.name}</Td>
                <Td>${stock.price}</Td>
              </tr>
            )) : (
              <tr>
                <Td colSpan="3">No market updates available</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default Dashboard;