// routes/secure.js
const express = require('express');
const authenticateToken = require('../middleware/auth');
const { User } = require('../models');
const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.userId);
  res.json(user);
});

module.exports = router;