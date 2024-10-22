const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const authRoutes = require('../routes/auth');

// Setup Express app
const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Setup Sequelize
const sequelize = new Sequelize('hawkmark', 'admin', 'admin', {
  host: '73.176.120.218',
  dialect: 'postgres',
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/auth/signup', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'TestUser',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'TestUser');
  });

  it('should not register a user with an existing username', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'TestUser',
        password: 'password123'
      });

    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'TestUser',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });

  it('should not register a user with a short password', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'TestUser',
        password: 'short'
      });

    // Expect a 400 status code indicating a bad request
    expect(response.status).toBe(400);
    // Expect the response body to have an error message indicating the password is too short
    expect(response.body.errors[0]).toHaveProperty('msg', 'Password must be at least 6 characters long');
  });
});