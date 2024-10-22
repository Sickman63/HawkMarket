import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';

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

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('/api/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  const exportToCSV = () => {
    const csvData = transactions.map(transaction => ({
      Date: transaction.date,
      Stock: transaction.stock,
      Type: transaction.type,
      Quantity: transaction.quantity,
      Price: transaction.price,
      'Total Value': transaction.totalValue,
    }));
    const csvContent = [
      ['Date', 'Stock', 'Type', 'Quantity', 'Price', 'Total Value'],
      ...csvData.map(row => Object.values(row)),
    ]
      .map(e => e.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transaction_history.csv');
  };

  return (
    <Container>
      <Header>
        <Title>Transaction History</Title>
      </Header>
      <Section>
        <SectionTitle>Transactions</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Stock</Th>
              <Th>Type</Th>
              <Th>Quantity</Th>
              <Th>Price</Th>
              <Th>Total Value</Th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <Td>{transaction.date}</Td>
                <Td>{transaction.stock}</Td>
                <Td>{transaction.type}</Td>
                <Td>{transaction.quantity}</Td>
                <Td>${transaction.price.toFixed(2)}</Td>
                <Td>${transaction.totalValue.toFixed(2)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={exportToCSV}>Download CSV</Button>
      </Section>
      <Footer>
        <Link to="/portfolio">Portfolio Management</Link>
        <Link to="/market-trends">Market Trends</Link>
      </Footer>
    </Container>
  );
};

export default TransactionHistory;