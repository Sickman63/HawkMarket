const express = require('express');
const { Sequelize, User, Stock, Transaction } = require('./models'); // Adjust imports as needed
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Stock Trading Simulator Backend');
});

// Sync database
const sequelize = new Sequelize('trading_sim', 'postgres', 'temppass', {
  host: '127.0.0.1',
  dialect: 'postgres',
});

sequelize.sync().then(() => {
  console.log('Connected to PostgreSQL database!');
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});