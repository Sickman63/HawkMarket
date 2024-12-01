import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #1c1e26;
  color: #f5f5f5;
`;

const Header = styled.header`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #2e3241;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #1c1e26;
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 15px;
  font-size: 1rem;
  color: white;
  background-color: #2c3e50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1a2533;
  }
`;

const BackButton = styled(Button)`
  margin-top: 20px;
  background-color: #adb5bd;

  &:hover {
    background-color: #8a9ba8;
  }
`;

const SignUpLink = styled.p`
  margin-top: 20px;
  font-size: 0.9rem;
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
      console.log('Attempting to log in with:', { username});
      const response = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Error logging in');
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container>
      <Header>
        <h2>Log In</h2>
      </Header>
      <Form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
