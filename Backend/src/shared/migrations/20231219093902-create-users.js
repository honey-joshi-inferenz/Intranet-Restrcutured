"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contact: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      emp_code: {
        type: Sequelize.TEXT,
      },
      dept_name: {
        type: Sequelize.TEXT,
      },
      manager_name: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_temp_password: {
        type: Sequelize.BOOLEAN,
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });

    // Adding index using a separate query
    await queryInterface.addIndex("users", ["uuid"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
