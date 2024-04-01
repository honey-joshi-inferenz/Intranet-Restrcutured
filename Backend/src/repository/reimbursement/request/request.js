require("dotenv").config();
const { CDN_URL, REGION, PROFILE, BUCKET, SECRET_KEY } = process.env;
const models = require("../../../shared/models");
const { sequelize } = require("../../../../config/dbConfig");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var nodemailer = require("nodemailer");
const moment = require("moment");
var mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");
const regEx = /[`!@#$%^&*()+\-=\[\{};':"\\|,<>\/?~]/g;

const s3Client = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
});

var dir = "./src/uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const imageStorage = multer.diskStorage({
  destination: "uploads/invoice",
  filename: function (req, file, cb) {
    req.imageName =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(null, req.imageName);
  },
});

const imageUpload = multer({
  storage: imageStorage,
});

var mailTransporter = nodemailer.createTransport({
  host: "outlook.office365.com",
  port: 587,
  secure: false,
  pool: true,
  maxConnections: 3,

  auth: {
    user: "hr@inferenz.ai",
    pass: "rxsctfysbcqbpyjc",
  },
});

const modifyRequestBody = (requestData) => {
  var parsedData = requestData.data
    ? JSON.parse(requestData.data)
    : JSON.parse(JSON.stringify(requestData), (key, value) => {
        if (
          typeof value === "string" &&
          (value.match(/^'(-?\d+(\.\d+)?)'$/) || value.match(/^-?\d+(\.\d+)?$/))
        ) {
          return parseFloat(value.replace(/'/g, ""));
        }
        if (value === "null") return null;
        return value;
      });

  return parsedData;
};

function sendReimburseEmail(
  subject,
  msgBody,
  fileName,
  attachment,
  email,
  name
) {
  var mailList = ["internal.hr@inferenz.ai"];
  var transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false,

    auth: {
      user: "hr@inferenz.ai",
      pass: "rxsctfysbcqbpyjc",
    },
  });

  var mailOptions = {
    from: "hr@inferenz.ai",
    to: mailList,
    cc: "hr@inferenz.ai",
    subject: subject,
    text: msgBody,
    attachments: [{ filename: fileName, path: attachment }],
  };

  var mailOptions1 = {
    from: "hr@inferenz.ai",
    to: email,
    cc: "hr@inferenz.ai",
    subject: "Reimbursement Request from " + name,
    text:
      "Dear " +
      name +
      "\n\nThank you for raising the reimbursement request. Your request is received, and we will keep you posted on it.\n\nThanks,\nTeam HR.",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      transporter.sendMail(mailOptions1, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("Reimbursement acknowledgement: " + info.response);
        }
      });
    }
  });
}

function sendAdminReimburseEmail(subject, msgBody, userEmail) {
  var transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false,
    pool: true,
    maxConnections: 1,

    auth: {
      user: "hr@inferenz.ai",
      pass: "rxsctfysbcqbpyjc",
    },
  });

  var mailOptions = {
    from: "hr@inferenz.ai",
    to: userEmail,
    cc: "internal.hr@inferenz.ai",
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

function sendHRReimburseEmail(name, reason, adminName) {
  var mailList = ["internal.hr@inferenz.ai"];
  // var mailList = ['honey.joshi@inferenz.ai']
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

  var mailOptions = {
    from: "hr@inferenz.ai",
    to: mailList,
    cc: "internal.hr@inferenz.ai",
    subject: "Status of the Reimbursement Request of " + name,
    text:
      "Dear HR,\n\nThis is to inform you that the reimbursement request from " +
      name +
      " is put on hold due to below mentioned reason.\n\nReason : " +
      reason +
      "\n\nYou are requested to guide the employee in resubmitting the reimbursement request if the employee required any assistance.\n\nThanks,\n" +
      adminName,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function sendResubmitReimburseEmail(subject, msgBody, fileName, attachment) {
  var mailList = ["internal.hr@inferenz.ai"];
  var transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false,

    auth: {
      user: "hr@inferenz.ai",
      pass: "rxsctfysbcqbpyjc",
    },
  });

  var mailOptions = {
    from: "hr@inferenz.ai",
    to: mailList,
    cc: "hr@inferenz.ai",
    subject: subject,
    text: msgBody,
    attachments: [{ filename: fileName, path: attachment }],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Resubmit Email sent: " + info.response);
    }
  });
}

function sendReimburseEmailToAdmin(reason, date, amount, fileName, attachment) {
  var mailList = ["internal.hr@inferenz.ai"];
  var transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false,

    auth: {
      user: "hr@inferenz.ai",
      pass: "rxsctfysbcqbpyjc",
    },
  });

  var mailOptions = {
    from: "hr@inferenz.ai",
    to: mailList,
    cc: "internal.hr@inferenz.ai",
    subject: "New Reimbursement Request",
    text:
      "Dear Admin,\n\nI would like to inform you that we have received a new reimbursement request and the details are as follows:\n\nReason for reimbursement : " +
      reason +
      "\nExpense Date : " +
      moment(date).format("DD-MM-YYYY") +
      "\nAmount : ₹ " +
      amount +
      "\n\nPlease find the attached expense invoice for your reference.\n\nThe request has been approved by the HR. Kindly verify it at your end and approve so that the finance department can proceed further with the payment.\n\nThanks,\nTeam HR",
    attachments: [{ filename: fileName, path: attachment }],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Admin Email sent: " + info.response);
    }
  });
}

// It will enter candidate details manually it into the database.
const addNewRequest = async (req, res) => {
  try {
    req.body = modifyRequestBody(req.body);
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { account_id } = req.body;
      const user = await models.users.findOne({
        where: { uuid: account_id },
      });
      if (user) {
        const regEx = /[`!@#$%^&*()+\-=\[\{};':"\\|,<>\/?~]/g;
        var mimeType = mime.lookup(
          "./src/uploads/invoice/" + req.file.filename
        );

        const bucketParams = {
          Bucket: BUCKET,
          Key:
            "Intranet/Invoices/" +
            req.file.filename.replace(/ /g, "_").replace(regEx, ""),
          Body: fs.readFileSync("./src/uploads/invoice/" + req.file.filename),
          ContentDisposition: "inline",
          ContentType: mimeType,
        };

        await s3Client.send(new PutObjectCommand(bucketParams)).catch((err) => {
          console.log(err);
        });

        const file = req.file;
        let data = req.body;
        const currentDate = new Date()
          .toISOString()
          .slice(0, 23)
          .replace("T", " ");
        var MOE = new Date(data.date_of_expense);

        var reimburseData = {
          account_id,
          email: user.dataValues.email,
          mode_id: data.mode_id,
          paid_amount: data.paid_amount,
          purpose_of_expenditure: data.purpose_of_expenditure,
          expenditure_category: data.expenditure_category,
          date_of_expense: data.date_of_expense,
          invoice: CDN_URL + bucketParams.Key,
          hr_approved_by: "Pending",
          hr_approved_date: "Pending",
          admin_approved_by: "Pending",
          admin_approved_date: "Pending",
          last_updated_date: "Pending",
          employee_status: "Initiated",
          status: "Pending",
          hr_reason_reject: "",
          hr_reason_onhold: "",
          admin_reason_reject: "",
          admin_reason_onhold: "",
          final_status: "Pending",
          month_of_exps: MOE.getMonth() + 1,
          year_of_exps: MOE.getFullYear(),
          initiate_date: currentDate,
          visible: true,
        };

        await models.reimburseTransactions.create(reimburseData);

        var subject = "Reimbursement Request from " + user.dataValues.name;

        var msgBody =
          "Dear HR," +
          "\n\nI would like to inform you that I am " +
          user.dataValues.name +
          " and I work in " +
          user.dataValues.dept_name +
          " department of the company.\n\nI want to request you for the reimbursement and details are as follows:" +
          "\n\nReason for reimbursement : " +
          reimburseData.purpose_of_expenditure +
          "\nExpense Date : " +
          moment(reimburseData.date_of_expense).format("DD-MM-YYYY") +
          "\nAmount : ₹ " +
          reimburseData.paid_amount +
          "\n\nPlease find the attached expense invoice for your reference.\n\nI hope you would consider my request.\n\nThanks,\n" +
          user.dataValues.name;

        sendReimburseEmail(
          subject,
          msgBody,
          file.filename,
          reimburseData.invoice,
          reimburseData.email,
          user.dataValues.name
        );

        fs.unlink("./src/uploads/invoice/" + file.filename, function (err) {
          if (err) return console.log(err);
        });

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Request submitted Successfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "User does not exist!!",
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

// to get deatils of reimbursement request based on id.
const getRequestById = async (req, res) => {
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
      const { transaction_id } = req.query;

      var transactionDetails = await models.reimburseTransactions.findOne({
        where: { transaction_id },
        attributes: {
          include: [
            [sequelize.col("user.name"), "name"],
            [sequelize.col("user.email"), "email"],
            [sequelize.col("user.emp_code"), "emp_code"],
            [sequelize.col("user.dept_name"), "dept_name"],
            [sequelize.col("paymentModes.name"), "paymentMode"],
          ],
        },
        include: [
          {
            model: models.dropdownValues,
            as: "paymentModes",
            required: true,
            attributes: [],
          },
          {
            model: models.users,
            as: "user",
            required: true,
            attributes: [],
          },
        ],
      });

      if (transactionDetails) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: transactionDetails,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message:
            "Reimbursement request with the specified ID does not exist!!",
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

// to fetch all the requests for the current employee
const getMyReimbursements = async (req, res) => {
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
      const { account_id } = req.query;

      var requests = await models.reimburseTransactions.findAll({
        where: { account_id },
        attributes: {
          include: [
            [sequelize.col("user.name"), "name"],
            [sequelize.col("user.email"), "email"],
            [sequelize.col("user.emp_code"), "emp_code"],
            [sequelize.col("user.dept_name"), "dept_name"],
            [sequelize.col("paymentModes.name"), "paymentMode"],
          ],
        },
        include: [
          {
            model: models.dropdownValues,
            as: "paymentModes",
            required: true,
            attributes: [],
          },
          {
            model: models.users,
            as: "user",
            required: true,
            attributes: [],
          },
        ],
        order: [["transaction_id", "DESC"]],
      });

      if (requests.length > 0) {
        for (let i = 0; i < requests.length; i++) {
          if (
            (requests[i].status == "Approved" ||
              requests[i].status == "On Hold") &&
            (requests[i].final_status == "Pending" ||
              requests[i].final_status == "On Hold" ||
              requests[i].final_status == "Approved")
          ) {
            requests[i].employee_status = "In Progress";
          } else if (
            requests[i].status == "Approved" &&
            requests[i].final_status == "Payment Done"
          ) {
            requests[i].employee_status = "Completed";
          } else if (
            requests[i].status == "Rejected" ||
            requests[i].final_status == "Rejected"
          ) {
            requests[i].employee_status = "Rejected";
          }

          requests[i] = { serialNumber: i + 1, ...requests[i].dataValues };
        }
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: requests,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "You have not made any reimbursement request yet!!",
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

// get all initiated request for HR dashboard
const getAllRequests = async (req, res) => {
  try {
    var requests = await models.reimburseTransactions.findAll({
      where: { visible: true },
      attributes: {
        include: [
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.email"), "email"],
          [sequelize.col("user.emp_code"), "emp_code"],
          [sequelize.col("user.dept_name"), "dept_name"],
          [sequelize.col("paymentModes.name"), "paymentMode"],
        ],
      },
      include: [
        {
          model: models.dropdownValues,
          as: "paymentModes",
          required: true,
          attributes: [],
        },
        {
          model: models.users,
          as: "user",
          required: true,
          attributes: [],
        },
      ],
      order: [["transaction_id", "DESC"]],
    });

    if (requests.length > 0) {
      for (let i = 0; i < requests.length; i++) {
        if (
          (requests[i].status == "Approved" ||
            requests[i].status == "On Hold") &&
          (requests[i].final_status == "Pending" ||
            requests[i].final_status == "On Hold" ||
            requests[i].final_status == "Approved")
        ) {
          requests[i].employee_status = "In Progress";
        } else if (
          requests[i].status == "Approved" &&
          requests[i].final_status == "Payment Done"
        ) {
          requests[i].employee_status = "Completed";
        } else if (
          requests[i].status == "Rejected" ||
          requests[i].final_status == "Rejected"
        ) {
          requests[i].employee_status = "Rejected";
        }
        requests[i] = { serialNumber: i + 1, ...requests[i].dataValues };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: requests,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "You have not made any reimbursement request yet!!",
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

// get all approved requests for admin dashboard
const getApprovedRequests = async (req, res) => {
  try {
    var requests = await models.reimburseTransactions.findAll({
      where: {
        status: {
          [Op.in]: ["Approved", "Rejected", "On Hold"],
        },
        visible: true,
      },
      attributes: {
        include: [
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.email"), "email"],
          [sequelize.col("user.emp_code"), "emp_code"],
          [sequelize.col("user.dept_name"), "dept_name"],
          [sequelize.col("paymentModes.name"), "paymentMode"],
        ],
      },
      include: [
        {
          model: models.dropdownValues,
          as: "paymentModes",
          required: true,
          attributes: [],
        },
        {
          model: models.users,
          as: "user",
          required: true,
          attributes: [],
        },
      ],
      order: [["transaction_id", "DESC"]],
    });

    if (requests.length > 0) {
      for (let i = 0; i < requests.length; i++) {
        if (
          (requests[i].status == "Approved" ||
            requests[i].status == "On Hold") &&
          (requests[i].final_status == "Pending" ||
            requests[i].final_status == "On Hold" ||
            requests[i].final_status == "Approved")
        ) {
          requests[i].employee_status = "In Progress";
        } else if (
          requests[i].status == "Approved" &&
          requests[i].final_status == "Payment Done"
        ) {
          requests[i].employee_status = "Completed";
        } else if (
          requests[i].status == "Rejected" ||
          requests[i].final_status == "Rejected"
        ) {
          requests[i].employee_status = "Rejected";
        }
        requests[i] = { serialNumber: i + 1, ...requests[i].dataValues };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: requests,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are no requests approved yet!!",
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

//get rejected requests for admin dashboard
const getRejectedRequests = async (req, res) => {
  try {
    var requests = await models.reimburseTransactions.findAll({
      where: {
        [Op.or]: [{ final_status: "Rejected" }, { status: "Rejected" }],
        visible: true,
      },
      attributes: {
        include: [
          [sequelize.col("user.name"), "name"],
          [sequelize.col("user.email"), "email"],
          [sequelize.col("user.emp_code"), "emp_code"],
          [sequelize.col("user.dept_name"), "dept_name"],
          [sequelize.col("paymentModes.name"), "paymentMode"],
        ],
      },
      include: [
        {
          model: models.dropdownValues,
          as: "paymentModes",
          required: true,
          attributes: [],
        },
        {
          model: models.users,
          as: "user",
          required: true,
          attributes: [],
        },
      ],
      order: [["transaction_id", "DESC"]],
    });

    if (requests.length > 0) {
      for (let i = 0; i < requests.length; i++) {
        requests[i] = { serialNumber: i + 1, ...requests[i].dataValues };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: requests,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are no rejected requests available yet!!",
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

//update existing request
const updateRequest = async (req, res) => {
  try {
    req.body = modifyRequestBody(req.body);
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const file = req.file;
      req.body.last_updated_date = new Date()
        .toISOString()
        .slice(0, 23)
        .replace("T", " ");
      var { transaction_id } = req.body;

      var request = await models.reimburseTransactions.findOne({
        where: { transaction_id },
      });

      if (request) {
        if (!file) {
          req.body.filename = path.basename(request.dataValues.invoice);
          req.body.invoice = request.dataValues.invoice;
        } else {
          var mimeType = mime.lookup("./src/uploads/invoice/" + file.filename);

          const bucketParams = {
            Bucket: BUCKET,
            Key:
              "Intranet/Invoices/" +
              file.filename.replace(/ /g, "_").replace(regEx, ""),
            Body: fs.readFileSync("./src/uploads/invoice/" + file.filename),
            ContentDisposition: "inline",
            ContentType: mimeType,
          };

          await s3Client
            .send(new PutObjectCommand(bucketParams))
            .catch((err) => {
              console.log(err);
            });

          fs.unlink("./src/uploads/invoice/" + file.filename, function (err) {
            if (err) return console.log(err);
          });

          req.body.filename = file.filename;
          req.body.invoice = CDN_URL + bucketParams.Key;
        }

        await models.reimburseTransactions.update(req.body, {
          where: {
            transaction_id,
          },
        });

        var transactionDetails = await models.reimburseTransactions.findOne({
          where: { transaction_id },
          attributes: {
            include: [
              [sequelize.col("user.name"), "name"],
              [sequelize.col("user.email"), "email"],
              [sequelize.col("user.emp_code"), "emp_code"],
              [sequelize.col("user.dept_name"), "dept_name"],
              [sequelize.col("paymentModes.name"), "paymentMode"],
            ],
          },
          include: [
            {
              model: models.dropdownValues,
              as: "paymentModes",
              required: true,
              attributes: [],
            },
            {
              model: models.users,
              as: "user",
              required: true,
              attributes: [],
            },
          ],
        });

        if (transactionDetails) {
          var updatedData = transactionDetails.dataValues;
          var subject =
            "Updated Reimbursement Request from " + updatedData.name;

          var msgBody =
            "Dear HR," +
            "\n\nI would like to update you that I have resubmitted my expense reimbursement as requested. The details are as below : " +
            "\n\nReason for reimbursement : " +
            updatedData.purpose_of_expenditure +
            "\nExpense Date : " +
            moment(updatedData.date_of_expense).format("DD-MM-YYYY") +
            "\nAmount : ₹ " +
            updatedData.paid_amount +
            "\n\nPlease find the attached expense invoice for your reference.\n\nI hope you would consider my request.\n\nThanks,\n" +
            updatedData.name;

          sendResubmitReimburseEmail(
            subject,
            msgBody,
            req.body.filename,
            req.body.invoice
          );

          return res.status(200).json({
            status: true,
            code: 200,
            message: "Your request updated successfully.",
          });
        } else {
          return res.status(404).json({
            status: false,
            code: 404,
            message: "Request with the specified ID does not exist!!",
          });
        }
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

//update status of initial requests from HR panel
const updateStatusByHR = async (req, res) => {
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
      const { transaction_id, status } = req.body;
      var subject, msgBody, userEmail;
      var currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");
      req.body.last_updated_date = currentDate;
      req.body.hr_approved_date = currentDate;

      var request = await models.reimburseTransactions.findOne({
        where: { transaction_id },
      });

      if (request) {
        await models.reimburseTransactions.update(req.body, {
          where: {
            transaction_id,
          },
        });

        var transaction = await models.reimburseTransactions.findOne({
          where: { transaction_id },
          attributes: {
            include: [
              [sequelize.col("user.name"), "name"],
              [sequelize.col("user.email"), "email"],
              [sequelize.col("user.emp_code"), "emp_code"],
              [sequelize.col("user.dept_name"), "dept_name"],
              [sequelize.col("paymentModes.name"), "paymentMode"],
            ],
          },
          include: [
            {
              model: models.dropdownValues,
              as: "paymentModes",
              required: true,
              attributes: [],
            },
            {
              model: models.users,
              as: "user",
              required: true,
              attributes: [],
            },
          ],
        });

        var transactionDetails = transaction.dataValues;
        if (status === "Approved") {
          var filename = path.basename(transactionDetails.invoice);
          var attachment = transactionDetails.invoice;
          subject = "Status of the Reimbursement Request";
          msgBody =
            "Dear " +
            transactionDetails.name +
            "," +
            "\n\nPlease know that we have verified the expense detail(s) and bill(s) submitted along with it for the expense reimbursement. Your request for reimbursement for the " +
            transactionDetails.purpose_of_expenditure +
            " incurred on " +
            moment(
              new Date(transactionDetails.date_of_expense)
                .toISOString()
                .split("T")[0]
            ).format("DD-MM-YYYY") +
            "  is in progress and we will keep you posted on it.\n\nThanks,\nTeam HR";

          userEmail = transactionDetails.email;

          sendReimburseEmailToAdmin(
            transactionDetails.purpose_of_expenditure,
            transactionDetails.date_of_expense,
            transactionDetails.paid_amount,
            filename,
            attachment
          );
        } else if (status === "Rejected") {
          subject = "Status of the Reimbursement Request";

          msgBody =
            "Dear " +
            transactionDetails.name +
            "," +
            "\n\nWe regret to inform you that we are unable to process your reimbursement request because " +
            transactionDetails.hr_reason_reject +
            ".\n\nRegards,\nTeam HR";

          userEmail = transactionDetails.email;
        } else if (status === "On Hold") {
          subject = "Status of the Reimbursement Request";

          msgBody =
            "Dear " +
            transactionDetails.name +
            "," +
            "\n\nThis is to inform you that your reimbursement request is put on hold due to below mentioned reason.\n\nReason : " +
            transactionDetails.hr_reason_onhold +
            "\n\nKindly resubmit the request with the necessary details.\n\nRegards,\nTeam HR";

          userEmail = transactionDetails.email;
        }
        sendAdminReimburseEmail(subject, msgBody, userEmail);
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Reimbursement status updated succesfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message:
            "Reimbursement request with the specified ID does not exist!!",
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

//update status of approved requests from admin panel
const updateStatusByAdmin = async (req, res) => {
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
      const { transaction_id, final_status } = req.body;
      var subject, msgBody, userEmail;
      var currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");
      req.body.last_updated_date = currentDate;
      req.body.admin_approved_date = currentDate;

      var request = await models.reimburseTransactions.findOne({
        where: { transaction_id },
      });

      if (request) {
        await models.reimburseTransactions.update(req.body, {
          where: {
            transaction_id,
          },
        });

        var transaction = await models.reimburseTransactions.findOne({
          where: { transaction_id },
          attributes: {
            include: [
              [sequelize.col("user.name"), "name"],
              [sequelize.col("user.email"), "email"],
              [sequelize.col("user.emp_code"), "emp_code"],
              [sequelize.col("user.dept_name"), "dept_name"],
              [sequelize.col("paymentModes.name"), "paymentMode"],
            ],
          },
          include: [
            {
              model: models.dropdownValues,
              as: "paymentModes",
              required: true,
              attributes: [],
            },
            {
              model: models.users,
              as: "user",
              required: true,
              attributes: [],
            },
          ],
        });

        var transactionDetails = transaction.dataValues;
        // if (final_status == "Approved") {
        //   subject = "Reimbursement Request has been Approved";

        //   msgBody =
        //     "Dear HR,\n\nPlease know that " +
        //     transactionDetails.admin_approved_by +
        //     " have approved the expense detail(s) and bill(s) submitted along with it for the expense reimbursement of " +
        //     transactionDetails.name +
        //     " worth ₹ " +
        //     transactionDetails.paid_amount +
        //     ".\n\nRegards,\n" +
        //     transaction.admin_approved_by;

        //   userEmail = "internal.hr@inferenz.ai";
        // }
        if (final_status == "Rejected") {
          subject = "Status of the Reimbursement Request";
          msgBody =
            "Dear " +
            transactionDetails.name +
            "," +
            "\n\nWe regret to inform you that we are unable to process your reimbursement request because " +
            transactionDetails.admin_reason_reject +
            ".\n\nThanks,\n" +
            transactionDetails.admin_approved_by;

          userEmail = transactionDetails.email;
        } else if (final_status == "Payment Done") {
          var subjectForHr = "Reimbursement Request has been Approved";

          var msgBodyForHr =
            "Dear HR,\n\nPlease know that " +
            transactionDetails.admin_approved_by +
            " have approved the expense detail(s) and bill(s) submitted along with it for the expense reimbursement of " +
            transactionDetails.name +
            " worth ₹ " +
            transactionDetails.paid_amount +
            ".\n\nRegards,\n" +
            transaction.admin_approved_by;

          var hrEmail = "internal.hr@inferenz.ai";
          sendAdminReimburseEmail(subjectForHr, msgBodyForHr, hrEmail);

          subject = "Payment has been made for your Reimbursement Request";

          msgBody =
            "Dear " +
            transactionDetails.name +
            "," +
            "\n\nPlease know that your expense reimbursement request has been processed for " +
            transactionDetails.purpose_of_expenditure +
            " and payment of ₹ " +
            transactionDetails.paid_amount +
            " has been made towards it. It will be credited to your account within 3 to 4 working days. Once you receive it, you are requested to confirm at your end.\n\nThanks,\n" +
            transactionDetails.admin_approved_by;

          userEmail = transactionDetails.email;
        } else if (final_status == "On Hold") {
          subject = "Status of the Reimbursement Request";

          msgBody =
            "Dear " +
            transactionDetails.name +
            "," +
            "\n\nThis is to inform you that your reimbursement request is put on hold due to below mentioned reason.\n\nReason : " +
            transactionDetails.admin_reason_onhold +
            "\n\nKindly resubmit the request with the necessary details.\n\nThanks,\n" +
            transactionDetails.admin_approved_by;

          userEmail = transactionDetails.email;
          sendHRReimburseEmail(
            transactionDetails.name,
            transactionDetails.admin_reason_onhold,
            transactionDetails.admin_approved_by
          );
        }
        sendAdminReimburseEmail(subject, msgBody, userEmail);

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Reimbursement status updated succesfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message:
            "Reimbursement request with the specified ID does not exist!!",
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

//update status of bulk approved requests from admin panel
const updateBulkRequestsByAdmin = async (req, res) => {
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
      const { transactionIDs } = req.body;
      var subject, msgBody, userEmail;
      var currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");
      req.body.final_status = "Payment Done";
      req.body.last_updated_date = currentDate;
      req.body.admin_approved_date = currentDate;

      // It will loop all the transactionIDs
      for (let i = 0; i < transactionIDs.length; i++) {
        // It will update particular transaction status
        await models.reimburseTransactions.update(req.body, {
          where: {
            transaction_id: transactionIDs[i],
          },
        });

        // It will find user & payment mode related details associated with transaction
        var transaction = await models.reimburseTransactions.findOne({
          where: { transaction_id: transactionIDs[i] },
          attributes: {
            include: [
              [sequelize.col("user.name"), "name"],
              [sequelize.col("user.email"), "email"],
              [sequelize.col("user.emp_code"), "emp_code"],
              [sequelize.col("user.dept_name"), "dept_name"],
              [sequelize.col("paymentModes.name"), "paymentMode"],
            ],
          },
          include: [
            {
              model: models.dropdownValues,
              as: "paymentModes",
              required: true,
              attributes: [],
            },
            {
              model: models.users,
              as: "user",
              required: true,
              attributes: [],
            },
          ],
        });

        var transactionDetails = transaction.dataValues;

        // It will trigger email to particular candidate & HR to give a confirmation regarding payment done of their reimbursement request
        // HR Email Template
        var subjectForHr = "Reimbursement Request has been Approved";

        var msgBodyForHr =
          "Dear HR,\n\nPlease know that " +
          transactionDetails.admin_approved_by +
          " have approved the expense detail(s) and bill(s) submitted along with it for the expense reimbursement of " +
          transactionDetails.name +
          " worth ₹ " +
          transactionDetails.paid_amount +
          ".\n\nRegards,\n" +
          transaction.admin_approved_by;

        var hrMailOptions = {
          from: "hr@inferenz.ai",
          to: "internal.hr@inferenz.ai",
          cc: "internal.hr@inferenz.ai",
          subject: subjectForHr,
          text: msgBodyForHr,
        };

        mailTransporter.sendMail(hrMailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("HR Email Sent: " + info.response);
          }
        });

        // Candidate Email Template
        subject = "Payment has been made for your Reimbursement Request";

        msgBody =
          "Dear " +
          transactionDetails.name +
          "," +
          "\n\nPlease know that your expense reimbursement request has been processed for " +
          transactionDetails.purpose_of_expenditure +
          " and payment of ₹ " +
          transactionDetails.paid_amount +
          " has been made towards it. It will be credited to your account within 3 to 4 working days. Once you receive it, you are requested to confirm at your end.\n\nThanks,\n" +
          transactionDetails.admin_approved_by;

        userEmail = transactionDetails.email;

        var candidateMailOptions = {
          from: "hr@inferenz.ai",
          to: userEmail,
          cc: "internal.hr@inferenz.ai",
          subject: subject,
          text: msgBody,
        };

        mailTransporter.sendMail(candidateMailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Candidate Email Sent: " + info.response);
          }
        });

        if (i + 1 == transactionIDs.length) {
          return res.status(200).json({
            status: true,
            code: 200,
            message: "Bulk reimbursement status updated succesfully.",
          });
        }
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

// to delete request
const deleteRequest = async (req, res) => {
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
      const { transaction_id } = req.query;

      var transactionDetails = await models.reimburseTransactions.findOne({
        where: { transaction_id },
      });

      if (transactionDetails) {
        await models.reimburseTransactions.update(
          { visible: false },
          {
            where: {
              transaction_id,
            },
          }
        );

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Reimbursement request deleted successfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Reimbursest request with the specified ID does not exist!!",
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

module.exports = {
  addNewRequest,
  getRequestById,
  getMyReimbursements,
  getApprovedRequests,
  getRejectedRequests,
  getAllRequests,
  updateRequest,
  updateStatusByHR,
  updateStatusByAdmin,
  updateBulkRequestsByAdmin,
  deleteRequest,
};
