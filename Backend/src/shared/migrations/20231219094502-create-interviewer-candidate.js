"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("interviewer_candidate", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      candidate_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contact: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      resume_source: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      designation: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      relevant_it_experience: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      current_ctc: {
        type: Sequelize.TEXT,
      },
      expected_ctc: {
        type: Sequelize.TEXT,
      },
      negotiated_ctc: {
        type: Sequelize.TEXT,
      },
      current_organisation: {
        type: Sequelize.TEXT,
      },
      current_location: {
        type: Sequelize.TEXT,
      },
      permanent_place: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      notice_period: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      reason_for_job_change: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      relocate_to_ahmedabad: {
        type: Sequelize.BOOLEAN,
      },
      relocate_location: {
        type: Sequelize.TEXT,
      },
      other_offer_on_hand: {
        type: Sequelize.BOOLEAN,
      },
      other_offer_amount: {
        type: Sequelize.TEXT,
      },
      candidate_linkedin: {
        type: Sequelize.TEXT,
      },
      reference1_name: {
        type: Sequelize.TEXT,
      },
      reference1_contact: {
        type: Sequelize.TEXT,
      },
      reference2_name: {
        type: Sequelize.TEXT,
      },
      reference2_contact: {
        type: Sequelize.TEXT,
      },
      remarks_hr: {
        type: Sequelize.TEXT,
      },
      status_hr: {
        type: Sequelize.TEXT,
      },
      interview_round: {
        type: Sequelize.TEXT,
      },
      interviewer_name: {
        type: Sequelize.TEXT,
      },
      owner_name: {
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
      final_status: {
        type: Sequelize.TEXT,
      },
      template_no: {
        type: Sequelize.TEXT,
      },
      other_reason: {
        type: Sequelize.TEXT,
      },
      offered_date: {
        type: Sequelize.TEXT,
      },
      joinig_date: {
        type: Sequelize.TEXT,
      },
      offered_salary: {
        type: Sequelize.TEXT,
      },
      offered_bonus: {
        type: Sequelize.TEXT,
      },
      final_remarks: {
        type: Sequelize.TEXT,
      },
      applied_date: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      applied_month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      candidate_resume: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      referred_by: {
        type: Sequelize.TEXT,
      },
      referral_email: {
        type: Sequelize.TEXT,
      },
      modified_by: {
        type: Sequelize.TEXT,
      },
      modified_date: {
        type: Sequelize.TEXT,
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("interviewer_candidate");
  },
};
