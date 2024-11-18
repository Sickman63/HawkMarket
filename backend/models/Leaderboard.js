const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Leaderboard = sequelize.define('Leaderboard', {
    leaderboard_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ranks: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    earnings: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id',
        },
    },
});

module.exports = Leaderboard;