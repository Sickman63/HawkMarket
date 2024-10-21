import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin: 0.5rem 0;
  padding: 0.75rem;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin: 1rem 0;
  padding: 0.75rem 1.5rem;
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

const LinkText = styled(Link)`
  color: #61dafb;
  text-decoration: none;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/signup', { email, password });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Container>
      <Title>Sign Up</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Submit</Button>
      </Form>
      <LinkText to="/login">Already have an account? Login here</LinkText>
    </Container>
  );
};

export default SignUp;