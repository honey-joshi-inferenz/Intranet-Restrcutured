"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reimburse_transactions", {
      transaction_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      account_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "uuid",
        },
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      mode_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "dropdown_values",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      paid_amount: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      purpose_of_expenditure: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expenditure_category: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date_of_expense: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      invoice: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hr_approved_by: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hr_approved_date: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      admin_approved_by: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      admin_approved_date: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      last_updated_date: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      employee_status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hr_reason_reject: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hr_reason_onhold: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      admin_reason_reject: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      admin_reason_onhold: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      final_status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      month_of_exps: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year_of_exps: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      initiate_date: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reimburse_transactions");
  },
};
