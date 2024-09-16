'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A stock can have many transactions
      Stock.hasMany(models.Transaction, {
        foreignKey: 'stockId',
        as: 'transactions'
      });
    }
  }

  Stock.init(
    {
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure each stock symbol is unique
        validate: {
          notEmpty: true, // Do not allow empty symbols
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // Do not allow empty stock names
        }
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0, // Ensure stock price is not negative
        }
      }
    },
    {
      sequelize,
      modelName: 'Stock',
      tableName: 'stocks', // Explicitly specifying the table name
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );

  return Stock;
};