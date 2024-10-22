import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

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

const PageTitle = styled.h1`
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

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [gainLoss, setGainLoss] = useState(0);

  useEffect(() => {
    axios.get('/api/portfolio')
      .then(response => {
        setPortfolio(response.data);
        calculateSummary(response.data);
      })
      .catch(error => console.error('Error fetching portfolio:', error));
  }, []);

  const calculateSummary = (data) => {
    let total = 0;
    let gainLoss = 0;
    data.forEach(stock => {
      total += stock.currentPrice * stock.quantity;
      gainLoss += (stock.currentPrice - stock.purchasePrice) * stock.quantity;
    });
    setTotalValue(total);
    setGainLoss(gainLoss);
  };

  const exportToCSV = () => {
    const csvData = portfolio.map(stock => ({
      Stock: stock.name,
      Quantity: stock.quantity,
      'Purchase Price': stock.purchasePrice,
      'Current Price': stock.currentPrice,
      'Total Value': stock.currentPrice * stock.quantity,
    }));
    const csvContent = [
      ['Stock', 'Quantity', 'Purchase Price', 'Current Price', 'Total Value'],
      ...csvData.map(row => Object.values(row)),
    ]
      .map(e => e.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'portfolio.csv');
  };

  return (
    <Container>
      <Header>
        <PageTitle>Portfolio Overview</PageTitle>
      </Header>
      <Section>
        <SectionTitle>Portfolio Summary</SectionTitle>
        <p>Total Value: ${totalValue.toFixed(2)}</p>
        <p>Gain/Loss: ${gainLoss.toFixed(2)}</p>
      </Section>
      <Section>
        <SectionTitle>Stock Breakdown</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Stock</Th>
              <Th>Quantity</Th>
              <Th>Purchase Price</Th>
              <Th>Current Price</Th>
              <Th>Total Value</Th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map(stock => (
              <tr key={stock.id}>
                <Td>{stock.name}</Td>
                <Td>{stock.quantity}</Td>
                <Td>${stock.purchasePrice.toFixed(2)}</Td>
                <Td>${stock.currentPrice.toFixed(2)}</Td>
                <Td>${(stock.currentPrice * stock.quantity).toFixed(2)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={exportToCSV}>Export to CSV</Button>
      </Section>
      <Section>
        <SectionTitle>Stock Performance</SectionTitle>
        <Line
          data={{
            labels: portfolio.map(stock => stock.name),
            datasets: [
              {
                label: 'Current Price',
                data: portfolio.map(stock => stock.currentPrice),
                borderColor: '#61dafb',
                fill: false,
              },
              {
                label: 'Purchase Price',
                data: portfolio.map(stock => stock.purchasePrice),
                borderColor: '#21a1f1',
                fill: false,
              },
            ],
          }}
        />
      </Section>
      <Footer>
        <Link to="/transaction-history">Transaction History</Link>
        <Link to="/market-insights">Stock Market Insights</Link>
      </Footer>
    </Container>
  );
};

export default PortfolioOverview;