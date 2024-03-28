const models = require("../../../shared/models");
const { sequelize } = require("../../../../config/dbConfig");
const { Op } = require("sequelize");
const moment = require("moment");

const getCountsByOwner = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const { duration, values, dateRange } = req.query;
    const parsedValues = JSON.parse(values);
    const parsedDateRange = JSON.parse(dateRange);

    // Convert timestamps to Date objects
    const startDate = new Date(parsedDateRange[0]);
    const endDate = new Date(parsedDateRange[1]);
    const appliedDate = moment().subtract(duration, "days").toDate();

    let whereConditions = {
      role: { [Op.eq]: "HR" },
      visible: true,
    };

    let filtersCondition = "";
    const filters = [
      "status_hr",
      "interview_round",
      "final_status",
      "owner_name",
      "resume_source",
    ];
    filters.forEach((filter) => {
      if (parsedValues[filter] !== "") {
        if (
          filter === "resume_source" &&
          parsedValues.resume_source === "Others"
        ) {
          filtersCondition += `
            AND ic.resume_source NOT IN ('Linkedin', 'Career Page', 'Naukri', 'Referral')
          `;
        } else {
          filtersCondition += `
            AND ic.${filter} = '${parsedValues[filter]}'
          `;
        }
      }
    });

    const candidates = await models.users.findAll({
      where: whereConditions,
      attributes: [
        "name",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM interviewer_candidate ic WHERE ic.owner_name = users.email AND ic.visible = true ${
              duration != "0"
                ? ` AND ic.applied_date >= '${appliedDate.toISOString()}' AND ic.applied_date <= '${today}'`
                : ""
            }${
              dateRange.length > 0 && !isNaN(startDate) && !isNaN(endDate)
                ? `AND ic.applied_date >= '${startDate.toISOString()}' AND ic.applied_date <= '${endDate.toISOString()}'`
                : ""
            }${filtersCondition})`
          ),
          "count",
        ],
      ],
    });

    return res.status(200).json({
      status: true,
      code: 200,
      data: candidates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getCountsByPosition = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const { duration, values, dateRange } = req.query;
    const parsedValues = JSON.parse(values);
    const parsedDateRange = JSON.parse(dateRange);

    const startDate = new Date(parsedDateRange[0]);
    const endDate = new Date(parsedDateRange[1]);

    const whereConditions = {
      visible: true,
      [Op.and]: [
        { designation: { [Op.not]: null } },
        { designation: { [Op.not]: "" } },
      ],
    };

    if (duration !== "0") {
      const appliedDate = moment().subtract(duration, "days").toDate();
      whereConditions.applied_date = { [Op.between]: [appliedDate, today] };
    }

    if (dateRange.length > 0 && !isNaN(startDate) && !isNaN(endDate)) {
      whereConditions.applied_date = { [Op.between]: [startDate, endDate] };
    }

    const filters = [
      "status_hr",
      "interview_round",
      "final_status",
      "owner_name",
      "resume_source",
    ];
    filters.forEach((filter) => {
      if (
        filter === "resume_source" &&
        parsedValues.resume_source === "Others"
      ) {
        whereConditions.resume_source = {
          [Op.notIn]: ["Linkedin", "Career Page", "Naukri", "Referral"],
        };
      } else if (parsedValues[filter] !== "") {
        whereConditions[filter] = { [Op.eq]: parsedValues[filter] };
      }
    });

    const candidates = await models.interviewerCandidate.count({
      where: whereConditions,
      attributes: ["designation"],
      group: "designation",
    });

    return res.status(200).json({
      status: true,
      code: 200,
      data: candidates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getUpcomingJoiner = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const candidates = await models.interviewerCandidate.findAll({
      where: {
        // joinig_date: [{ [Op.not]: null || "" }, { [Op.gte]: today }],
        [Op.and]: [
          { joinig_date: { [Op.gte]: today } },
          {
            [Op.or]: [
              { joinig_date: { [Op.not]: null } },
              { joinig_date: { [Op.not]: "" } },
            ],
          },
          // { joinig_date: { [Op.not]: null } },
        ],
        visible: true,
      },
      attributes: ["uuid", "candidate_name", "designation", "joinig_date"],
    });

    return res.status(200).json({
      status: true,
      code: 200,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getCountsByResumeSource = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const { duration, values, dateRange } = req.query;
    const parsedValues = JSON.parse(values);
    const parsedDateRange = JSON.parse(dateRange);

    const startDate = new Date(parsedDateRange[0]);
    const endDate = new Date(parsedDateRange[1]);

    const whereConditions = {
      visible: true,
      [Op.and]: [
        { resume_source: { [Op.not]: null } },
        { resume_source: { [Op.not]: "" } },
      ],
    };

    if (duration !== "0") {
      const appliedDate = moment().subtract(duration, "days").toDate();
      whereConditions.applied_date = { [Op.between]: [appliedDate, today] };
    }

    if (dateRange.length > 0 && !isNaN(startDate) && !isNaN(endDate)) {
      whereConditions.applied_date = { [Op.between]: [startDate, endDate] };
    }

    const filters = [
      "status_hr",
      "interview_round",
      "final_status",
      "owner_name",
      "resume_source",
    ];
    filters.forEach((filter) => {
      if (
        filter === "resume_source" &&
        parsedValues.resume_source === "Others"
      ) {
        whereConditions.resume_source = {
          [Op.notIn]: ["Linkedin", "Career Page", "Naukri", "Referral"],
        };
      } else if (parsedValues[filter] !== "") {
        whereConditions[filter] = { [Op.eq]: parsedValues[filter] };
      }
    });

    const candidates = await models.interviewerCandidate.count({
      where: whereConditions,
      attributes: ["resume_source"],
      group: "resume_source",
    });

    return res.status(200).json({
      status: true,
      code: 200,
      data: candidates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getCountByMonth = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const { duration, values, dateRange } = req.query;
    const parsedValues = JSON.parse(values);

    let whereConditions = {
      visible: true,
    };

    if (duration !== "0") {
      const year = parseInt(duration);
      const startDate = new Date(year, 0, 1); // January 1st of the selected year
      const endDate = new Date(year + 1, 0, 1); // January 1st of the next year

      whereConditions.applied_date = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    const filters = [
      "status_hr",
      "interview_round",
      "final_status",
      "owner_name",
      "resume_source",
    ];
    filters.forEach((filter) => {
      if (
        filter === "resume_source" &&
        parsedValues.resume_source === "Others"
      ) {
        whereConditions.resume_source = {
          [Op.notIn]: ["Linkedin", "Career Page", "Naukri", "Referral"],
        };
      } else if (parsedValues[filter] !== "") {
        whereConditions[filter] = { [Op.eq]: parsedValues[filter] };
      }
    });

    const candidates = await models.interviewerCandidate.findAll({
      where: whereConditions,
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("applied_date")), "applied_month"],
        [sequelize.literal("COUNT(*)"), "count"],
      ],
      group: [sequelize.fn("MONTH", sequelize.col("applied_date"))],
    });

    // Map month numbers to month names
    const monthNames = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };

    // Replace month numbers with month names
    const data = candidates.map((candidate) => ({
      applied_month: monthNames[candidate.applied_month],
      count: candidate.dataValues.count,
    }));

    return res.status(200).json({
      status: true,
      code: 200,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getCountsByHrStatus = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const { duration, values, dateRange } = req.query;
    const parsedValues = JSON.parse(values);
    const parsedDateRange = JSON.parse(dateRange);

    const startDate = new Date(parsedDateRange[0]);
    const endDate = new Date(parsedDateRange[1]);

    const whereConditions = {
      visible: true,
      [Op.and]: [
        { status_hr: { [Op.not]: null } },
        { status_hr: { [Op.not]: "" } },
      ],
    };

    if (duration !== "0") {
      const appliedDate = moment().subtract(duration, "days").toDate();
      whereConditions.applied_date = { [Op.between]: [appliedDate, today] };
    }

    if (dateRange.length > 0 && !isNaN(startDate) && !isNaN(endDate)) {
      whereConditions.applied_date = { [Op.between]: [startDate, endDate] };
    }

    const filters = [
      "status_hr",
      "interview_round",
      "final_status",
      "owner_name",
      "resume_source",
    ];
    filters.forEach((filter) => {
      if (
        filter === "resume_source" &&
        parsedValues.resume_source === "Others"
      ) {
        whereConditions.resume_source = {
          [Op.notIn]: ["Linkedin", "Career Page", "Naukri", "Referral"],
        };
      } else if (parsedValues[filter] !== "") {
        whereConditions[filter] = { [Op.eq]: parsedValues[filter] };
      }
    });

    const candidates = await models.interviewerCandidate.count({
      where: whereConditions,
      attributes: ["status_hr"],
      group: "status_hr",
    });

    return res.status(200).json({
      status: true,
      code: 200,
      data: candidates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getCountsByFinalStatus = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const { duration, values, dateRange } = req.query;
    const parsedValues = JSON.parse(values);
    const parsedDateRange = JSON.parse(dateRange);

    const startDate = new Date(parsedDateRange[0]);
    const endDate = new Date(parsedDateRange[1]);

    const whereConditions = {
      visible: true,
      [Op.and]: [
        { final_status: { [Op.not]: null } },
        { final_status: { [Op.not]: "" } },
      ],
    };

    if (duration !== "0") {
      const appliedDate = moment().subtract(duration, "days").toDate();
      whereConditions.applied_date = { [Op.between]: [appliedDate, today] };
    }

    if (dateRange.length > 0 && !isNaN(startDate) && !isNaN(endDate)) {
      whereConditions.applied_date = { [Op.between]: [startDate, endDate] };
    }

    const filters = [
      "status_hr",
      "interview_round",
      "final_status",
      "owner_name",
      "resume_source",
    ];
    filters.forEach((filter) => {
      if (
        filter === "resume_source" &&
        parsedValues.resume_source === "Others"
      ) {
        whereConditions.resume_source = {
          [Op.notIn]: ["Linkedin", "Career Page", "Naukri", "Referral"],
        };
      } else if (parsedValues[filter] !== "") {
        whereConditions[filter] = { [Op.eq]: parsedValues[filter] };
      }
    });

    const candidates = await models.interviewerCandidate.count({
      where: whereConditions,
      attributes: ["final_status"],
      group: "final_status",
    });

    return res.status(200).json({
      status: true,
      code: 200,
      data: candidates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getCountsByInterviewRounds = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];
    const { duration, values, dateRange } = req.query;
    const parsedValues = JSON.parse(values);
    const parsedDateRange = JSON.parse(dateRange);

    const startDate = new Date(parsedDateRange[0]);
    const endDate = new Date(parsedDateRange[1]);

    const whereConditions = {
      visible: true,
      [Op.and]: [
        { interview_round: { [Op.not]: null } },
        { interview_round: { [Op.not]: "" } },
      ],
    };

    if (duration !== "0") {
      const appliedDate = moment().subtract(duration, "days").toDate();
      whereConditions.applied_date = { [Op.between]: [appliedDate, today] };
    }

    if (dateRange.length > 0 && !isNaN(startDate) && !isNaN(endDate)) {
      whereConditions.applied_date = { [Op.between]: [startDate, endDate] };
    }

    const filters = [
      "status_hr",
      "interview_round",
      "final_status",
      "owner_name",
      "resume_source",
    ];
    filters.forEach((filter) => {
      if (
        filter === "resume_source" &&
        parsedValues.resume_source === "Others"
      ) {
        whereConditions.resume_source = {
          [Op.notIn]: ["Linkedin", "Career Page", "Naukri", "Referral"],
        };
      } else if (parsedValues[filter] !== "") {
        whereConditions[filter] = { [Op.eq]: parsedValues[filter] };
      }
    });

    const candidates = await models.interviewerCandidate.count({
      where: whereConditions,
      attributes: ["interview_round"],
      group: "interview_round",
    });

    return res.status(200).json({
      status: true,
      code: 200,
      data: candidates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

module.exports = {
  getCountsByOwner,
  getCountsByPosition,
  getUpcomingJoiner,
  getCountsByResumeSource,
  getCountByMonth,
  getCountsByHrStatus,
  getCountsByFinalStatus,
  getCountsByInterviewRounds,
};
