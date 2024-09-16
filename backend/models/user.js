'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A user can have many transactions
      User.hasMany(models.Transaction, {
        foreignKey: 'userId',
        as: 'transactions'
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure usernames are unique
        validate: {
          notEmpty: true, // Do not allow empty usernames
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Validates the format of the email
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100], // Ensure password is between 8 and 100 characters
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users', // Explicitly specifying the table name
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );

  return User;
};