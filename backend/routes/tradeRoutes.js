const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

router.post('/buy', tradeController.buyStock); // Route to buy stock
router.post('/sell', tradeController.sellStock); // Route to sell stock

module.exports = router;