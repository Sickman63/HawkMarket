// Import required modules
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize the app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json()); // Allows the app to handle JSON requests

// Initialize Sequelize
const sequelize = new Sequelize('hawkmark', 'realuser', 'supadmin', {
  host: '73.176.120.218',
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
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10000.00, // Set a default starting balance
  },
});

// Synchronize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error creating database & tables:', error);
  });

// Define a route
app.get('/', (req, res) => {
  res.send('Welcome to the Stock Simulator Backend');
});

// Use routes
app.use('/api/stocks', stockRoutes);
app.use('/api/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});