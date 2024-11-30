import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';

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

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Leaderboard Data Received:', response.data); // Log the response data
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Container>
      <Header>
        <h1>Leaderboard</h1>
      </Header>

      <Section>
        <h2>Top Performers</h2>
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
            {leaderboard.length > 0 ? leaderboard.map((user, index) => (
              <tr key={user.username}>
                <Td>{index + 1}</Td>
                <Td>
                  <Link to={`/profile/${user.username}`} style={{ color: '#61dafb', textDecoration: 'none' }}>
                    {user.username || 'N/A'}
                  </Link>
                </Td>
                <Td>${(user.totalvalue != null ? parseFloat(user.totalvalue) : 0).toFixed(2)}</Td>
                <Td style={{ color: (user.percentgains != null && user.percentgains < 0) ? 'red' : 'green' }}>
                  {(user.percentgains != null ? parseFloat(user.percentgains) : 0).toFixed(2)}%
                </Td>
              </tr>
            )) : (
              <tr>
                <Td colSpan="4">No leaderboard data available</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default Leaderboards;
