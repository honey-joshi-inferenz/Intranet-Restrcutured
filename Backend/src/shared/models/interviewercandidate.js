"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class interviewerCandidate extends Model {
    static associate(models) {
      // define association here
    }
  }
  interviewerCandidate.init(
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
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      candidate_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contact: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      resume_source: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      designation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      relevant_it_experience: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      current_ctc: {
        type: DataTypes.TEXT,
      },
      expected_ctc: {
        type: DataTypes.TEXT,
      },
      negotiated_ctc: {
        type: DataTypes.TEXT,
      },
      current_organisation: {
        type: DataTypes.TEXT,
      },
      current_location: {
        type: DataTypes.TEXT,
      },
      permanent_place: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      notice_period: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reason_for_job_change: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      relocate_to_ahmedabad: {
        type: DataTypes.BOOLEAN,
      },
      relocate_location: {
        type: DataTypes.TEXT,
      },
      other_offer_on_hand: {
        type: DataTypes.BOOLEAN,
      },
      other_offer_amount: {
        type: DataTypes.TEXT,
      },
      candidate_linkedin: {
        type: DataTypes.TEXT,
      },
      reference1_name: {
        type: DataTypes.TEXT,
      },
      reference1_contact: {
        type: DataTypes.TEXT,
      },
      reference2_name: {
        type: DataTypes.TEXT,
      },
      reference2_contact: {
        type: DataTypes.TEXT,
      },
      remarks_hr: {
        type: DataTypes.TEXT,
      },
      status_hr: {
        type: DataTypes.TEXT,
      },
      interview_round: {
        type: DataTypes.TEXT,
      },
      interviewer_name: {
        type: DataTypes.TEXT,
      },
      owner_name: {
        type: DataTypes.TEXT,
      },
      interview_date: {
        type: DataTypes.TEXT,
      },
      interview_time: {
        type: DataTypes.TEXT,
      },
      interview_feedback: {
        type: DataTypes.TEXT,
      },
      interview_softSkills: {
        type: DataTypes.JSON,
        get: function () {
          const rawValue = this.getDataValue("interview_softSkills");
          try {
            return rawValue ? JSON.parse(rawValue) : null;
          } catch (error) {
            console.error(
              `Error parsing interview_softSkills: ${error.message}`
            );
            return null;
          }
        },
      },
      eligible_for_next_round: {
        type: DataTypes.BOOLEAN,
      },
      final_status: {
        type: DataTypes.TEXT,
      },
      template_no: {
        type: DataTypes.TEXT,
      },
      other_reason: {
        type: DataTypes.TEXT,
      },
      offered_date: {
        type: DataTypes.TEXT,
      },
      joinig_date: {
        type: DataTypes.TEXT,
      },
      offered_salary: {
        type: DataTypes.TEXT,
      },
      offered_bonus: {
        type: DataTypes.TEXT,
      },
      final_remarks: {
        type: DataTypes.TEXT,
      },
      applied_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      applied_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      candidate_resume: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      referred_by: {
        type: DataTypes.TEXT,
      },
      referral_email: {
        type: DataTypes.TEXT,
      },
      modified_by: {
        type: DataTypes.TEXT,
      },
      modified_date: {
        type: DataTypes.TEXT,
      },
      visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "interviewerCandidate",
      tableName: "interviewer_candidate",
      timestamps: false,
    }
  );
  return interviewerCandidate;
};
