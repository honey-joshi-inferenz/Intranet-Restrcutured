"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class dropdownValues extends Model {
    static associate(models) {
      dropdownValues.hasMany(models.reimburseTransactions, {
        foreignKey: "mode_id",
        as: "reimbursements",
        sourceKey: "id",
      });
    }
  }
  dropdownValues.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      drp_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "dropdownValues",
      tableName: "dropdown_values",
      timestamps: false,
    }
  );
  return dropdownValues;
};
