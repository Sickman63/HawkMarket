const pool = require('../database/connection');

exports.getLeaderboard = async (req, res) => {
  try {
    // Sort users by their balance
    const result = await pool.query(`
      SELECT username, balance AS totalValue, 0.00 AS percentGains
      FROM users
      ORDER BY balance
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};