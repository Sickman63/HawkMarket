'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'balance', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 10000.00,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'balance');
  }
};