const models = require("../../../shared/models");
const { Op } = require("sequelize");
const { sequelize } = require("../../../../config/dbConfig");
const { validationResult } = require("express-validator");
const jwtAuth = require("../../../middleware/authorization");

// It will save dropdown values into the database.
const addDropdownValue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const data = {
        name: req.body.name,
        value: req.body.value,
        drp_name: req.body.drp_name,
      };
      var option = await models.dropdownValues.findOne({
        where: { name: data.name, drp_name: data.drp_name },
      });
      if (option) {
        return res.status(409).json({
          status: false,
          code: 409,
          message: "Dropdown option already exist!!",
        });
      } else {
        option = await models.dropdownValues.create(data);
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Dropdown option added successfully.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will fetch dropdown values based on ID.
const getDropdownValueById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { id } = req.query;
      const option = await models.dropdownValues.findOne({
        where: { id },
      });
      if (option) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: option,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Dropdown option with the specified ID does not exists!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will update dropdown values into the database.
const updateDropdownValue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { id } = req.body;

      const [updated] = await models.dropdownValues.update(req.body, {
        where: { id },
      });
      if (updated) {
        const updatedOption = await models.dropdownValues.findOne({
          where: { id },
        });
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Dropdown option updated successfully.",
          data: updatedOption,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Dropdown option with the specified ID does not exists!!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

// It will fetch data of all interviewers name & email.
const getHRDetails = async (req, res) => {
  try {
    const interviewers = await models.users.findAll({
      attributes: ["email", "name", "visible"],
      where: { role: "HR" },
      order: [["id", "DESC"]],
    });
    if (interviewers.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        interviewersCount: interviewers.length,
        data: interviewers,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Interviewer does not exists!!",
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

// It will fetch data of all interviewers name & email.
const getInterviewers = async (req, res) => {
  try {
    const interviewers = await models.users.findAll({
      attributes: ["email", "name", "visible"],
      where: { role: { [Op.ne]: "Employee" } },
      order: [["id", "DESC"]],
    });
    if (interviewers.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        interviewersCount: interviewers.length,
        data: interviewers,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Interviewer does not exists!!",
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

// It will fetch dropdown values of resume sources.
const getResumeSources = async (req, res) => {
  try {
    const sources = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "resume_source",
        },
      },
      order: [["id", "DESC"]],
    });
    if (sources.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: sources,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Resume source does not exist!!",
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

// It will fetch dropdown values of HR Status.
const getHRStatus = async (req, res) => {
  try {
    const options = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "hr_status",
        },
      },
      order: [["id", "DESC"]],
    });
    if (options.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: options,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "HR status does not exists!!",
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

// It will fetch dropdown values of Interview Round.
const getInterviewRounds = async (req, res) => {
  try {
    const rounds = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "interview_round",
        },
      },
      order: [["id", "DESC"]],
    });
    if (rounds.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: rounds,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Interview rounds does not exists!!",
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

// It will fetch dropdown values of Final Status.
const getFinalStatus = async (req, res) => {
  try {
    const status = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "final_status",
        },
      },
      order: [["id", "DESC"]],
    });
    if (status.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: status,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Final status does not exists!!",
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

// It will fetch dropdown values of Users.
const getUsers = async (req, res) => {
  try {
    const users = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "users",
        },
      },
      order: [["id", "DESC"]],
    });
    if (users.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: users,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Users does not exists!!",
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

// It will fetch dropdown values of Department.
const getDepartments = async (req, res) => {
  try {
    const departments = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "department",
        },
      },
      order: [["id", "DESC"]],
    });
    if (departments.length > 0) {
      for (let i = 0; i < departments.length; i++) {
        departments[i] = { serialNumber: i + 1, ...departments[i].dataValues };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: departments,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Department does not exist!!",
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

// It will fetch dropdown values of Position.
const getPositions = async (req, res) => {
  try {
    const positions = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "position",
        },
      },
      order: [["id", "DESC"]],
    });
    if (positions.length > 0) {
      for (let i = 0; i < positions.length; i++) {
        positions[i] = { serialNumber: i + 1, ...positions[i].dataValues };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: positions,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Position does not exists!!",
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

// It will fetch dropdown values of Payment Modes.
const getPaymentModes = async (req, res) => {
  try {
    const positions = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "payment_mode",
        },
      },
      order: [["id", "DESC"]],
    });
    if (positions.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: positions,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Position does not exists!!",
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

// It will fetch dropdown values of reimbursement categories.
const getReimburseCategories = async (req, res) => {
  try {
    const categories = await models.dropdownValues.findAll({
      where: {
        drp_name: {
          [Op.eq]: "reimburse_category",
        },
      },
      order: [["id", "DESC"]],
    });
    if (categories.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: categories,
      });
    }
    return res.status(404).json({
      status: false,
      code: 404,
      message: "Category does not exists!!",
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

//to get columns
function generateAliasFromColumnName(columnName) {
  const words = columnName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const alias = words.join(" ");
  return alias;
}

// It will fetch specific columns from interviewer_candidate table
const getFilteredColumns = async (req, res) => {
  try {
    const tableName = "interviewer_candidate";

    const tableDescription = await sequelize
      .getQueryInterface()
      .describeTable(tableName);

    if (tableDescription) {
      const columnsToExclude = [
        "id",
        "uuid",
        "current_ctc",
        "expected_ctc",
        "negotiated_ctc",
        "template_no",
        "offered_salary",
        "offered_bonus",
        "final_remarks",
        "visible",
      ];

      const columns = Object.keys(tableDescription)
        .map((columnName) => ({
          alias: generateAliasFromColumnName(columnName),
          key: columnName,
        }))
        .filter((column) => !columnsToExclude.includes(column.key));

      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: columns,
      });
    } else {
      res.status(404).json({
        status: false,
        code: 404,
        message: "Data Not Found!!",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal Server Error occurred!!" });
  }
};

// It will delete dropdown values of Position.
const deleteDropdownValue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { id } = req.query;
      const deleted = await models.dropdownValues.destroy({
        where: { id },
      });
      if (deleted) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Dropdown option deleted successfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Dropdown option with the specified ID does not exists!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

const getAppliedYear = async (req, res) => {
  try {
    const applications = await models.interviewerCandidate.findAll({
      where: {
        visible: true,
      },
      attributes: [
        [sequelize.fn("YEAR", sequelize.col("applied_date")), "year"],
      ],
      group: "year",
    });

    return res.status(200).json({
      status: true,
      code: 200,
      count: applications.length,
      data: applications,
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
  addDropdownValue,
  getDropdownValueById,
  updateDropdownValue,
  getHRDetails,
  getInterviewers,
  getResumeSources,
  getHRStatus,
  getInterviewRounds,
  getFinalStatus,
  getUsers,
  getPaymentModes,
  getReimburseCategories,
  getPositions,
  getDepartments,
  getFilteredColumns,
  deleteDropdownValue,
  getAppliedYear,
};
