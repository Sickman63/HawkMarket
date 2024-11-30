import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axiosConfig';

const Container = styled.div`
  padding: 2rem;
  color: #f5f5f5;
  background-color: #2e3241;
  border-radius: 8px;
  max-width: 600px;
  margin: 2rem auto;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.div`
  font-size: 1.2rem;

  p {
    margin-bottom: 0.5rem;
  }

  strong {
    color: #4a90e2;
  }
`;

const AccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    created_at: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('/users/user-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserInfo(userRes.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Container>
      <Title>Account Settings</Title>
      <UserInfo>
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Joined:</strong> {userInfo.created_on ? new Date(userInfo.created_on).toLocaleDateString() : 'Unknown'}</p>
      </UserInfo>
    </Container>
  );
};

export default AccountSettings;
