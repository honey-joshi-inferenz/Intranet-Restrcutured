"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class interviewHistory extends Model {
    static associate(models) {
      // define association here
    }
  }
  interviewHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      candidate_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      interview_round: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      remarks_hr: {
        type: DataTypes.TEXT,
      },
      interviewer_name: {
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
      applied_date: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "interviewHistory",
      tableName: "interview_history",
      timestamps: false,
    }
  );
  return interviewHistory;
};
