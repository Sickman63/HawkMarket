import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// Background Animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Container for the entire home page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #1c1e26, #121212);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: #e0e0e0;
  position: relative;
  overflow: hidden;
`;

// Logo Image Styling
const LogoImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px #4a90e2);
`;

// Header Styling
const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1f1f1f;
  padding: 50px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  max-width: 800px;
  width: 100%;
  text-align: center;
  margin-bottom: 50px;
`;

// Main Logo Text
const Logo = styled.h1`
  font-size: 3.5rem;
  color: #4a90e2;
  margin-bottom: 1rem;
  font-weight: 700;
`;

// Tagline Text
const Tagline = styled.p`
  font-size: 1.6rem;
  color: #adb5bd;
  text-align: center;
  margin-bottom: 3rem;
`;

// Navigation Section Styling
const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

// Button Styling
const Button = styled(Link)`
  padding: 0.9rem 2.5rem;
  font-size: 1.3rem;
  color: white;
  background: #4a90e2;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);

  &:hover {
    background-color: #357ab8;
    transform: translateY(-6px);
    box-shadow: 0 15px 30px rgba(74, 144, 226, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
  }
`;

// Features Section Styling
const FeaturesSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  max-width: 1200px;
  text-align: center;
`;

const FeatureCard = styled.div`
  background-color: #1f1f1f;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  width: 250px;

  h3 {
    color: #4a90e2;
    margin-bottom: 10px;
  }

  p {
    color: #adb5bd;
    font-size: 1rem;
  }
`;

// Home Component
const Home = () => {
  return (
    <Container>
      <Header>
        <LogoImage src="/HawkMarket.png" alt="HawkMarket Logo" />
        <Logo>Welcome to HawkMarket!</Logo>
        <Tagline>Practice your trading skills with our realistic stock market simulator.</Tagline>
        <Nav>
          <Button to="/signup">Sign Up</Button>
          <Button to="/login">Login</Button>
        </Nav>
      </Header>
      <FeaturesSection>
        <FeatureCard>
          <h3>Real-Time Data</h3>
          <p>Get real-time stock prices to make informed trades just like in the real world.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>No Risk Involved</h3>
          <p>Simulate your trades without risking real money. Learn and grow confidently.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>Sharpen Your Skills</h3>
          <p>Improve your trading strategies and see how you'd perform in the real market.</p>
        </FeatureCard>
      </FeaturesSection>
    </Container>
  );
};

export default Home;
