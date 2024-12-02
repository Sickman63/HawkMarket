import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Background Animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Container for the entire login page
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
  color: #f5f5f5;
`;

// Logo Image Styling
const LogoImage = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px #4a90e2);

  @media (max-width: 480px) {
    width: 100px;
  }
`;

// Header Styling
const Header = styled.header`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 2rem;
    color: #4a90e2;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
`;

// Form Styling
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background-color: #2e3241;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 480px) {
    padding: 30px;
  }
`;

// Input Styling
const Input = styled.input`
  margin-bottom: 20px;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #3b3f51;
  color: #f5f5f5;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
  }
`;

// Button Styling
const Button = styled.button`
  margin-top: 15px;
  padding: 15px;
  font-size: 1.2rem;
  color: white;
  background: linear-gradient(135deg, #4a90e2, #357ab8);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);

  &:hover {
    background: linear-gradient(135deg, #357ab8, #4a90e2);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(74, 144, 226, 0.6);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
  }
`;

// Back Button Styling
const BackButton = styled(Button)`
  margin-top: 20px;
  background: #adb5bd;
  color: #1c1e26;

  &:hover {
    background: #8a9ba8;
  }
`;

// Sign Up Link Styling
const SignUpLink = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: #adb5bd;

  a {
    color: #61dafb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to log in with:', { username });
      const response = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container>
      {/* Added the Logo */}
      <LogoImage src="/HawkMarket.png" alt="HawkMarket Logo" />
      <Header>
        <h2>Log In to Your Account</h2>
      </Header>
      <Form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Sign In</Button>
      </Form>
      <SignUpLink>
        or <a href="/signup">create an account</a>
      </SignUpLink>
      <BackButton onClick={() => navigate(-1)}>Back</BackButton>
    </Container>
  );
};

export default Login;
