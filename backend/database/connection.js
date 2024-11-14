const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hawkmark', 'realuser', 'supadmin', {
    host: '73.176.120.218',
    dialect: 'postgres',
  });

module.exports = sequelize;