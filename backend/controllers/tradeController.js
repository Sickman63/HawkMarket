const pool = require('../database/connection');
const jwt = require('jsonwebtoken');
const stockService = require('../services/stockService');

// Buy Stock Function
exports.buyStock = async (req, res) => {
  const { symbol, market, quantity } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Decode the user's token to get the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user's balance
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userResult.rows[0];

    // Fetch the current stock price using the stockService
    const stockInfo = await stockService.asyncFindStockInfoFromSymbol(symbol, market);
    const price = parseFloat(stockInfo.price);
    
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Invalid stock price fetched' });
    }

    // Calculate the total cost of purchasing the stock
    const cost = price * quantity;

    // Check if the user has enough balance to make the purchase
    if (user.balance < cost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');

      // Deduct the cost from the user's balance
      await client.query('UPDATE users SET balance = balance - $1 WHERE user_id = $2', [cost, userId]);

      // Insert or update the portfolio
      const portfolioResult = await client.query('SELECT * FROM portfolio WHERE user_id = $1', [userId]);
      let portfolioId;
      if (portfolioResult.rows.length === 0) {
        const newPortfolio = await client.query('INSERT INTO portfolio (user_id) VALUES ($1) RETURNING portfolio_id', [userId]);
        portfolioId = newPortfolio.rows[0].portfolio_id;
      } else {
        portfolioId = portfolioResult.rows[0].portfolio_id;
      }

      // Insert the transaction record
      await client.query(
        `INSERT INTO transactions (portfolio_id, stock_symbol, stock_market, transaction_type, quantity, price)
        VALUES ($1, $2, $3, 'Buy', $4, $5)`,
        [portfolioId, symbol, market, quantity, price]
      );

      // Commit the transaction
      await client.query('COMMIT');

      res.status(200).json({ message: 'Stock purchased successfully', currentPrice: price });
    } catch (error) {
      // Rollback the transaction in case of any errors
      await client.query('ROLLBACK');
      console.error('Error buying stock:', error);
      res.status(500).json({ message: 'Error buying stock', error });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing request', error });
  }
};

// Sell Stock Function
exports.sellStock = async (req, res) => {
  const { symbol, market, quantity } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Decode the user's token to get the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user's portfolio and check stock holdings
    const portfolioResult = await pool.query(
      `SELECT p.portfolio_id, t.quantity, t.price FROM portfolio p
       JOIN transactions t ON p.portfolio_id = t.portfolio_id
       WHERE p.user_id = $1 AND t.stock_symbol = $2 AND t.transaction_type = 'Buy'`,
      [userId, symbol]
    );

    if (portfolioResult.rows.length === 0) {
      return res.status(400).json({ message: 'You do not own any shares of this stock.' });
    }

    let totalQuantityOwned = 0;
    let totalValue = 0;
    portfolioResult.rows.forEach((row) => {
      totalQuantityOwned += row.quantity;
      totalValue += row.quantity * row.price;
    });

    if (totalQuantityOwned < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity to sell.' });
    }

    // Fetch the current stock price using the stockService
    const stockInfo = await stockService.asyncFindStockInfoFromSymbol(symbol, market);
    const price = parseFloat(stockInfo.price);

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Invalid stock price fetched' });
    }

    const proceeds = price * quantity;

    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');

      // Update the user's balance with the proceeds of the sale
      await client.query('UPDATE users SET balance = balance + $1 WHERE user_id = $2', [proceeds, userId]);

      // Insert the sell transaction record
      const portfolioId = portfolioResult.rows[0].portfolio_id;
      await client.query(
        `INSERT INTO transactions (portfolio_id, stock_symbol, stock_market, transaction_type, quantity, price)
        VALUES ($1, $2, $3, 'Sell', $4, $5)`,
        [portfolioId, symbol, market, quantity, price]
      );

      // Commit the transaction
      await client.query('COMMIT');

      res.status(200).json({ message: 'Stock sold successfully', currentPrice: price });
    } catch (error) {
      // Rollback the transaction in case of any errors
      await client.query('ROLLBACK');
      console.error('Error selling stock:', error);
      res.status(500).json({ message: 'Error selling stock', error });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing request', error });
  }
};
