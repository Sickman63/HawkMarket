const pool = require('../database/connection');
const stockService = require('../services/stockService');

// Buy Stock Function
exports.buyStock = async (req, res) => {
  const { symbol, market, quantity } = req.body;

  try {
    const userId = req.user.user_id;  // Use req.user from middleware

    // Fetch the user's balance and buying power
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userResult.rows[0];

    // Get the current stock price from the database, instead of scraping
    const stockPriceResult = await pool.query('SELECT current_price FROM stock WHERE symbol = $1', [symbol]);
    if (stockPriceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const price = parseFloat(stockPriceResult.rows[0].current_price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Invalid stock price fetched from the database' });
    }

    // Calculate the total cost of purchasing the stock
    const cost = price * quantity;

    // Check if the user has enough buying power to make the purchase
    if (user.buying_power < cost) {
      return res.status(400).json({ message: 'Insufficient buying power' });
    }

    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');

      // Lock rows to prevent concurrent modifications
      await client.query('SELECT * FROM users WHERE user_id = $1 FOR UPDATE', [userId]);
      await client.query('SELECT * FROM stock WHERE symbol = $1 FOR UPDATE', [symbol]);

      // Deduct the cost from the user's buying power
      await client.query('UPDATE users SET buying_power = buying_power - $1 WHERE user_id = $2', [cost, userId]);

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
        VALUES ($1, $2, $3, 'buy', $4, $5)`,
        [portfolioId, symbol, market, quantity, price]
      );

      // Insert or update stock holdings
      await client.query(`
        INSERT INTO stock_holdings (portfolio_id, symbol, market, quantity, purchase_price)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (portfolio_id, symbol)
        DO UPDATE SET quantity = stock_holdings.quantity + EXCLUDED.quantity;
      `, [portfolioId, symbol, market, quantity, price]);

      // Update `updated_on` timestamp in portfolio
      await client.query('UPDATE portfolio SET updated_on = NOW() WHERE portfolio_id = $1', [portfolioId]);

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

  try {
    const userId = req.user.user_id;  // Use req.user from middleware

    // Fetch the user's portfolio and check stock holdings
    const portfolioResult = await pool.query(
      `SELECT p.portfolio_id, sh.quantity FROM portfolio p
       JOIN stock_holdings sh ON p.portfolio_id = sh.portfolio_id
       WHERE p.user_id = $1 AND sh.symbol = $2`,
      [userId, symbol]
    );

    if (portfolioResult.rows.length === 0 || portfolioResult.rows[0].quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity to sell.' });
    }

    const portfolioId = portfolioResult.rows[0].portfolio_id;

    // Get the current stock price from the database, instead of scraping
    const stockPriceResult = await pool.query('SELECT current_price FROM stock WHERE symbol = $1', [symbol]);
    if (stockPriceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const price = parseFloat(stockPriceResult.rows[0].current_price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Invalid stock price fetched from the database' });
    }

    const proceeds = price * quantity;

    const client = await pool.connect();
    try {
      // Begin a transaction
      await client.query('BEGIN');

      // Lock rows to prevent concurrent modifications
      await client.query('SELECT * FROM users WHERE user_id = $1 FOR UPDATE', [userId]);
      await client.query('SELECT * FROM stock WHERE symbol = $1 FOR UPDATE', [symbol]);

      // Update the user's buying power with the proceeds of the sale
      await client.query('UPDATE users SET buying_power = buying_power + $1 WHERE user_id = $2', [proceeds, userId]);

      // Insert the sell transaction record
      await client.query(
        `INSERT INTO transactions (portfolio_id, stock_symbol, stock_market, transaction_type, quantity, price)
        VALUES ($1, $2, $3, 'sell', $4, $5)`,
        [portfolioId, symbol, market, quantity, price]
      );

      // Update stock holdings
      await client.query(`
        UPDATE stock_holdings
        SET quantity = quantity - $1
        WHERE portfolio_id = $2 AND symbol = $3
      `, [quantity, portfolioId, symbol]);

      // Remove holdings if quantity is zero
      await client.query(`
        DELETE FROM stock_holdings
        WHERE portfolio_id = $1 AND symbol = $2 AND quantity <= 0
      `, [portfolioId, symbol]);

      // Update `updated_on` timestamp in portfolio
      await client.query('UPDATE portfolio SET updated_on = NOW() WHERE portfolio_id = $1', [portfolioId]);

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
