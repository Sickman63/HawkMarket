import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #1c1e26;
  color: #f5f5f5;
  height: 100vh;
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

const LinkText = styled(Link)`
  color: #61dafb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/signup', formData);
      setError('');
      console.log('User registered:', response.data);
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      setError('Error registering user');
      console.error('Error registering user:', error);
    }
  };

  return (
    <Container>
      <Header>
        <h2>Sign Up</h2>
      </Header>
      <Form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit">Sign Up</Button>
        <p>
          Already have an account? <LinkText to="/login">Login</LinkText>
        </p>
      </Form>
      <BackButton onClick={() => navigate(-1)}>Back</BackButton>
    </Container>
  );
};

export default SignUp;
