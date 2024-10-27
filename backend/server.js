// Import required modules
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

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

//signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({username: username, password: hashedPassword, balance: 10000.00,});
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.log(error)
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

// Route to fetch user balance
app.get('/api/user/balance', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findByPk(decoded.userId);
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance', error });
  }
});

// Scraper logic
async function asyncFindStockInfoFromURL(url) {
  const response = await fetch(url);
  const $ = cheerio.load(await response.text());

  const symbol = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf(":"));
  const market = url.slice(url.lastIndexOf(":") + 1, url.lastIndexOf("?"));

  const nameIndex = $.html().lastIndexOf("zzDege");
  const nameTrim = $.html().slice(nameIndex, nameIndex + 100);
  const name = nameTrim.slice(nameTrim.indexOf(">") + 1, nameTrim.indexOf("<")).replace("&amp;", "&");
  const priceIndex = $.html().indexOf("YMlKec fxKbKc");
  const priceTrim = $.html().slice(priceIndex, priceIndex + 100);
  const price = priceTrim.slice(priceTrim.indexOf("$") + 1, priceTrim.indexOf("<"));
  if (name.length > 80) {
    return {
      price: -1,
      symbol: symbol,
      market: market,
      name: "invalid stock: " + symbol + ":" + market
    };
  }

  return {
    price: price,
    symbol: symbol,
    market: market,
    name: name
  };
}

async function asyncFindStockInfoFromSymbol(symbol, market) {
  const url = `https://www.google.com/finance/quote/${symbol}:${market}?hl=en`;
  return await asyncFindStockInfoFromURL(url);
}

// Route to fetch stock data
app.get('/api/stocks', async (req, res) => {
  const stockList = [
    { symbol: 'F', market: 'NYSE' },
    { symbol: 'NVDA', market: 'NASDAQ' },
    // Add more stocks as needed
  ];

  const stockData = await Promise.all(stockList.map(stock => asyncFindStockInfoFromSymbol(stock.symbol, stock.market)));
  res.json(stockData);
});

// Route to handle buy requests
app.post('/api/buy', async (req, res) => {
  const { symbol, market, quantity } = req.body;
  // Handle buy logic here
  res.json({ message: `Bought ${quantity} shares of ${symbol}:${market}` });
});

// Route to handle sell requests
app.post('/api/sell', async (req, res) => {
  const { symbol, market, quantity } = req.body;
  // Handle sell logic here
  res.json({ message: `Sold ${quantity} shares of ${symbol}:${market}` });
});

// Start the server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});