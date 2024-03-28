require("dotenv").config();
const { CDN_URL, REGION, PROFILE, BUCKET, SECRET_KEY } = process.env;
const models = require("../../../shared/models");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(SECRET_KEY);
const { validationResult } = require("express-validator");
var nodemailer = require("nodemailer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
var mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");
const regEx = /[`!@#$%^&*()+\-=\[\{};':"\\|,<>\/?~]/g;

const s3Client = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
});

function sendEmailToHR(
  subject,
  msgBody,
  email,
  name,
  designation,
  fileName,
  attachment
) {
  var mailList = ["internal.hr@inferenz.ai"];
  // var mailList = ["honey.joshi@inferenz.ai"];
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
    cc: "hr@inferenz.ai",
    subject: subject,
    text: msgBody,
    attachments: [{ filename: fileName, path: attachment }],
  };

  var mailOptions1 = {
    from: "hr@inferenz.ai",
    to: email,
    cc: "hr@inferenz.ai",
    subject: "Thanks for Referring your buddy!",
    text:
      "Dear " +
      name +
      "\n\nWe would like to express our gratitude for your referral of a candidate for the " +
      designation +
      ". Your contribution is greatly appreciated, as referrals are one of our most reliable sources of acquiring new talent. We will keep you informed regarding the status of your referred candidate.\n\nThank you again for your valuable contribution.\n\nRegards,\nTeam HR",
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
          console.log("Referral acknowledgement: " + info.response);
        }
      });
    }
  });
}

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

// It will enter Referral details into the database.
const addReferralRequest = async (req, res) => {
  try {
    req.body = modifyRequestBody(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      let userID = uuidv4();
      var today = new Date();
      const currentDate = new Date()
        .toISOString()
        .slice(0, 23)
        .replace("T", " ");

      var s3data, data, historyData;

      const url = req.file;
      var mimeType = mime.lookup("./src/uploads/resumes/" + url.filename);
      const bucketParams = {
        Bucket: BUCKET,
        Key:
          "Intranet/Resumes/" +
          url.filename.replace(/ /g, "_").replace(regEx, ""),
        Body: fs.readFileSync("./src/uploads/resumes/" + url.filename),
        ContentDisposition: "inline",
        ContentType: mimeType,
      };
      s3data = await s3Client
        .send(new PutObjectCommand(bucketParams))
        .catch((err) => {
          console.log(err);
        });
      fs.unlink("./src/uploads/resumes/" + url.filename, function (err) {
        if (err) return console.log(err);
      });

      console.log(
        s3data,
        "Successfully uploaded object at : " + CDN_URL + bucketParams.Key
      );

      setTimeout(async () => {
        data = {
          uuid: userID,
          candidate_name: req.body.candidate_name,
          email: req.body.email,
          contact: req.body.contact,
          resume_source: "Referral",
          designation: req.body.designation,
          relevant_it_experience: req.body.relevant_it_experience,
          current_ctc: cryptr.encrypt(""),
          expected_ctc: cryptr.encrypt(""),
          negotiated_ctc: cryptr.encrypt(""),
          current_organisation: "",
          current_location: "",
          permanent_place: "",
          notice_period: "",
          reason_for_job_change: "",
          candidate_linkedin: req.body.candidate_linkedin,
          status_hr: "Pending",
          interview_round: "Applied",
          final_status: "Pending",
          offered_salary: cryptr.encrypt(""),
          offered_bonus: cryptr.encrypt(""),
          final_remarks: cryptr.encrypt(""),
          applied_date: currentDate,
          applied_month: today.getMonth() + 1,
          candidate_resume:
            s3data != undefined
              ? CDN_URL + bucketParams.Key
              : req.file.filename,
          referred_by: req.body.referred_by,
          referral_email: req.body.referral_email,
          visible: true,
        };

        historyData = {
          email: req.body.email,
          candidate_name: data.candidate_name,
          interview_round: "Round 1",
          remarks_hr: null,
          interviewer_name: null,
          interview_date: null,
          interview_time: null,
          interview_feedback: null,
          eligible_for_next_round: null,
          applied_date: currentDate,
        };

        await models.interviewerCandidate.create(data);
        await models.interviewHistory.create(historyData);

        var subject = "Refer a buddy at Inferenz";

        var msgBody =
          "\nDear HR Team,\n\nI’d like to refer a buddy at Inferenz. Please find the required details below:\n\nBuddy Name: " +
          data.candidate_name +
          "\nPosition: " +
          data.designation +
          "\nTotal Experience: " +
          data.relevant_it_experience +
          "\nEmail Id: " +
          data.email +
          "\nContact No: " +
          "+" +
          data.contact +
          "\nReferred By: " +
          data.referred_by +
          "\n\n\nRegards,\n" +
          data.referred_by;
        sendEmailToHR(
          subject,
          msgBody,
          data.referral_email,
          data.referred_by,
          data.designation,
          url.filename,
          data.candidate_resume
        );
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Your request submitted successfully.",
        });
      }, 2000);
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

// It will fetch all the referrals of current user.
const getMyReferrals = async (req, res) => {
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

      var user = await models.users.findOne({
        where: { uuid },
      });

      if (user) {
        const referrals = await models.interviewerCandidate.findAll({
          attributes: [
            "referred_by",
            "candidate_name",
            "designation",
            "relevant_it_experience",
            "applied_date",
            ["status_hr", "application_status"],
          ],
          where: {
            referral_email: user.email,
            visible: true,
          },
          order: [["id", "DESC"]],
        });

        if (referrals.length > 0) {
          for (let i = 0; i < referrals.length; i++) {
            referrals[i] = { serialNumber: i + 1, ...referrals[i].dataValues };
            if (
              referrals[i].application_status == "Pending" ||
              referrals[i].application_status == "Email Sent"
            ) {
              referrals[i].application_status = "In Progress";
            } else if (
              referrals[i].application_status == "Rejected" ||
              referrals[i].application_status == "Irrelevant Profile" ||
              referrals[i].application_status == "Location Not Matched" ||
              referrals[i].application_status == "Salary Expectation High" ||
              referrals[i].application_status == "Not Appeared" ||
              referrals[i].application_status == "Declined Offer" ||
              referrals[i].application_status == "Not Responded"
            ) {
              referrals[i].application_status = "Rejected";
            }
          }
          return res.status(200).json({
            status: true,
            code: 200,
            totalReferrals: referrals.length,
            data: referrals,
          });
        } else {
          return res.status(404).json({
            status: false,
            code: 404,
            message: "You have not made any referrals yet!!",
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

module.exports = {
  addReferralRequest,
  getMyReferrals,
};
