const pool = require('../database/connection');

async function updateUserBalance(userId) {
  try {
    const portfolioValue = await pool.query(
      `SELECT COALESCE(SUM(sh.quantity * s.current_price), 0) AS portfolio_value
       FROM stock_holdings sh
       JOIN stock s ON sh.symbol = s.symbol
       WHERE sh.portfolio_id = (SELECT portfolio_id FROM portfolio WHERE user_id = $1)`,
      [userId]
    );

    const buyingPower = await pool.query(
      `SELECT buying_power FROM users WHERE user_id = $1`,
      [userId]
    );

    const newBalance = portfolioValue.rows[0].portfolio_value + parseFloat(buyingPower.rows[0].buying_power);

    await pool.query(
      `UPDATE users SET balance = $1 WHERE user_id = $2`,
      [newBalance, userId]
    );
  } catch (error) {
    console.error('Error updating user balance:', error);
  }
}

module.exports = {
  updateUserBalance,
};
