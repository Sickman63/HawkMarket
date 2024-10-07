const request = require('supertest');
const app = require('../server'); // Adjust the path as needed
const { sequelize, User } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should not register a user with an existing username', async () => {
    await User.create({
      username: 'testuser',
      password: 'password123',
      email: 'testuser@example.com'
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'anotheremail@example.com'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not register a user with an invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        password: 'password123',
        email: 'invalid-email'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});