const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    passwords: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    balance: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
        defaultValue: 100000.00,
    },
});

module.exports = User;