const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    portfolio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Portfolio',
            key: 'portfolio_id',
        },
    },
    stock_symbol: {
        type: DataTypes.STRING(25),
        allowNull: false,
    },
    stock_market: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    transaction_type: {
        type: DataTypes.STRING(10), // "Buy" or "Sell"
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Transaction;