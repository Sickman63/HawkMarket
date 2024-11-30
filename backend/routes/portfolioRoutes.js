const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

// Get user portfolio
router.get('/', authMiddleware, portfolioController.getUserPortfolio);

module.exports = router;