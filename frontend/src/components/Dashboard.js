import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axiosConfig';

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
          <p style={{ color: userInfo.daily_change < 0 ? 'red' : 'green' }}>
            ${typeof userInfo.daily_change === 'number' ? userInfo.daily_change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </p>
        </StatBlock>
      </OverviewSection>

      <Section>
        <h2>Holdings</h2>
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
            {holdings.length > 0 ? holdings.map(stock => (
              <tr key={stock.symbol}>
                <Td>{stock.symbol}</Td>
                <Td>{stock.name || 'N/A'}</Td> {/* Assuming name might not always be available */}
                <Td>{stock.quantity}</Td>
                <Td>${stock.purchase_price !== null && stock.purchase_price !== undefined ? parseFloat(stock.purchase_price).toFixed(2) : 'N/A'}</Td>
                <Td>${stock.current_price !== null && stock.current_price !== undefined ? parseFloat(stock.current_price).toFixed(2) : 'N/A'}</Td>
                <Td>${stock.quantity !== null && stock.current_price !== null ? (stock.quantity * parseFloat(stock.current_price)).toFixed(2) : 'N/A'}</Td>
              </tr>
            )) : (
              <tr>
                <Td colSpan="6">No holdings data available</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default Dashboard;
