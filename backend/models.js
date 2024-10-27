// models.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('hawkmark', 'realuser', 'supadmin', {
  host: '73.176.120.218',
  dialect: 'postgres'
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = { User };