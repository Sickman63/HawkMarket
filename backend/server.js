// Import required modules
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize the app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json()); // Allows the app to handle JSON requests

// Initialize Sequelize
const sequelize = new Sequelize('hawkmark', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define a route
app.get('/', (req, res) => {
  res.send('Welcome to the Stock Simulator Backend');
});

//signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ id, username, password: hashedPassword, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP});
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

//login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Start the server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});