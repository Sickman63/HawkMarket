const pool = require('../database/connection');

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.user_id; // Assumes the authMiddleware adds `user` to `req`.
    const queryText = 'SELECT username, balance, buying_power, daily_change FROM users WHERE user_id = $1';
    const result = await pool.query(queryText, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};