const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const stockService = require('../services/stockService'); // Import stock service to fetch prices

// Function to handle buying stocks
exports.buyStock = async (req, res) => {
    const { symbol, market, quantity } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        // Decode the user's token to get the userId
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findByPk(decoded.userId);

        // Fetch the current stock price using the stockService
        const stockInfo = await stockService.asyncFindStockInfoFromSymbol(symbol, market);
        const price = parseFloat(stockInfo.price);

        // Ensure the price is valid
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: 'Invalid stock price fetched' });
        }

        // Calculate the total cost of purchasing the stock
        const cost = price * quantity;

        // Check if the user has enough balance to make the purchase
        if (user.balance < cost) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // Update user's balance and buying power
        user.balance -= cost;
        user.buying_power = user.balance;

        // Find or create a portfolio for the user
        let portfolio = await Portfolio.findOne({ where: { user_id: user.user_id } });
        if (!portfolio) {
            portfolio = await Portfolio.create({ user_id: user.user_id });
        }

        // Create a transaction record for the purchase
        await Transaction.create({
            portfolio_id: portfolio.portfolio_id,
            stock_symbol: symbol,
            stock_market: market,
            transaction_type: 'Buy',
            quantity,
            price,
        });

        // Save the updated user information
        await user.save();

        // Respond to the client with success
        res.status(200).json({ message: `Stock purchased successfully`, currentPrice: price });
    } catch (error) {
        console.error('Error buying stock:', error);
        res.status(500).json({ message: 'Error buying stock', error });
    }
};

// Function to handle selling stocks
exports.sellStock = async (req, res) => {
    const { symbol, market, quantity } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        // Decode the user's token to get the userId
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findByPk(decoded.userId);

        // Find the user's portfolio
        let portfolio = await Portfolio.findOne({ where: { user_id: user.user_id } });
        if (!portfolio) {
            return res.status(404).json({ message: 'No portfolio found' });
        }

        // Find the transaction for the specified stock
        let transaction = await Transaction.findOne({
            where: { portfolio_id: portfolio.portfolio_id, stock_symbol: symbol, transaction_type: 'Buy' },
        });

        // Ensure the user has enough quantity to sell
        if (!transaction || transaction.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock quantity to sell' });
        }

        // Fetch the current stock price using the stockService
        const stockInfo = await stockService.asyncFindStockInfoFromSymbol(symbol, market);
        const price = parseFloat(stockInfo.price);

        // Ensure the price is valid
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: 'Invalid stock price fetched' });
        }

        // Calculate earnings from the sale
        const earnings = price * quantity;

        // Update user's balance and buying power
        user.balance += earnings;
        user.buying_power = user.balance;

        // Update the stock quantity or remove if all shares are sold
        transaction.quantity -= quantity;
        if (transaction.quantity === 0) {
            await transaction.destroy();
        } else {
            await transaction.save();
        }

        // Create a transaction record for the sale
        await Transaction.create({
            portfolio_id: portfolio.portfolio_id,
            stock_symbol: symbol,
            stock_market: market,
            transaction_type: 'Sell',
            quantity,
            price,
        });

        // Save the updated user information
        await user.save();

        // Respond to the client with success
        res.status(200).json({ message: `Stock sold successfully`, currentPrice: price });
    } catch (error) {
        console.error('Error selling stock:', error);
        res.status(500).json({ message: 'Error selling stock', error });
    }
};