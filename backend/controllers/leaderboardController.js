const pool = require('../database/connection');

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.username, u.account_value
      FROM users u
      ORDER BY u.account_value DESC
      LIMIT 10
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};