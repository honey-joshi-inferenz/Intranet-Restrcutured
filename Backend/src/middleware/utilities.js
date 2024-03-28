const multer = require("multer");
const fs = require("fs");
var nodemailer = require("nodemailer");

// Create uploads directory if it's not exist in src folder
var dir = "./src/uploads/resumes/";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Multer code for upload files inside uploads folder
const imageStorage = multer.diskStorage({
  destination: "./src/uploads/resumes/",
  filename: function (req, file, cb) {
    req.fileName = file.originalname;
    cb(null, req.fileName);
  },
});

const imageUpload = multer({
  storage: imageStorage,
});

const invoiceStorage = multer.diskStorage({
  destination: "./src/uploads/invoice/",
  filename: function (req, file, cb) {
    console.log(file);
    req.fileName = file.originalname;
    cb(null, req.fileName);
  },
});

const invoiceUpload = multer({
  storage: invoiceStorage,
});

const zipStorage = multer.memoryStorage();

const zipUpload = multer({
  storage: zipStorage,
});

// Delete files from uploads folder by filename inside request
const deleteLocalFiles = (req) => {
  for (const file in req?.files) {
    for (const childFile in req.files?.[file]) {
      fs.unlink(
        "./src/uploads/" + req.files[file][childFile].filename,
        async function (err) {
          if (err) return console.log(err);
        }
      );
    }
  }
};

const sendEmail = (sendTo, subject, msgBody) => {
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
    to: sendTo,
    cc: "hr@inferenz.ai",
    subject: subject,
    text: msgBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
};

module.exports = {
  imageUpload,
  invoiceUpload,
  zipUpload,
  deleteLocalFiles,
  sendEmail,
};
