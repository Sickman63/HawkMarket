// Import required modules
const express = require('express');
const cors = require('cors');

// Initialize the app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json()); // Allows the app to handle JSON requests

// Define a route
app.get('/', (req, res) => {
  res.send('Welcome to the Stock Simulator Backend');
});

// Start the server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});