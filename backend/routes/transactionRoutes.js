// backend/routes/transactionRoutes.js
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const db = require('../config/db');

const router = express.Router();

// Buy Stocks
router.post('/buy', verifyToken, async (req, res) => {
  const { stockSymbol, quantity } = req.body;
  const stockPrice = await getStockPrice(stockSymbol);
  const cost = quantity * stockPrice;

  const user = await db.query('SELECT * FROM users WHERE id = $1', [req.userId]);
  if (user.rows[0].cash_balance >= cost) {
    await db.query('INSERT INTO transactions (user_id, stock_symbol, quantity, price_per_share, transaction_type) VALUES ($1, $2, $3, $4, $5)', [req.userId, stockSymbol, quantity, stockPrice, 'BUY']);
    await db.query('UPDATE users SET cash_balance = cash_balance - $1 WHERE id = $2', [cost, req.userId]);
    res.status(200).send('Stock bought successfully');
  } else {
    res.status(400).send('Insufficient balance');
  }
});

// Sell Stocks
router.post('/sell', verifyToken, async (req, res) => {
  const { stockSymbol, quantity } = req.body;
  const stockPrice = await getStockPrice(stockSymbol);

  const holdings = await db.query('SELECT * FROM portfolios WHERE user_id = $1 AND stock_symbol = $2', [req.userId, stockSymbol]);

  if (holdings.rows[0].quantity >= quantity) {
    const earnings = quantity * stockPrice;
    await db.query('INSERT INTO transactions (user_id, stock_symbol, quantity, price_per_share, transaction_type) VALUES ($1, $2, $3, $4, $5)', [req.userId, stockSymbol, quantity, stockPrice, 'SELL']);
    await db.query('UPDATE users SET cash_balance = cash_balance + $1 WHERE id = $2', [earnings, req.userId]);
    res.status(200).send('Stock sold successfully');
  } else {
    res.status(400).send('Not enough shares to sell');
  }
});

module.exports = router;