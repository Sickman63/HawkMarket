const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Portfolio = sequelize.define('Portfolio', {
    portfolio_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_on: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Portfolio;