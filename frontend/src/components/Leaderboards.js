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

const Footer = styled.footer`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #282c34;
  color: white;
  width: 100%;
  text-align: center;
`;

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get('/api/leaderboard')
      .then(response => setLeaderboard(response.data))
      .catch(error => console.error('Error fetching leaderboard:', error));
  }, []);

  return (
    <Container>
      <Header>
        <Title>Leaderboards</Title>
      </Header>
      <Section>
        <SectionTitle>Top Performers</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Rank</Th>
              <Th>User</Th>
              <Th>Total Portfolio Value</Th>
              <Th>Percent Gains</Th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.id}>
                <Td>{index + 1}</Td>
                <Td>
                  <Link to={`/profile/${user.id}`}>{user.name}</Link>
                </Td>
                <Td>${user.totalValue.toFixed(2)}</Td>
                <Td>{user.percentGains.toFixed(2)}%</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
      <Footer>
        <Link to="/support">Platform Support</Link>
        <Link to="/news">News</Link>
      </Footer>
    </Container>
  );
};

export default Leaderboards;