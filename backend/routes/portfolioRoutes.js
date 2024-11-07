// backend/routes/portfolioRoutes.js
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const db = require('../config/db');

const router = express.Router();

// Get User Portfolio
router.get('/', verifyToken, async (req, res) => {
  const result = await db.query('SELECT stock_symbol, quantity FROM portfolios WHERE user_id = $1', [req.userId]);
  res.json(result.rows);
});

module.exports = router;