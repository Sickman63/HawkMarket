const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user-info', authMiddleware, userController.getUserInfo);

module.exports = router;