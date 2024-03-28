require("dotenv").config();
const { SECRET_KEY } = process.env;
const models = require("../../../shared/models");
const { sequelize } = require("../../../../config/dbConfig");
const { Op, literal } = require("sequelize");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(SECRET_KEY);
const express = require("express");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const router = express.Router();
const reader = require("xlsx");
const { connection_hrms } = require("../../../../config/dbConfig");
const jwtAuth = require("../../../middleware/authorization");

function sendEmailHRMS(subject, msgBody) {
  var mailList = ["internal.hr@inferenz.ai"];
  var transporter = nodemailer.createTransport({
    // service: 'office',
    host: "outlook.office365.com",
    port: 587,
    secure: false,
    // tls: { rejectUnauthorized: false },

    auth: {
      user: "hr@inferenz.ai",
      pass: "rxsctfysbcqbpyjc",
    },
  });

  // var mailOptions = {
  //     from: 'hr@inferenz.ai',
  //     to: mailList,
  //     cc: 'hr@inferenz.ai',
  //     subject: subject,
  //     text: msgBody
  // };

  var mailOptions = {
    from: "hr@inferenz.ai",
    to: "sumitjamnani786@smtp-mail.outlook.com.com",
    subject: subject,
    text: msgBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// It will fetch data of all candidates for the home page table.
const getActiveApplications = async (req, res) => {
  try {
    const applications = await models.interviewerCandidate.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`CASE 
              WHEN interviewer_name IS NULL THEN 'Not Assigned' 
              WHEN interviewer_name IS NOT NULL THEN 
                (SELECT name FROM users WHERE email = interviewer_name) 
              END`),
            "interviewer_name",
          ],
          [
            sequelize.literal(`CASE 
              WHEN owner_name IS NOT NULL THEN 
                (SELECT name FROM users WHERE email = owner_name) 
              END`),
            "owner_name",
          ],
          [
            sequelize.literal(`CASE 
              WHEN referred_by IS NOT NULL THEN referred_by 
              END`),
            "referred_by",
          ],
          [
            sequelize.literal(`CASE 
              WHEN resume_source IS NULL AND referred_by IS NULL THEN 'Not Mentioned' 
              WHEN resume_source IS NOT NULL THEN resume_source  
              WHEN referred_by IS NOT NULL THEN 'Referral' 
              END`),
            "resume_source",
          ],
        ],
      },
      where: {
        visible: true,
      },
      order: [["id", "DESC"]],
    });

    if (applications.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        totalApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Data not found!!",
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

// It will return the count of all categories applications.
const getApplicationStatistics = async (req, res) => {
  try {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var today = new Date().toISOString().split("T")[0];

    const totalApplications = await models.interviewerCandidate.findAll({
      where: { visible: true },
    });

    const todaysApplications = await models.interviewerCandidate.findAll({
      where: { applied_date: { [Op.gte]: today }, visible: true },
    });

    const currentMonthApplications = await models.interviewerCandidate.findAll({
      where: { applied_month: currentMonth, visible: true },
    });

    const confirmedApplications = await models.interviewerCandidate.findAll({
      where: { final_status: "Hired", visible: true },
    });

    const inProgressApplications = await models.interviewerCandidate.findAll({
      where: { status_hr: "In Progress", visible: true },
    });

    const joinedApplications = await models.interviewerCandidate.findAll({
      where: { final_status: "Joined", visible: true },
    });

    const pendingApplications = await models.interviewerCandidate.findAll({
      where: { status_hr: "Pending", visible: true },
    });

    const applicationCounts = {
      totalApplications: totalApplications.length,
      todaysApplications: todaysApplications.length,
      currentMonthApplications: currentMonthApplications.length,
      confirmedApplications: confirmedApplications.length,
      inProgressApplications: inProgressApplications.length,
      joinedApplications: joinedApplications.length,
      pendingApplications: pendingApplications.length,
    };

    return res.status(200).json({
      status: true,
      code: 200,
      data: applicationCounts,
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

// It will return the count of confirmed applications.
const getConfirmedApplications = async (req, res) => {
  try {
    const query = `SELECT id, uuid, candidate_name, email, contact, designation, 
    relevant_it_experience, applied_date, interview_round, status_hr, final_status, 
    CASE WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name is not null 
    THEN (SELECT name from users where email = interviewer_name AND role='Interviewer') 
    END AS interviewer_name, owner_name,CASE WHEN referred_by is null THEN 'NA' WHEN 
    referred_by is not null THEN referred_by END AS referred_by,CASE WHEN resume_source 
    is null AND referred_by is null THEN 'Not Mentioned' WHEN resume_source is not null 
    THEN resume_source  WHEN referred_by is not null THEN 'Referral' END AS resume_source 
    FROM interviewer_candidate WHERE final_status = 'Hired' AND visible = true 
    ORDER BY id DESC`;

    const applications = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (applications.length > 0) {
      for (let i = 0; i < applications.length; i++) {
        applications[i] = { serialNumber: i + 1, ...applications[i] };
      }

      return res.status(200).json({
        status: true,
        code: 200,
        confirmedApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "No confirmed applications found!!",
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

// It will return the count of those applications which are received in last month.
const getLastMonthApplications = async (req, res) => {
  try {
    var currentDate = new Date();
    var lastMonth = currentDate.getMonth();

    lastMonth = lastMonth === 0 ? 12 : lastMonth;

    const query = `SELECT id, uuid, candidate_name, email, contact, designation, 
    relevant_it_experience, applied_date, interview_round, status_hr, final_status, 
    CASE WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name 
    is not null THEN (SELECT name from users where email = interviewer_name AND 
    role='Interviewer') END AS interviewer_name, owner_name, CASE WHEN referred_by 
    is null THEN 'NA' WHEN referred_by is not null THEN referred_by END AS referred_by,
    CASE WHEN resume_source is null AND referred_by is null THEN 'Not Mentioned' WHEN 
    resume_source is not null THEN resume_source  WHEN referred_by is not null THEN 
    'Referral' END AS resume_source FROM interviewer_candidate WHERE applied_month = :applied_month AND visible = true ORDER BY id DESC`;

    const applications = await sequelize.query(query, {
      replacements: { applied_month: lastMonth },
      type: sequelize.QueryTypes.SELECT,
    });

    if (applications.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        lastMonthApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "No applications have been received for the last month!!",
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

// It will return the count of those applications which are received in current month.
const getCurrentMonthApplications = async (req, res) => {
  try {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;

    const query = `SELECT id, uuid, candidate_name, email, contact, designation, 
    relevant_it_experience, applied_date, interview_round, status_hr, final_status, 
    CASE WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name 
    is not null THEN (SELECT name from users where email = interviewer_name AND 
    role='Interviewer') END AS interviewer_name, owner_name, CASE WHEN referred_by 
    is null THEN 'NA' WHEN referred_by is not null THEN referred_by END AS referred_by,
    CASE WHEN resume_source is null AND referred_by is null THEN 'Not Mentioned' WHEN 
    resume_source is not null THEN resume_source  WHEN referred_by is not null THEN 
    'Referral' END AS resume_source FROM interviewer_candidate WHERE applied_month = :applied_month AND visible = true ORDER BY id DESC`;

    const applications = await sequelize.query(query, {
      replacements: { applied_month: currentMonth },
      type: sequelize.QueryTypes.SELECT,
    });

    if (applications.length > 0) {
      return res.status(200).json({
        status: true,
        code: 200,
        currentMonthApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "No applications have been received for the current month!!",
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

// It will return the count of those applications which are received today.
const getTodayApplications = async (req, res) => {
  try {
    var today = new Date().toISOString().split("T")[0];

    const query =
      `SELECT id, uuid, candidate_name, email, contact, designation, relevant_it_experience, 
      applied_date, interview_round, status_hr, final_status, CASE WHEN interviewer_name 
      is null THEN 'Not Assigned' WHEN interviewer_name is not null THEN (SELECT name from 
      users where email = interviewer_name AND role='Interviewer') END AS interviewer_name, 
      owner_name,CASE WHEN referred_by is null THEN 'NA' WHEN referred_by is not null THEN 
      referred_by END AS referred_by,CASE WHEN resume_source is null AND referred_by 
      is null THEN 'Not Mentioned' WHEN resume_source is not null THEN resume_source  
      WHEN referred_by is not null THEN 'Referral' END AS resume_source FROM 
      interviewer_candidate WHERE applied_date like '` +
      today +
      `%' AND visible = true ORDER BY id DESC`;

    const applications = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (applications.length > 0) {
      for (let i = 0; i < applications.length; i++) {
        applications[i] = { serialNumber: i + 1, ...applications[i] };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        todayApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "No applications have been received for the today's date!!",
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

// It will fetch the data of particular candidate based on start date & end date.
const getApplicationsBetweenDates = async (req, res) => {
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
      var from_date = new Date(req.query.from_date).toISOString().split("T")[0];
      var to_date = new Date(req.query.to_date);
      to_date.setDate(to_date.getDate() + 1);
      to_date = to_date.toISOString().split("T")[0];

      const query =
        `SELECT candidate_name, email, contact, designation, relevant_it_experience, 
          applied_date, interview_round, status_hr, final_status FROM 
          interviewer_candidate WHERE applied_date >= '` +
        from_date +
        `' AND applied_date <= '` +
        to_date +
        `' AND referred_by IS NULL AND visible = true ORDER BY id DESC`;

      const applications = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      if (applications.length > 0) {
        for (let i = 0; i < applications.length; i++) {
          applications[i] = { serialNumber: i + 1, ...applications[i] };
        }
        return res.status(200).json({
          status: true,
          code: 200,
          totalApplications: applications.length,
          data: applications,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message:
            "No applications have been received for the given date range!!",
        });
      }

      // // var sql =
      // //   "SELECT candidate_name, email, contact, designation, relevant_it_experience, applied_date, interview_round, status_hr, final_status FROM interviewer_candidate WHERE applied_date >= '" +
      // //   from_date +
      // //   "' AND applied_date <= '" +
      // //   to_date +
      // //   "' AND referred_by IS NULL AND visible = true ORDER BY id DESC";
      // connection_hrms.query(sql, function (err, data) {
      //   if (err) throw err;
      //   if (data.length > 0) {
      //     for (let i = 0; i < data.length; i++) {
      //       data[i] = { serialNumber: i + 1, ...data[i] };
      //     }
      //     return res.status(200).json({
      //       status: true,
      //       code: 200,
      //       data,
      //     });
      //   } else {
      //     return res.status(404).json({
      //       status: false,
      //       code: 404,
      //       message: "Applications not received on selected date!!",
      //     });
      //   }
      // });
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

// It will return the count of in progress applications.
const getInProgressApplications = async (req, res) => {
  try {
    const query = `SELECT id,uuid, candidate_name, email, contact, designation, 
    relevant_it_experience, applied_date, interview_round, status_hr, final_status, 
    CASE WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name 
    is not null THEN (SELECT name from users where email = interviewer_name AND 
    role='Interviewer') END AS interviewer_name, owner_name,CASE WHEN referred_by is null 
    THEN 'NA' WHEN referred_by is not null THEN referred_by END AS referred_by,CASE WHEN 
    resume_source is null AND referred_by is null THEN 'Not Mentioned' WHEN resume_source 
    is not null THEN resume_source  WHEN referred_by is not null THEN 'Referral' END AS 
    resume_source FROM interviewer_candidate WHERE status_hr = 'In Progress' AND 
    visible = true ORDER BY id DESC`;

    const applications = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (applications.length > 0) {
      for (let i = 0; i < applications.length; i++) {
        applications[i] = { serialNumber: i + 1, ...applications[i] };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        inProgressApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are currently no ongoing applications in progress!!",
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

// It will return the count of pending applications.
const getPendingApplications = async (req, res) => {
  try {
    const query = `SELECT id,uuid, candidate_name, email, contact, designation, 
    relevant_it_experience, applied_date, interview_round, status_hr, final_status, 
    CASE WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name 
    is not null THEN (SELECT name from users where email = interviewer_name AND 
    role='Interviewer') END AS interviewer_name, owner_name,CASE WHEN referred_by is null 
    THEN 'NA' WHEN referred_by is not null THEN referred_by END AS referred_by,CASE WHEN 
    resume_source is null AND referred_by is null THEN 'Not Mentioned' WHEN resume_source 
    is not null THEN resume_source  WHEN referred_by is not null THEN 'Referral' END AS 
    resume_source FROM interviewer_candidate WHERE status_hr = 'Pending' AND 
    visible = true ORDER BY id DESC`;

    const applications = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (applications.length > 0) {
      for (let i = 0; i < applications.length; i++) {
        applications[i] = { serialNumber: i + 1, ...applications[i] };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        pendingApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are presently no pending applications at the moment!!",
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

// It will return the count of Joined applications.
const getJoinedApplications = async (req, res) => {
  try {
    const query = `SELECT id, uuid, candidate_name, email, contact, designation, 
    relevant_it_experience, applied_date, interview_round, status_hr, final_status, CASE 
    WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name is not null 
    THEN (SELECT name from users where email = interviewer_name AND role='Interviewer') 
    END AS interviewer_name, owner_name, CASE WHEN referred_by is null THEN 'NA' WHEN 
    referred_by is not null THEN referred_by END AS referred_by,CASE WHEN resume_source 
    is null AND referred_by is null THEN 'Not Mentioned' WHEN resume_source is not null 
    THEN resume_source  WHEN referred_by is not null THEN 'Referral' END AS resume_source 
    FROM interviewer_candidate WHERE final_status = 'Joined' AND visible = true 
    ORDER BY id DESC`;

    const applications = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (applications.length > 0) {
      for (let i = 0; i < applications.length; i++) {
        applications[i] = { serialNumber: i + 1, ...applications[i] };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        joinedApplications: applications.length,
        data: applications,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are no active joined applications at this moment!!",
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

//to fetch all data of candidate
const getAllCandidatesData = async (req, res) => {
  try {
    const query = `SELECT *,CASE WHEN interviewer_name is null THEN 'Not Assigned' 
    WHEN interviewer_name is not null THEN (SELECT name from users where 
    email = interviewer_name AND role='Interviewer') END AS interviewer_name,CASE 
    WHEN referred_by is null THEN 'NA' WHEN referred_by is not null THEN referred_by 
    END AS referred_by,CASE WHEN resume_source is null AND referred_by is null THEN 
    'Not Mentioned' WHEN resume_source is not null THEN resume_source  WHEN 
    referred_by is not null THEN 'Referral' END AS resume_source FROM 
    interviewer_candidate WHERE visible = true ORDER BY id DESC`;

    const candidates = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (candidates.length > 0) {
      const columnsToExclude = [
        "id",
        "uuid",
        "current_ctc",
        "expected_ctc",
        "negotiated_ctc",
        "offered_salary",
        "offered_bonus",
        "final_remarks",
        "visible",
      ];
      const filteredRows = candidates.map((row) => {
        for (const column of columnsToExclude) {
          delete row[column];
        }
        return row;
      });

      return res.status(200).json({
        status: true,
        code: 200,
        totalCandidates: filteredRows.length,
        data: filteredRows,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Candidate profile does not exist!!",
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

// It will fetch all the candidates profiles of interviewer.
const getAssignedCandidates = async (req, res) => {
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
      const { uuid } = req.query;
      var today = new Date().toISOString().split("T")[0];

      const interviewer = await models.users.findOne({
        where: { uuid },
      });

      if (interviewer) {
        const candidates = await models.interviewerCandidate.findAll({
          attributes: [
            "uuid",
            "candidate_name",
            "designation",
            "interview_round",
            "interview_date",
            "interview_time",
          ],
          where: {
            interviewer_name: interviewer.dataValues.email,
            interview_date: { [Op.gte]: today },
            [Op.or]: [
              { interview_feedback: null },
              { interview_feedback: { [Op.eq]: "" } },
            ],
          },
          order: [["id", "ASC"]],
        });
        if (candidates) {
          data = candidates.map((candidate, index) => ({
            serialNumber: index + 1,
            ...candidate.dataValues,
          }));

          return res.status(200).json({
            status: true,
            code: 200,
            totalApplications: data.length,
            data,
          });
        } else {
          return res.status(404).json({
            status: false,
            code: 404,
            message: "You have no pending interviews!!",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Interviewer profile does not exist!!",
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

// It will fetch all the candidates profiles of interviewer.
const getCompletedApplications = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Parameters missing!!",
        data: errors.array(),
      });
    } else {
      const { uuid } = req.query;
      const interviewer = await models.users.findOne({
        where: { uuid },
      });

      if (interviewer) {
        const query = `
          SELECT A.*, B.uuid, B.designation, B.status_hr 
          FROM interview_history A, interviewer_candidate B 
          WHERE A.interviewer_name = :interviewerName 
          AND A.email = B.email 
          AND A.applied_date = B.applied_date 
          AND A.interview_feedback IS NOT NULL 
          AND A.interview_feedback != '' 
          ORDER BY A.id DESC
        `;

        const applications = await sequelize.query(query, {
          replacements: { interviewerName: interviewer.dataValues.email },
          type: sequelize.QueryTypes.SELECT,
          raw: true,
        });

        if (applications.length > 0) {
          for (let i = 0; i < applications.length; i++) {
            applications[i] = { serialNumber: i + 1, ...applications[i] };
          }
          return res.status(200).json({
            status: true,
            code: 200,
            totalApplications: applications.length,
            data: applications,
          });
        } else {
          return res.status(404).json({
            status: false,
            code: 404,
            message: "Interview histories found!!",
          });
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occurred!!",
    });
  }
};

router.get("/fetchDelayApplications", jwtAuth.isLoggedIn, (req, res) => {
  try {
    const file = reader.readFile("./src/uploads/PendingApplications.xlsx");
    let candidate_data = [];

    var today = new Date().toISOString().split("T")[0];
    var subject = "Pending Applications of Intranet.";
    var msgBody =
      "Dear HR, \n\nPlease Find Attached XLSX File : https://intranet.inferenz.ai:8000/PendingApplications.xlsx";
    var sql =
      "SELECT id,candidate_name,designation,status_hr,interview_round,final_status,modified_date FROM interviewer_candidate WHERE DATEDIFF('" +
      today +
      "', modified_date) > 7 AND status_hr='In Progress' AND referred_by IS NULL AND visible = true ORDER BY id DESC";
    connection_hrms.query(sql, function (err, data) {
      if (err) throw err;
      else {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            data[i] = { serialNumber: i + 1, ...data[i] };
            candidate_data.push({
              Candidate_Name: data[i].candidate_name,
              Designation: data[i].designation,
              HR_Status: data[i].status_hr,
              Interview_Round: data[i].interview_round,
              Last_Modified_Date: data[i].modified_date,
              Candidate_Profile:
                "https://intranet.inferenz.ai/applicantProfile/" + data[i].id,
            });
            if (i + 1 === data.length) {
              const ws = reader.utils.json_to_sheet(candidate_data);
              const wb = reader.utils.book_new();
              reader.utils.book_append_sheet(wb, ws, "Sheet1");
              reader.writeFile(wb, "./src/uploads/PendingApplications.xlsx");
              sendEmailHRMS(subject, msgBody);
            }
          }
          res.status(200).json({
            status: true,
            message: "Pending Applications Email Sent Successfully.",
          });
        } else {
          console.log("Candidate Profile Upto date.");
        }
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

module.exports = {
  getActiveApplications,
  getApplicationStatistics,
  getConfirmedApplications,
  getLastMonthApplications,
  getCurrentMonthApplications,
  getTodayApplications,
  getApplicationsBetweenDates,
  getInProgressApplications,
  getPendingApplications,
  getJoinedApplications,
  getAllCandidatesData,
  getAssignedCandidates,
  getCompletedApplications,
};
