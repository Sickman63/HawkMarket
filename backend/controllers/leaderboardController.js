const User = require('../models/User');
exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.findAll();
        users.sort((a, b) => b.accountValue - a.accountValue);
        res.status(200).json(users.slice(0, 10)); // Return top 10 users
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};