'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Transaction.belongsTo(models.Stock, {
        foreignKey: 'stockId',
        as: 'stock'
      });
    }
  }

  Transaction.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the target model
          key: 'id'
        }
      },
      stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Stocks', // Name of the target model
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1 // Quantity must be at least 1
        }
      },
      transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['buy', 'sell']] // Restrict to 'buy' or 'sell' values
        }
      }
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions', // Explicitly specifying the table name
      timestamps: true // Enable timestamps to track createdAt and updatedAt
    }
  );

  return Transaction;
};