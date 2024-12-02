import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';

// Container for the entire leaderboard page
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

// Section Styling for the leaderboard table
const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  background-color: #1f1f1f;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;

  h2 {
    color: #00bcd4;
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
`;

// Table Styling
const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  color: #f5f5f5;
`;

// Table Header Styling
const Th = styled.th`
  padding: 15px;
  background-color: #4a90e2;
  text-align: left;
  font-size: 1.1rem;
`;

// Table Cell Styling
const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #444;
  font-size: 1rem;
  text-align: left;

  &:first-child {
    text-align: center;
  }
`;

// Link Styling for user profile links
const UserLink = styled(Link)`
  color: #61dafb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userInfo, setUserInfo] = useState({ balance: null, buying_power: null });

  useEffect(() => {
    // Fetch user information
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/users/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
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
        <div>
          <p>Account Value: ${userInfo.balance !== null ? userInfo.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}</p>
          <p>Buying Power: ${userInfo.buying_power !== null ? userInfo.buying_power.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}</p>
        </div>
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
                  <UserLink to={`/profile/${user.username}`}>
                    {user.username || 'N/A'}
                  </UserLink>
                </Td>
                <Td>
                  ${user.totalvalue != null ? parseFloat(user.totalvalue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </Td>
                <Td style={{ color: user.percentgains != null && user.percentgains < 0 ? 'red' : 'green' }}>
                  {user.percentgains != null ? parseFloat(user.percentgains).toFixed(2) : '0.00'}%
                </Td>
              </tr>
            )) : (
              <tr>
                <Td colSpan="4" style={{ textAlign: 'center' }}>No leaderboard data available</Td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default Leaderboards;
