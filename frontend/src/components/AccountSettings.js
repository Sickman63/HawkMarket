import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from '../api/axiosConfig';

// Background Animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Container for the entire settings page
const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #1c1e26, #121212);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 15s ease infinite;
  border-radius: 16px;
  max-width: 600px;
  margin: 3rem auto;
  color: #f5f5f5;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 90%;
  }
`;

// Logo Image Styling
const LogoImage = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  filter: drop-shadow(0 0 10px #4a90e2);

  @media (max-width: 480px) {
    width: 100px;
  }
`;

// Title Styling
const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  color: #4a90e2;
  font-size: 2.5rem;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

// User Info Styling
const UserInfo = styled.div`
  font-size: 1.3rem;
  background-color: #2e3241;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  p {
    margin-bottom: 1rem;
  }

  strong {
    color: #61dafb;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    font-size: 1.1rem;
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
      {/* Integrating the HawkMarket Logo */}
      <LogoImage src="/HawkMarket.png" alt="HawkMarket Logo" />
      <Title>Account Settings</Title>
      <UserInfo>
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Joined:</strong> {userInfo.created_on ? new Date(userInfo.created_on).toLocaleDateString() : 'Unknown'}</p>
      </UserInfo>
    </Container>
  );
};

export default AccountSettings;
