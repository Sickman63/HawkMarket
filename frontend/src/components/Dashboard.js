import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axiosConfig';

// Container for the entire Dashboard
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #121212;
  color: #f0f0f0;
  min-height: 100vh;
`;

// Header Styling
const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  background-color: #1f1f1f;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;

  h1 {
    font-size: 2.2rem;
    color: #00bcd4;
  }

  div {
    p {
      font-size: 1.2rem;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

// Account Overview Section Styling
const OverviewSection = styled.section`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1200px;
  background-color: #1f1f1f;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

// Individual Stat Block Styling
const StatBlock = styled.div`
  text-align: center;
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #2a2a2a;

  h3 {
    font-size: 1.5rem;
    color: #00bcd4;
  }

  p {
    font-size: 1.4rem;
    font-weight: bold;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

// Holdings Section Styling
const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  background-color: #1f1f1f;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  h2 {
    margin-bottom: 20px;
    color: #00bcd4;
    font-size: 1.8rem;
  }
`;

// Holdings Table Styling
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #f5f5f5;

  thead {
    background-color: #333333;
  }

  th, td {
    padding: 15px;
    border-bottom: 1px solid #444;
    text-align: center;
  }

  th {
    font-size: 1.1rem;
    color: #00bcd4;
  }

  tr:hover {
    background-color: #1a1a1a;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({ username: '', balance: 0, buying_power: 0, daily_change: 0 });
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch user information
        const userRes = await axios.get('/users/user-info', { headers: { Authorization: `Bearer ${token}` } });
        setUserInfo(userRes.data);

        // Fetch holdings information
        const holdingsRes = await axios.get('/portfolio', { headers: { Authorization: `Bearer ${token}` } });
        setHoldings(holdingsRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Header>
        <h1>HawkMarket</h1>
        <div>
          <p>Balance: ${typeof userInfo.balance === 'number' ? userInfo.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</p>
          <p>Buying Power: ${typeof userInfo.buying_power === 'number' ? userInfo.buying_power.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</p>
        </div>
      </Header>

      <OverviewSection>
        <StatBlock>
          <h3>Account Value</h3>
          <p>${typeof userInfo.balance === 'number' ? userInfo.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</p>
        </StatBlock>
        <StatBlock>
          <h3>Buying Power</h3>
          <p>${typeof userInfo.buying_power === 'number' ? userInfo.buying_power.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</p>
        </StatBlock>
        <StatBlock>
          <h3>Today's Change</h3>
          <p style={{ color: userInfo.daily_change < 0 ? '#ff5252' : '#4caf50' }}>
            ${typeof userInfo.daily_change === 'number' ? userInfo.daily_change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </p>
        </StatBlock>
      </OverviewSection>

      <Section>
        <h2>Holdings</h2>
        <Table>
          <thead>
            <tr>
              <th>Stock Symbol</th>
              <th>Stock Name</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
              <th>Current Price</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.length > 0 ? holdings.map(stock => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.name || 'N/A'}</td>
                <td>{stock.quantity}</td>
                <td>${stock.purchase_price !== null && stock.purchase_price !== undefined ? parseFloat(stock.purchase_price).toFixed(2) : 'N/A'}</td>
                <td>${stock.current_price !== null && stock.current_price !== undefined ? parseFloat(stock.current_price).toFixed(2) : 'N/A'}</td>
                <td>${stock.quantity !== null && stock.current_price !== null ? (stock.quantity * parseFloat(stock.current_price)).toFixed(2) : 'N/A'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6">No holdings data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default Dashboard;
