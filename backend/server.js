const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const authRoutes = require('./routes/auth'); // Import the auth routes

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Use body-parser to parse JSON bodies

// Test route
app.get('/', (req, res) => {
  res.send('Stock Trading Simulator Backend');
});

// Use the auth routes
app.use('/api/auth', authRoutes);

// Sync database
const sequelize = new Sequelize('hawkmark', 'admin', 'admin', {
  host: '10.21.6.100',
  dialect: 'postgres',
});

sequelize.sync().then(() => {
  console.log('Connected to PostgreSQL database!');
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});