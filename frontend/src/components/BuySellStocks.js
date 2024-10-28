import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
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

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #61dafb;
  border: none;
  border-radius: 4px;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #21a1f1;
  }
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
`;

const BuySellStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/stocks');
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  const handleBuySell = (stock) => {
    // Handle buy/sell logic here
    console.log('Selected Stock:', stock);
  };

  const handleConfirm = async () => {
    // Handle confirm logic here
    console.log('Confirming transaction');
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Buy & Sell Stocks</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Stock Name</Th>
              <Th>Price</Th>
              <Th>Change</Th>
              <Th>Volume</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
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
    </Container>
  );
};

export default BuySellStocks;