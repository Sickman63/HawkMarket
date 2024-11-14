import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #1c1e26;
  color: #f5f5f5;
  overflow-y: auto;
`;

const Header = styled.header`
  width: 100%;
  background-color: #2c3e50;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
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

const Section = styled.section`
  width: 80%;
  margin-bottom: 2rem;
  background-color: #2e3241;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #f5f5f5;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  color: #f5f5f5;
`;

const Th = styled.th`
  padding: 0.75rem;
  background-color: #4a90e2;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #444;
`;

const TradeForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  grid-column: span 2;
  padding: 0.75rem;
  font-size: 1rem;
  color: white;
  background-color: #4a90e2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ab8;
  }
`;

const Footer = styled.footer`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #282c34;
  color: white;
  width: 100%;
  text-align: center;
`;

const BuySellStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [symbol, setSymbol] = useState('');
  const [orderType, setOrderType] = useState('Market');
  const [duration, setDuration] = useState('Day Only');
  const [action, setAction] = useState('Buy');

  useEffect(() => {
    axios.get('http://localhost:3500/api/stocks')
      .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));
  }, []);

  const handleConfirm = (e) => {
    e.preventDefault();
    // Execute trade logic here (implementation not shown)
    alert(`Trade confirmed: ${action} ${quantity} shares of ${symbol} as a ${orderType} order.`);
    // Reset form
    setQuantity('');
    setSymbol('');
  };

  return (
    <Container>
      {/* Top Navigation Bar */}
      <Nav>
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/buy-sell">Trade</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
      </Nav>

      {/* Page Header */}
      <Header>
        <h1>Trade Stocks</h1>
        <div>
          <p>Account Value: $100,000.00</p>
          <p>Buying Power: $99,982.00</p>
        </div>
      </Header>

      {/* Stock Listings */}
      <Section>
        <SectionTitle>Stock Listings</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Stock</Th>
              <Th>Price</Th>
              <Th>Change</Th>
              <Th>Volume</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.id}>
                <Td>{stock.name}</Td>
                <Td>${stock.price}</Td>
                <Td>{stock.change}%</Td>
                <Td>{stock.volume}</Td>
                <Td>
                  <Button onClick={() => setSymbol(stock.name)}>Select</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* Trade Form Section */}
      <Section>
        <SectionTitle>Trade Form</SectionTitle>
        <TradeForm onSubmit={handleConfirm}>
          <Input
            type="text"
            placeholder="Stock Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <Select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </Select>
          <Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
          </Select>
          <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="Day Only">Day Only</option>
            <option value="Good Till Cancelled">Good Till Cancelled</option>
          </Select>
          <Button type="submit">Confirm Trade</Button>
        </TradeForm>
      </Section>

      {/* Footer */}
      <Footer>
        <p>Stock market news ticker and platform support links</p>
      </Footer>
    </Container>
  );
};

export default BuySellStocks;