const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const PortfolioValueHistory = sequelize.define('PortfolioValueHistory', {
    history_id: {
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
    value: {
        type: DataTypes.NUMERIC(15, 2),
        allowNull: false,
    },
    transactions_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Transactions',
            key: 'transaction_id',
        },
    },
    recorded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = PortfolioValueHistory;