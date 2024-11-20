const pool = require('../database/connection');

exports.getUserPortfolio = async (req, res) => {
  try {
    // Assumes that authMiddleware adds `user` to `req`, with `user_id` included
    const userId = req.user.user_id;

    // Query to fetch the user's portfolio details
    const queryText = `
      SELECT p.symbol, p.market, p.quantity, p.purchase_price, s.current_price, s.name 
      FROM portfolio p
      JOIN stock s ON p.symbol = s.symbol
      WHERE p.user_id = $1
    `;

    // Executing the query to fetch portfolio
    const result = await pool.query(queryText, [userId]);

    // Send the portfolio details to the user
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
};