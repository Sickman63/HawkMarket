// test/server.test.js

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server'); // Adjust the path as necessary
const { User } = require('../models'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('POST /login', () => {
  before(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({ username: 'testuser', password: hashedPassword });
  });

  after(async () => {
    // Clean up the test user
    await User.destroy({ where: { username: 'testuser' } });
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Login successful');
    expect(res.body).to.have.property('token');
  });

  it('should return 400 for invalid username', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'invaliduser', password: 'testpassword' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Invalid username or password');
  });

  it('should return 400 for invalid password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'invalidpassword' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Invalid username or password');
  });

  it('should return 500 for server error', async () => {
    // Simulate a server error by mocking User.findOne to throw an error
    const findOneStub = sinon.stub(User, 'findOne').throws(new Error('Server error'));

    const res = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(res.status).to.equal(500);
    expect(res.body).to.have.property('message', 'Error logging in');

    findOneStub.restore();
  });
});