"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reimburseTransactions extends Model {
    static associate(models) {
      reimburseTransactions.belongsTo(models.users, {
        foreignKey: "account_id",
        as: "user",
        targetKey: "uuid",
      });

      reimburseTransactions.belongsTo(models.dropdownValues, {
        foreignKey: "mode_id",
        as: "paymentModes",
        targetKey: "id",
      });
    }
  }
  reimburseTransactions.init(
    {
      transaction_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      account_id: {
        type: DataTypes.UUID,
      },
      email: {
        type: DataTypes.TEXT,
      },
      mode_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paid_amount: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      purpose_of_expenditure: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expenditure_category: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date_of_expense: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      invoice: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      hr_approved_by: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      hr_approved_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      admin_approved_by: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      admin_approved_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      last_updated_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      employee_status: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      hr_reason_reject: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      hr_reason_onhold: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      admin_reason_reject: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      admin_reason_onhold: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      final_status: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      month_of_exps: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year_of_exps: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      initiate_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "reimburseTransactions",
      tableName: "reimburse_transactions",
      timestamps: false,
    }
  );
  return reimburseTransactions;
};
