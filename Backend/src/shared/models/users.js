"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.hasMany(models.reimburseTransactions, {
        foreignKey: "account_id",
        as: "reimbursements",
        sourceKey: "uuid",
      });
      users.hasMany(models.productDetails, {
        foreignKey: "account_id",
        as: "products",
        sourceKey: "uuid",
      });
    }
  }
  users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        index: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contact: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      emp_code: {
        type: DataTypes.TEXT,
      },
      dept_name: {
        type: DataTypes.TEXT,
      },
      manager_name: {
        type: DataTypes.TEXT,
      },
      role: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_temp_password: {
        type: DataTypes.BOOLEAN,
      },
      visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "users",
      tableName: "users",
      timestamps: false,
    }
  );
  return users;
};
