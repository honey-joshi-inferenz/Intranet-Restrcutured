require("dotenv").config();
const { CDN_URL, REGION, PROFILE, BUCKET, SECRET_KEY } = process.env;
const models = require("../../../shared/models");
const { sequelize } = require("../../../../config/dbConfig");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(SECRET_KEY);
const { validationResult } = require("express-validator");
const { connection_hrms } = require("../../../../config/dbConfig");
var nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const https = require("https");
var mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");
const regEx = /[`!@#$%^&*()+\-=\[\{};':"\\|,<>\/?~]/g;
const AdmZip = require("adm-zip");

const s3Client = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
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

// It will fetch the data from  webhook and insert it into the database.
const saveFormData = async (req, res) => {
  try {
    // console.log(req.body, "----Careerpage FormData");
    let userID = uuidv4();
    var today = new Date();
    const currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");

    const url = req.body["file-upload"][0];

    const filename = path.basename(url);

    var s3data, bucketParams, data, historyData;
    const request = https.get(url, function (response) {
      const fileStream = fs.createWriteStream(`uploads/resumes/${filename}`);
      response.pipe(fileStream);

      var mimeType = mime.lookup("./src/uploads/resumes/" + filename);
      fileStream.on("error", function (error) {
        console.log(error, "error");
      });
      fileStream.on("finish", async function () {
        fileStream.close();
        bucketParams = {
          Bucket: BUCKET,
          Key:
            "Intranet/Resumes/" +
            filename.replace(/ /g, "_").replace(regEx, ""),
          Body: fs.readFileSync("./src/uploads/resumes/" + filename),
          ContentDisposition: "inline",
          ContentType: mimeType,
        };
        s3data = await s3Client
          .send(new PutObjectCommand(bucketParams))
          .catch((err) => {
            console.log(err);
          });
        fs.unlink("./src/uploads/resumes/" + filename, function (err) {
          if (err) return console.log(err);
        });
        console.log(s3data, "uploaded in bucket");
      });
    });
    request.on("error", function (error) {
      console.log(error, "error");
    });

    setTimeout(async () => {
      data = {
        uuid: userID,
        email: req.body.email,
        candidate_name:
          req.body.names.first_name + " " + req.body.names.last_name,
        contact: req.body.phone,
        resume_source: "Career Page",
        designation: req.body.dropdown,
        relevant_it_experience: req.body.input_text,
        current_ctc: cryptr.encrypt(""),
        expected_ctc: cryptr.encrypt(""),
        negotiated_ctc: cryptr.encrypt(""),
        current_organisation: req.body.input_text_1,
        current_location: req.body.input_text_3,
        permanent_place: req.body.input_text_6,
        notice_period: req.body.input_text_2,
        reason_for_job_change: req.body.input_text_5,
        candidate_linkedin: req.body.input_text_4,
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
            : req.body["file-upload"][0],
        visible: true,
      };

      historyData = {
        email: data.email,
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

      return res.status(200).json({
        status: true,
        code: 200,
        message: "Candidate added successfully.",
      });
    }, 2000);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will enter candidate details manually it into the database.
const addCandidateProfile = async (req, res) => {
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
          email: req.body.email,
          candidate_name: req.body.candidate_name,
          contact: req.body.contact,
          resume_source: req.body.resume_source,
          designation: req.body.designation,
          relevant_it_experience: req.body.relevant_it_experience,
          current_ctc: cryptr.encrypt(""),
          expected_ctc: cryptr.encrypt(""),
          negotiated_ctc: cryptr.encrypt(""),
          current_organisation: req.body.current_organisation,
          current_location: req.body.current_location,
          permanent_place: req.body.permanent_place,
          notice_period: req.body.notice_period,
          reason_for_job_change: req.body.reason_for_job_change,
          candidate_linkedin: req.body.candidate_linkedin,
          status_hr: "Pending",
          interview_round: "Manual Applied",
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
          visible: true,
        };
        historyData = {
          email: data.email,
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

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Candidate added successfully.",
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

// It will read zip file and upload resumes to s3 bucket and append resume links inside .xlsx file and upload those details in database.
const uploadBulkCandidates = async (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");

  // Read ZIP File
  const zip = new AdmZip(req.file.buffer);
  const zipEntries = zip.getEntries();

  let resumesFolder = null;
  let resumeLinks = [];

  zipEntries.forEach(function (zipEntry) {
    if (zipEntry.isDirectory && zipEntry.entryName.includes("/")) {
      const folderContents = zipEntries.filter((entry) =>
        entry.entryName.startsWith(zipEntry.entryName)
      );
      const resumeFiles = folderContents.filter((entry) => !entry.isDirectory);

      if (resumeFiles.length > 0) {
        resumesFolder = zipEntry.entryName;
      }
    }
  });

  if (resumesFolder) {
    for (const zipEntry of zipEntries) {
      if (
        !zipEntry.isDirectory &&
        zipEntry.entryName.startsWith(resumesFolder)
      ) {
        const email = zipEntry.entryName.split("/")[2].replace(/\.[^.]+$/, "");
        const resumeFileName = zipEntry.entryName.replace(resumesFolder, "");

        // Upload resume to S3 bucket
        const mimeType = mime.lookup(resumeFileName);
        const bucketParams = {
          Bucket: BUCKET,
          Key:
            "Intranet/Resumes/" +
            resumeFileName.replace(/ /g, "_").replace(regEx, ""),
          Body: zipEntry.getData(),
          ContentDisposition: "inline",
          ContentType: mimeType,
        };

        try {
          await s3Client.send(new PutObjectCommand(bucketParams));
          const resumeLink = CDN_URL + bucketParams.Key;
          resumeLinks.push({ email, resumeLink });
        } catch (err) {
          console.error(`Error uploading resume for ${email}: ${err}`);
        }
      }
    }
  } else {
    console.log("No resumes folder found.");
  }

  console.log("Email-resume links:", resumeLinks);

  // Find and read the .xlsx file
  const xlsxEntry = zipEntries.find((entry) =>
    entry.entryName.endsWith(".xlsx")
  );
  if (xlsxEntry) {
    // Read .xlsx file using readXlsxFile directly from buffer
    const workbook = await readXlsxFile(xlsxEntry.getData());

    // Update .xlsx file with resume links
    for (let i = 1; i < workbook.length; i++) {
      // Start from index 1 to skip the header row
      const email = workbook[i][0]; // Email is in the 1st column inside .xlsx file
      const resumeObject = resumeLinks.find((obj) => {
        return obj.email === email;
      });
      if (resumeObject) {
        workbook[i][12] = resumeObject.resumeLink; // Update the 13th column which is Resume Link
      }
    }

    // Add Records In Database
    for (var i = 1; i < workbook.length; i++) {
      const data = {
        uuid: uuidv4(),
        candidate_name: workbook[i][1],
        email: workbook[i][0],
        contact: workbook[i][2],
        resume_source: workbook[i][11],
        designation: workbook[i][3],
        relevant_it_experience: workbook[i][4],
        current_organisation: workbook[i][5],
        current_location: workbook[i][6],
        permanent_place: workbook[i][7],
        notice_period: workbook[i][8],
        reason_for_job_change: workbook[i][9],
        candidate_linkedin: workbook[i][10],
        candidate_resume: workbook[i][12],
        current_ctc: cryptr.encrypt(""),
        expected_ctc: cryptr.encrypt(""),
        negotiated_ctc: cryptr.encrypt(""),
        status_hr: "Pending",
        interview_round: "Manual Applied",
        final_status: "Pending",
        offered_salary: cryptr.encrypt(""),
        offered_bonus: cryptr.encrypt(""),
        final_remarks: cryptr.encrypt(""),
        applied_date: currentDate,
        applied_month: new Date().getMonth() + 1,
        visible: true,
      };

      const historyData = {
        email: data.email,
        candidate_name: data.candidate_name,
        interview_round: "Round 1",
        remarks_hr: null,
        interviewer_name: null,
        interview_date: null,
        interview_time: null,
        interview_feedback: null,
        eligible_for_next_round: null,
        applied_date: data.applied_date,
      };

      await models.interviewerCandidate.create(data);
      await models.interviewHistory.create(historyData);

      if (parseInt(i) + 1 === workbook.length) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Candidates profile imported successfully.",
        });
      }
    }
  } else {
    console.log("No .xlsx file found in the zip.");
  }
};

//It will import the file of candidate details into the database.
const importCandidateFile = (req, res) => {
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
      readXlsxFile("./src/uploads/" + req.fileName).then((rows) => {
        for (var i = 1; i < rows.length; i++) {
          const bodyData = {
            uuid: uuidv4(),
            candidate_name: rows[i][0],
            email: rows[i][1],
            contact: rows[i][2],
            resume_source: rows[i][3],
            designation: rows[i][4],
            relevant_it_experience: rows[i][5],
            current_organisation: rows[i][6],
            current_location: rows[i][7],
            permanent_place: rows[i][8],
            notice_period: rows[i][9],
            reason_for_job_change: rows[i][10],
            candidate_linkedin: rows[i][11],
            candidate_resume: rows[i][12],
            current_ctc: cryptr.encrypt(""),
            expected_ctc: cryptr.encrypt(""),
            negotiated_ctc: cryptr.encrypt(""),
            status_hr: "Pending",
            interview_round: "Manual Applied",
            final_status: "Pending",
            offered_salary: cryptr.encrypt(""),
            offered_bonus: cryptr.encrypt(""),
            final_remarks: cryptr.encrypt(""),
            applied_date: new Date(),
            applied_month: new Date().getMonth() + 1,
            visible: true,
          };

          const form1Data = {
            email: bodyData.email,
            candidate_name: bodyData.candidate_name,
            interview_round: "Round 1",
            remarks_hr: null,
            interviewer_name: null,
            interview_date: null,
            interview_time: null,
            interview_feedback: null,
            eligible_for_next_round: null,
            applied_date: new Date(),
          };

          var sqlquery = "INSERT INTO interviewer_candidate SET ?";
          connection_hrms.query(sqlquery, bodyData, function (err, data) {
            if (err) {
              console.log(err);
              return res.status(400).json({
                status: false,
                code: 400,
                message: "Data entry failed!!",
              });
            }
          });

          if (parseInt(i) + 1 === rows.length) {
            fs.unlink("./src/uploads/" + req.fileName, function (err) {
              if (err) return console.log(err);
              var sqlquery = "INSERT INTO interview_history SET ?";
              connection_hrms.query(sqlquery, form1Data, function (err) {
                if (err) {
                  console.log(err);
                  return res.status(400).json({
                    status: false,
                    code: 400,
                    message: "Data entry failed!!",
                  });
                } else {
                  return res.status(200).json({
                    status: true,
                    code: 200,
                    message: "File imported successfully.",
                  });
                }
              });
            });
          }
        }
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

function sendEmail(subject, msgBody, attachment, rescheduleInterview) {
  var mailList = ["internal.hr@inferenz.ai"];

  // var mailList = [
  //     'sumit.jamnani@inferenz.ai',
  //     'honey.joshi@inferenz.ai',
  // ];

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

  var mailOptions = {};
  if (rescheduleInterview == true) {
    mailOptions = {
      from: "hr@inferenz.ai",
      to: mailList,
      cc: "hr@inferenz.ai",
      subject: subject,
      text: msgBody,
    };
  } else {
    if (attachment != undefined) {
      mailOptions = {
        from: "hr@inferenz.ai",
        to: mailList,
        cc: "hr@inferenz.ai",
        subject: subject,
        text: msgBody,
        attachments: [
          { filename: attachment, path: "./src/uploads/resumes/" + attachment },
        ],
      };
    } else {
      mailOptions = {
        from: "hr@inferenz.ai",
        to: mailList,
        cc: "hr@inferenz.ai",
        subject: subject,
        text: msgBody,
      };
    }
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      if (rescheduleInterview == true) {
        console.log("Reschedule Interview Email Sent: " + info.response);
      } else {
        if (attachment != undefined) {
          fs.unlink("./src/uploads/resumes/" + attachment, function (err) {
            if (err) return console.log(err);
            console.log("Interview Feedback Email Sent: " + info.response);
          });
        } else {
          console.log("Interview Feedback Email Sent: " + info.response);
        }
      }
    }
  });
}

function sendEmailHRMS(
  receiverEmail,
  subject,
  msgBody,
  finalStatus,
  candidateName
) {
  var mailList = ["internal.hr@inferenz.ai", "hr@inferenz.ai"];
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
    to: receiverEmail,
    cc: mailList,
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

  if (finalStatus == "Hired") {
    var subjectWelcome = "Congratulations on your new role!";
    var msgBodyWelcome =
      "Hello, " +
      candidateName +
      ",\n\nGreetings of the day...!!! \n\nWe are excited to have you aboard at Inferenz. We look forward to seeing you  when you begin your new role. Generally, our work schedule is flexible, but our hours of operation are from 10 a.m. to 7:30 p.m., Monday to Friday. All the joining formalities will be conducted by the HR team on the joining day so please bring all the documents which we have discussed earlier. \n\nCongratulations on your new role!";

    var mailOptions1 = {
      from: "hr@inferenz.ai",
      to: receiverEmail,
      subject: subjectWelcome,
      text: msgBodyWelcome,
    };

    transporter.sendMail(mailOptions1, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

function sendHiredEmail(sendTo, subject, body) {
  var transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false,

    auth: {
      user: "hr@inferenz.ai",
      pass: "rxsctfysbcqbpyjc",
    },
  });
  var empMailOpt = {
    from: "hr@inferenz.ai",
    to: sendTo,
    cc: "internal.hr@inferenz.ai",
    subject,
    text: body,
  };

  transporter.sendMail(empMailOpt, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Hired Email Sent To Employee: " + info.response);
    }
  });
}

function sendRejectionEmail(
  candidateName,
  receiverName,
  receiverEmail,
  msgBody
) {
  var mailList = ["internal.hr@inferenz.ai"];
  // var mailList = ['honey.joshi@inferenz.ai', 'sumit.jamnani@inferenz.ai']
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
    to: receiverEmail,
    cc: mailList,
    subject: "Status of the Referral Application at Inferenz",
    text:
      "Dear " +
      receiverName +
      ",\n\nI hope this email finds you well. I wanted to reach out to you and provide an update regarding " +
      candidateName +
      " you referred to us for the open position at our company.\n\nAfter careful consideration and thorough evaluation, we have unfortunately decided not to move forward with the candidate at this time because " +
      msgBody +
      ".\n\nWe appreciate your support and are grateful for your assistance in our search for new talent. While this particular candidate may not have been the right fit for us, we would be happy to consider any other recommendations you may have in the future.\n\nThank you again for your help, and please don't hesitate to reach out if you have any questions or concerns.\n\nRegards,\nTeam HR",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Rejection Email sent: " + info.response);
    }
  });
}

// It will fetch the data of particular candidate based on ID.
const getCandidateById = async (req, res) => {
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

      const query = `SELECT *,CASE WHEN resume_source is null AND referred_by is null THEN 
      'Not Mentioned' WHEN resume_source is not null THEN resume_source  WHEN 
      referred_by is not null THEN 'Referral' END AS resume_source FROM 
      interviewer_candidate WHERE uuid = :uuid`;

      const candidate = await sequelize.query(query, {
        replacements: { uuid: uuid },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      });

      if (candidate.length > 0) {
        var candidateData = candidate[0];
        candidateData.current_ctc = cryptr.decrypt(candidateData.current_ctc);
        candidateData.expected_ctc = cryptr.decrypt(candidateData.expected_ctc);
        candidateData.negotiated_ctc = cryptr.decrypt(
          candidateData.negotiated_ctc
        );
        candidateData.offered_salary = cryptr.decrypt(
          candidateData.offered_salary
        );
        candidateData.offered_bonus = cryptr.decrypt(
          candidateData.offered_bonus
        );
        candidateData.final_remarks = cryptr.decrypt(
          candidateData.final_remarks
        );

        const historyQuery = `SELECT *, CASE WHEN interviewer_name is null THEN 
        'Not Assigned' WHEN interviewer_name is not null THEN (SELECT name from users WHERE 
        email = interviewer_name AND role='Interviewer') END AS interviewer_name FROM 
        interview_history WHERE email = :email AND applied_date = :applied_date AND 
        interview_round in('Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5')`;

        const history = await sequelize.query(historyQuery, {
          replacements: {
            email: candidateData.email,
            applied_date: candidateData.applied_date,
          },
          type: sequelize.QueryTypes.SELECT,
        });
        var interviewer_history = [];

        if (history.length > 0) {
          for (let i = 0; i < history.length; i++) {
            if (history[i].interview_feedback) {
              interviewer_history[i] = {
                serialNumber: i + 1,
                ...history[i],
              };
            }
            history[i] = {
              serialNumber: i + 1,
              ...history[i],
            };
          }

          return res.status(200).json({
            status: true,
            code: 200,
            currentRoundData: candidate,
            historyData: {
              history,
              interviewer_history,
              modified_by: candidateData.modified_by,
              modified_date: candidateData.modified_date,
            },
          });
        } else {
          return res.status(200).json({
            status: false,
            code: 200,
            currentRoundData: candidate,
            historyData: {
              modified_by: candidateData.modified_by,
              modified_date: candidateData.modified_date,
            },
            message: "Interview Not Scheduled Yet!!",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Candidate profile does not exist!!",
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

// It will fetch active candidates profile.
const getActiveCandidates = async (req, res) => {
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

// It will fetch soft deleted candidates profile.
const getInActiveCandidates = async (req, res) => {
  try {
    const query = `SELECT id, uuid, candidate_name, email, contact, designation, 
          relevant_it_experience, applied_date, interview_round, status_hr, final_status, 
          CASE WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name 
          is not null THEN (SELECT name from users where email = interviewer_name AND 
          role='Interviewer') END AS interviewer_name, owner_name,CASE WHEN referred_by 
          is null THEN 'NA' WHEN referred_by is not null THEN referred_by END AS 
          referred_by,CASE WHEN resume_source is null AND referred_by is null THEN 
          'Not Mentioned' WHEN resume_source is not null THEN resume_source  WHEN 
          referred_by is not null THEN 'Referral' END AS resume_source FROM 
          interviewer_candidate WHERE visible = false ORDER BY id DESC`;

    const candidates = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (candidates.length > 0) {
      for (let i = 0; i < candidates.length; i++) {
        candidates[i] = { serialNumber: i + 1, ...candidates[i] };
      }
      return res.status(200).json({
        status: true,
        code: 200,
        totalCandidates: candidates.length,
        data: candidates,
      });
    } else {
      return res.status(404).json({
        status: false,
        code: 404,
        totalUsers: users.length,
        message: "Inactive candidates does not exist!!",
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

// It will update the form data by round wise.
const updateCandidateProfile = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().slice(0, 23).replace("T", " ");
    req.body = modifyRequestBody(req.body);

    var s3data;
    const resumeFile = req.files.candidate_resume
      ? req.files.candidate_resume[0]
      : null;

    if (resumeFile) {
      var mimeType = mime.lookup(
        "./src/uploads/resumes/" + resumeFile.originalname
      );
      const bucketParams = {
        Bucket: BUCKET,
        Key:
          "Intranet/Resumes/" +
          resumeFile.originalname.replace(/ /g, "_").replace(regEx, ""),
        Body: fs.readFileSync(
          "./src/uploads/resumes/" + resumeFile.originalname
        ),
        ContentDisposition: "inline",
        ContentType: mimeType,
      };
      s3data = await s3Client
        .send(new PutObjectCommand(bucketParams))
        .catch((err) => {
          console.log(err);
        });
      fs.unlink(
        "./src/uploads/resumes/" + resumeFile.originalname,
        function (err) {
          if (err) return console.log(err);
        }
      );

      console.log(
        s3data,
        "Successfully uploaded object at : " + CDN_URL + bucketParams.Key
      );

      req.body.candidate_resume = CDN_URL + bucketParams.Key;
    }

    req.body.interview_softSkills =
      req.body.interview_softSkills !== undefined
        ? JSON.parse(req.body.interview_softSkills)
        : typeof req.body.interview_softSkills === "string" &&
          req.body.interview_softSkills.trim() !== "{}"
        ? JSON.parse(req.body.interview_softSkills)
        : {};

    var data = req.body;
    console.log(data);
    const { uuid } = data;

    let historyData = {
      candidate_name: data.candidate_name,
      remarks_hr: data.remarks_hr,
      interviewer_name: data.interviewer_name,
      interview_date: data.interview_date,
      interview_time: data.interview_time,
      interview_feedback: data.interview_feedback,
      interview_softSkills: data.interview_softSkills,
      eligible_for_next_round: data.eligible_for_next_round,
      email: data.email,
      interview_round: data.interview_round,
      applied_date: data.applied_date,
    };

    var candidate = await models.interviewerCandidate.findOne({
      where: { uuid },
    });

    if (candidate) {
      var candidateEmail = candidate.dataValues.email;
      var candidateName = candidate.dataValues.candidate_name;

      var finalStatus = data.final_status;
      var subject = "Status of Your Job Application at Inferenz.";
      var msgBody = "";

      // For Interviewer
      if (
        data.nextRoundEmailStatus == true ||
        data.nextRoundEmailStatus == "1"
      ) {
        const interviewerData = {
          eligible_for_next_round: data.eligible_for_next_round,
          interview_feedback: data.interview_feedback,
          interview_softSkills: data.interview_softSkills,
          email: candidateEmail,
          name: candidateName,
          interview_round: data.interview_round,
          applied_date: candidate.dataValues.applied_date,
        };

        await models.interviewerCandidate.update(interviewerData, {
          where: { uuid },
        });
        await models.interviewHistory.update(interviewerData, {
          where: {
            email: interviewerData.email,
            interview_round: interviewerData.interview_round,
            applied_date: interviewerData.applied_date,
          },
        });

        subject =
          "Interview Feedback of " +
          candidateName +
          " For " +
          data.interview_round +
          ".";
        var eligibleForNextRound = "";
        if (
          data.eligible_for_next_round == true ||
          data.eligible_for_next_round == "true" ||
          data.eligible_for_next_round == 1
        ) {
          eligibleForNextRound = "Yes";
        } else if (
          data.eligible_for_next_round == false ||
          data.eligible_for_next_round == "false" ||
          data.eligible_for_next_round == 0
        ) {
          eligibleForNextRound = "No";
        }
        msgBody =
          "Dear HR, \n\nCandidate Name : " +
          candidateName +
          "\nDesignation : " +
          candidate.dataValues.designation +
          "\nInterview Round : " +
          data.interview_round +
          "\nInterviewer Name : " +
          data.interviewer_name +
          "\nTechnical Feedback : " +
          data.interview_feedback +
          "\nAttitude : " +
          data.interview_softSkills.attitudeFeedback +
          "\nLogical : " +
          data.interview_softSkills.logicalFeedback +
          "\nAnalytical : " +
          data.interview_softSkills.analyticalFeedback +
          "\nConfidence : " +
          data.interview_softSkills.confidenceFeedback +
          "\nCommunication Skills : " +
          data.interview_softSkills.communicationFeedback +
          "\nConsider the candidate for the next round? : " +
          eligibleForNextRound +
          "\n\nThanks & Regards, \n" +
          data.interviewer_name +
          ".";

        sendEmail(subject, msgBody, req.fileName, false);

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Interview feedback submitted successfully.",
        });
      }

      // For HR
      if (
        (finalStatus == "Rejected" ||
          finalStatus == "Irrelevant Profile" ||
          finalStatus == "Location Not Matched" ||
          finalStatus == "Salary Expectation High" ||
          finalStatus == "Not Appeared" ||
          finalStatus == "Declined Offer" ||
          finalStatus == "Not Responded") &&
        (data.sendRejectionEmail == true || data.sendRejectionEmail == "true")
      ) {
        if (data.template_no == 1) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because your skill sets are different from our current requirements.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";
          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 2) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because we have limited budget and your salary expectation is quite high.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";

          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 3) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because " +
            data.other_reason +
            ".\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";

          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 4) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because we've made several attempts to reach out to you, but unfortunately, we haven't received a response.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";
          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 5) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because the positions are filled out for this role.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";
          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 6) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because we are looking for someone who has more experience in this field for our current requirements.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";
          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 7) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because as you got rejected in technical round so you will be eligible after 6 months as per company policy.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";
          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 8) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because we have geographical constraint.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";
          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        } else if (data.template_no == 9) {
          msgBody =
            "Dear " +
            candidateName +
            ",\n\nWe appreciate your interest in our organization. Thanks for applying for the Position : " +
            candidate.dataValues.designation +
            " and sharing the details. We regret to inform you that at the moment, we are unable to proceed with the profile because your expertise is not aligning with our current business requirements.\n\nHowever, we like and respect your profile, and even though this time we are not moving ahead with your profile and we would definitely reach out to you in the future if required. Till then please continue to review our website and apply to any relevant career opportunities for which you would like to be considered.\n\nWish you all the best in your future endeavors.\n\nThanks & Regards,\nTeam HR.";
          sendEmailHRMS(
            candidateEmail,
            subject,
            msgBody,
            finalStatus,
            candidateName
          );
          if (data.referral_email != "null" && data.referral_email != null) {
            sendRejectionEmail(
              candidateName,
              data.referred_by,
              data.referral_email,
              data.employee_update
            );
          }
        }
      }
      // Send Email To Employee When Buddy Got Hired
      else if (
        finalStatus == "Hired" &&
        candidate.dataValues.final_status != "Hired" &&
        candidate.dataValues.referral_email != null
      ) {
        var subject = "Your buddy just got hired!";
        var msgBody =
          "Dear " +
          candidate.dataValues.referred_by +
          "\n\nGreat news! We are delighted to inform you that your referred candidate," +
          candidate.dataValues.candidate_name +
          ", has been successfully hired as a " +
          candidate.dataValues.designation +
          " at Inferenz. Your excellent judgment and ability to identify top talent truly stood out among the many candidates we considered. We are confident that they will make valuable contributions to our team.\n\nWe appreciate your commitment to our organization's success, and we would like to offer you a referral bonus as a token of our gratitude. We hope that this successful hiring experience will encourage you to continue referring talented individuals who can help us achieve our goals.\n\nThank you again for your support, and we look forward to working with both you and the new hire in the future.\n\nRegards,\nTeam HR";

        sendHiredEmail(candidate.dataValues.referral_email, subject, msgBody);
      }

      // Data Formatting
      data.current_ctc = data.current_ctc
        ? cryptr.encrypt(data.current_ctc)
        : candidate.dataValues.current_ctc;
      data.expected_ctc = data.expected_ctc
        ? cryptr.encrypt(data.expected_ctc)
        : candidate.dataValues.expected_ctc;
      data.negotiated_ctc = data.negotiated_ctc
        ? cryptr.encrypt(data.negotiated_ctc)
        : candidate.dataValues.negotiated_ctc;
      data.offered_salary = data.offered_salary
        ? cryptr.encrypt(data.offered_salary)
        : candidate.dataValues.offered_salary;
      data.offered_bonus = data.offered_bonus
        ? cryptr.encrypt(data.offered_bonus)
        : candidate.dataValues.offered_bonus;
      data.final_remarks = data.final_remarks
        ? cryptr.encrypt(data.final_remarks)
        : candidate.dataValues.final_remarks;
      data.modified_date = currentDate;

      await models.interviewerCandidate.update(data, {
        where: { uuid },
      });

      // Interviewer Update
      if (
        data.interview_round == "Round 1" ||
        data.interview_round == "Round 2" ||
        data.interview_round == "Round 3" ||
        data.interview_round == "Round 4" ||
        data.interview_round == "Round 5"
      ) {
        var interviewHistory = await models.interviewHistory.findOne({
          where: {
            email: data.email,
            interview_round: data.interview_round,
            applied_date: data.applied_date,
          },
        });

        if (interviewHistory) {
          await models.interviewHistory.update(historyData, {
            where: { id: interviewHistory.dataValues.id },
          });

          const candidateDetails = await axios.get(
            `http://localhost:5000/candidate/getCandidateById?uuid=` + uuid,
            {
              headers: {
                Authorization: req.header("authorization"),
                "Content-Type": "application/json",
              },
            }
          );

          return res.status(200).json({
            status: true,
            code: 200,
            message: "Candidate profile updated successfully.",
            data: candidateDetails.data,
          });
        } else {
          const historyData = {
            email: data.email,
            candidate_name: data.candidate_name,
            interview_round: data.interview_round,
            remarks_hr: data.remarks_hr,
            interviewer_name: data.interviewer_name,
            interview_date: data.interview_date,
            interview_time: data.interview_time,
            interview_feedback: null,
            eligible_for_next_round: null,
            applied_date: data.applied_date,
          };

          await models.interviewHistory.create(historyData);
          await models.interviewerCandidate.update(
            { interview_feedback: null, eligible_for_next_round: null },
            {
              where: { uuid: candidate.dataValues.uuid },
            }
          );

          const candidateDetails = await axios.get(
            `http://localhost:5000/candidate/getCandidateById?uuid=` + uuid,
            {
              headers: {
                Authorization: req.header("authorization"),
                "Content-Type": "application/json",
              },
            }
          );

          return res.status(200).json({
            status: true,
            code: 200,
            message: "Candidate profile updated successfully.",
            data: candidateDetails.data,
          });
        }
      } else if (
        data.interview_round == "Applied" ||
        data.interview_round == "Not Applicable" ||
        data.interview_round == "Manual Applied"
      ) {
        const candidateDetails = await axios.get(
          `http://localhost:5000/candidate/getCandidateById?uuid=` + uuid,
          {
            headers: {
              Authorization: req.header("authorization"),
              "Content-Type": "application/json",
            },
          }
        );

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Candidate profile updated successfully.",
          data: candidateDetails.data,
        });
      }
      const candidateDetails = await axios.get(
        `http://localhost:5000/candidate/getCandidateById?uuid=` + uuid
      );

      return res.status(200).json({
        status: true,
        code: 200,
        message: "Candidate profile updated successfully.",
        data: candidateDetails.data,
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

// It will update the visiblity status of particular candidate profile from database. (HIDE)
const deActivateCandidateProfile = async (req, res) => {
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
      const candidate = await models.interviewerCandidate.findOne({
        where: { uuid },
      });

      if (candidate) {
        const [updated] = await models.interviewerCandidate.update(
          { visible: false },
          {
            where: { uuid },
          }
        );
        if (updated) {
          return res.status(200).json({
            status: true,
            code: 200,
            message: "Candidate profile deactivated successfully.",
          });
        } else {
          return res.status(400).json({
            status: false,
            code: 400,
            message: "Candidate profile already deactivated!!",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Candidate profile does not exist!!",
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

// It will update the visiblity status of particular candidate profile from database. (SHOW)
const reActivateCandidateProfile = async (req, res) => {
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
      const candidate = await models.interviewerCandidate.findOne({
        where: { uuid },
      });

      if (candidate) {
        const [updated] = await models.interviewerCandidate.update(
          { visible: true },
          {
            where: { uuid },
          }
        );
        if (updated) {
          return res.status(200).json({
            status: true,
            code: 200,
            message: "Candidate profile reactivated successfully.",
          });
        } else {
          return res.status(400).json({
            status: false,
            code: 400,
            message: "Candidate profile already activated!!",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Candidate profile does not exist!!",
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

// It will delete particular candidate data from the database.
const hardDeleteCandidateProfile = async (req, res) => {
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
      const candidate = await models.interviewerCandidate.findOne({
        where: { uuid },
      });

      if (candidate) {
        await models.interviewerCandidate.destroy({
          where: { uuid },
        });
        await models.interviewHistory.destroy({
          where: {
            email: candidate.dataValues.email,
            applied_date: candidate.dataValues.applied_date,
          },
        });
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Candidate profile deleted successfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Candidate profile does not exist!!",
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

// It will send email to HR for reschedule the interview of particular candidate behalf of interviewer.
const rescheduleInterview = (req, res) => {
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
      var data = req.body;
      var subject = "Requesting for rescheduling the interview";
      var msgBody =
        "Dear HR,\nI hope you are doing well.\n\nDue to some unavoidable circumstances I am requesting for the rescheduling of the interview.\nReason :- " +
        data.reason +
        "\n\nThe new time and date is as follows:-\nDate :- " +
        data.new_interview_date +
        "\nTime :- " +
        data.new_interview_time +
        "\n\nPlease find the below attached credential details for your reference.\nCandidate Name :- " +
        data.candidate_name +
        "\nPosition Applied :- " +
        data.position +
        "\n\nThanks & Regards,\n" +
        data.interviewer_name;
      sendEmail(subject, msgBody, "", true);
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Request sent successfully.",
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

// It will update the form data by round wise.
const updateAppliedDates = (req, res) => {
  try {
    const sqlQ = "SELECT * FROM interviewer_candidate";
    connection_hrms.query(sqlQ, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const sql =
            "UPDATE interview_history SET applied_date = ? where email = ?";
          connection_hrms.query(
            sql,
            [data[i].applied_date, data[i].email],
            function (err, data) {}
          );
        }
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Applied dates updated successfully.",
        });
      }
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

// It will update resume links of partcular candidate based on uuid.
const updateResumeLinks = (req, res) => {
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
      readXlsxFile("./src/uploads/" + req.fileName).then((rows) => {
        for (var i = 1; i < rows.length; i++) {
          const sql =
            "UPDATE interviewer_candidate SET candidate_resume = ? where uuid = ?";
          connection_hrms.query(
            sql,
            [rows[i][4], rows[i][0]],
            function (err, data) {}
          );

          if (parseInt(i) + 1 === rows.length) {
            fs.unlink("./src/uploads/" + req.fileName, function (err) {
              if (err) return console.log(err);
              return res.status(200).json({
                status: true,
                code: 200,
                message: "Resume links updated successfully.",
              });
            });
          }
        }
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

const manualResumes = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: "prameters missing!!",
      data: errors.array(),
    });
  } else {
    readXlsxFile("./src/uploads/" + req.fileName).then(async (rows) => {
      for (var i = 1; i < rows.length; i++) {
        if (fs.existsSync("./src/uploads/resumes/" + rows[i][2])) {
          var mimeType = mime.lookup("./src/uploads/resumes/" + rows[i][2]);
          var extention = path.extname("./src/uploads/resumes/" + rows[i][2]);

          fs.renameSync(
            "./src/uploads/resumes/" + rows[i][2],
            "./src/uploads/resumes/" +
              rows[i][0] +
              path.extname("./src/uploads/resumes/" + rows[i][2])
          );

          const bucketParams = {
            Bucket: BUCKET,
            Key: "Intranet/Resumes/" + rows[i][0],
            Body: fs.readFileSync(
              "./src/uploads/resumes/" + rows[i][0] + extention
            ),
            ContentDisposition: "inline",
            ContentType: mimeType,
          };

          var s3data = await s3Client
            .send(new PutObjectCommand(bucketParams))
            .catch((err) => {
              console.log(err);
            });

          const sql =
            "UPDATE interviewer_candidate SET candidate_resume = ? where uuid = ?";
          connection_hrms.query(
            sql,
            [CDN_URL + bucketParams.Key, rows[i][0]],
            function (err, data) {}
          );
        }
      }
    });
  }
};

// It delete bulk candidates from backend using excel file.
const deleteBulkCandidates = (req, res) => {
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
      readXlsxFile("./src/uploads/" + req.fileName).then((rows) => {
        var uuids = [];
        rows.filter((arr, index) =>
          arr.filter((elt, i) => {
            if (i == 2) {
              uuids.push(arr[i]);
            }
          })
        );
        for (var i = 1; i < uuids.length; i++) {
          var uuid = uuids[i];
          var applied_date = "";
          var email = "";

          const sqlquery =
            "SELECT email,applied_date from interviewer_candidate WHERE uuid = '" +
            uuid +
            "'";
          connection_hrms.query(sqlquery, function (err, candidateData) {
            if (err) return console.log(err);
            else {
              if (candidateData.length > 0) {
                email = candidateData[0].email;
                applied_date = candidateData[0].applied_date;
              }
            }
          });

          const sql =
            "DELETE FROM interviewer_candidate WHERE uuid = '" + uuid + "'";
          connection_hrms.query(sql, function (err, data) {
            if (err) return console.log(err);
            else {
              const sqlDelete =
                "DELETE FROM interview_history WHERE email = ? AND applied_Date = ?";
              connection_hrms.query(
                sqlDelete,
                [email, applied_date],
                function (err, data) {
                  if (err) return console.log(err);
                  if (parseInt(i) + 1 === rows.length) {
                    fs.unlink("./src/uploads/" + req.fileName, function (err) {
                      if (err) return console.log(err);
                      return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Candidate data deleted successfully.",
                      });
                    });
                  }
                }
              );
            }
          });
        }
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

module.exports = {
  saveFormData,
  addCandidateProfile,
  importCandidateFile,
  getCandidateById,
  getActiveCandidates,
  getInActiveCandidates,
  updateCandidateProfile,
  deActivateCandidateProfile,
  reActivateCandidateProfile,
  hardDeleteCandidateProfile,
  rescheduleInterview,
  updateAppliedDates,
  updateResumeLinks,
  manualResumes,
  deleteBulkCandidates,
  uploadBulkCandidates,
};
