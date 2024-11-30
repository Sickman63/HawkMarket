const pool = require('../database/connection');

// Get User Portfolio
exports.getUserPortfolio = async (req, res) => {
  try {
    const userId = req.user.user_id;  // Use req.user from middleware

    const portfolioResult = await pool.query(
      `SELECT sh.symbol, sh.quantity, s.current_price, sh.purchase_price, s.name
       FROM stock_holdings sh
       JOIN stock s ON sh.symbol = s.symbol
       WHERE sh.portfolio_id = (SELECT portfolio_id FROM portfolio WHERE user_id = $1)`,
      [userId]
    );

    const holdings = portfolioResult.rows.map((row) => ({
      ...row,
      purchase_price: row.purchase_price !== null ? parseFloat(row.purchase_price) : null,
      current_price: row.current_price !== null ? parseFloat(row.current_price) : null,
    }));

    res.status(200).json(holdings);
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    res.status(500).json({ message: 'Error fetching portfolio', error });
  }
};
