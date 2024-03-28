"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("interview_history", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      candidate_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      interview_round: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      remarks_hr: {
        type: Sequelize.TEXT,
      },
      interviewer_name: {
        type: Sequelize.TEXT,
      },
      interview_date: {
        type: Sequelize.TEXT,
      },
      interview_time: {
        type: Sequelize.TEXT,
      },
      interview_feedback: {
        type: Sequelize.TEXT,
      },
      interview_softSkills: {
        type: Sequelize.JSON,
      },
      eligible_for_next_round: {
        type: Sequelize.BOOLEAN,
      },
      applied_date: {
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("interview_history");
  },
};
