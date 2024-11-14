const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('hawkmark', 'realuser', 'supadmin', {
  host: '73.176.120.218',
  dialect: 'postgres',
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10000.00,
  },
});

module.exports = User;