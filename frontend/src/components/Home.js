import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaChartLine, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Overview = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #444;
`;

const Icon = styled.div`
  margin-right: 0.5rem;
  color: #61dafb;
`;

const Button = styled(Link)`
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: white;
  background-color: #61dafb;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #21a1f1;
  }
`;

const Home = () => {
  return (
    <Container>
      <Title>Welcome to the Stock Trading Simulator</Title>
      <Overview>
        boutta cum!
      </Overview>
      <Features>
        <Feature>
          <Icon><FaChartLine size={24} /></Icon>
          Real-time market updates and analytics
        </Feature>
        <Feature>
          <Icon><FaUserPlus size={24} /></Icon>
          Easy sign-up and account management
        </Feature>
        <Feature>
          <Icon><FaSignInAlt size={24} /></Icon>
          Secure login and personalized dashboard
        </Feature>
      </Features>
      <Button to="/signup">Sign Up</Button>
      <Button to="/login">Login</Button>
    </Container>
  );
};

export default Home;