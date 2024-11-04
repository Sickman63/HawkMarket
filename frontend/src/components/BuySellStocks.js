import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #f5f5f5;
  overflow-y: auto;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
`;

const Th = styled.th`
  padding: 0.75rem;
  background-color: #61dafb;
  color: white;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 0.75rem;
  border: 1px solid #ddd;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  color: white;
  background-color: #61dafb;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #21a1f1;
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
  const [price, setPrice] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3500/api/stocks')
      .then(response => setStocks(response.data))
      .catch(error => console.error('Error fetching stocks:', error));
      
  }, []);

  const handleBuySell = (stock) => {
    setSelectedStock(stock);
    // Show confirmation modal (implementation not shown)
  };

  const handleConfirm = () => {
    // Execute trade (implementation not shown)
    setSelectedStock(null);
  };

  return (
    <Container>
      <Header>
        <Title>Buy & Sell Stocks</Title>
      </Header>
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
                <Td>{stock.price}</Td>
                <Td>{stock.change}</Td>
                <Td>{stock.volume}</Td>
                <Td>
                  <Button onClick={() => handleBuySell(stock)}>Buy/Sell</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
      <Section>
        <SectionTitle>Buy/Sell Form</SectionTitle>
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Button onClick={handleConfirm}>Confirm</Button>
      </Section>
      <Footer>
        <p>Stock market news ticker and platform support links</p>
      </Footer>
    </Container>
  );
};

export default BuySellStocks;