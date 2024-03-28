require("dotenv").config();
const { CDN_URL, REGION, PROFILE, BUCKET, SECRET_KEY } = process.env;
const https = require("https");
const {
  S3Client,
  ListBucketsCommand,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { connection_hrms } = require("../../../../config/dbConfig");
const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Router } = require("express");
const router = Router();
var mime = require("mime-types");
const { fromIni } = require("@aws-sdk/credential-providers");

const s3Client = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
});
const bucketParams = { Bucket: BUCKET };

var dir = "./src/uploads/resumes/";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const Storage = multer.diskStorage({
  destination: "./src/uploads/resumes/",
  filename: function (req, file, cb) {
    req.fileName = file.originalname;
    cb(null, req.fileName);
  },
});

const Upload = multer({
  storage: Storage,
});

const getBucketList = async (req, res) => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    return res.status(200).json({
      status: true,
      code: 200,
      Buckets: data,
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

const getBucketResumes = async (req, res) => {
  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    return res.status(200).json({
      status: true,
      code: 200,
      Resumes: data,
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

const getBucketResumeByName = async (req, res) => {
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
      const resumeName = req.query.resumeName;
      const bucketParams = {
        Bucket: BUCKET,
        Key: resumeName,
      };
      const data = await s3Client.send(new GetObjectCommand(bucketParams));
      var resume = await data.Body.transformToString();
      return res.status(200).json({
        status: true,
        code: 200,
        resume,
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

const updateResumeLinks = async (req, res) => {
  try {
    var sql =
      'SELECT * FROM interviewer_candidate WHERE candidate_resume LIKE "https://inferenz.ai/wp-content/uploads/%"';

    connection_hrms.query(sql, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        let links = [];
        for (let i = 0; i < data.length; i++) {
          const url = data[i].candidate_resume;

          const filename = path.basename(url);

          const request = https.get(url, function (response) {
            const fileStream = fs.createWriteStream(
              `uploads/resumes/${filename}`
            );
            response.pipe(fileStream);

            var mimeType = mime.lookup("./src/uploads/resumes/" + filename);

            fileStream.on("error", function (error) {
              console.log(error, "error");
            });

            fileStream.on("finish", async function () {
              fileStream.close();
              const bucketParams = {
                Bucket: BUCKET,
                Key: "Intranet/Resumes/" + filename,
                Body: fs.readFileSync("./src/uploads/resumes/" + filename),
                ContentDisposition: "inline",
                ContentType: mimeType,
              };
              const s3data = await s3Client.send(
                new PutObjectCommand(bucketParams)
              );
              // fs.unlink('./src/uploads/resumes/' + filename, function (err) {
              //   if (err) return console.log(err)
              //   return res.status(200).json({
              //     message:
              //       'Successfully uploaded object at : ' +
              // CDN_URL + bucketParams.Key,
              //   })
              // })
              links.push(CDN_URL + bucketParams.Key);
              const sqlQuery =
                "UPDATE interviewer_candidate SET candidate_resume = ? WHERE uuid = ?";

              connection_hrms.query(
                sqlQuery,
                [CDN_URL + bucketParams.Key, data[i].uuid],
                function (err, resData) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (i + 1 == data.length) {
                      return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Resumes uploaded successfully",
                        links,
                      });
                    }
                    console.log(
                      "Successfully uploaded object at : " +
                        CDN_URL +
                        bucketParams.Key
                    );
                  }
                }
              );
            });
          });

          request.on("error", function (error) {
            console.log(error, "error");
          });
        }
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

const uploadResume = async (req, res) => {
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
      const regEx = /[`!@#$%^&*()+\=\[\{};':"\\|,<>\/?~]/g;
      var filename = req.file.filename.replace(/ /g, "_").replace(regEx, "");
      const bucketParams = {
        Bucket: BUCKET,
        Key: "Intranet/Resumes/" + filename,
        Body: fs.readFileSync("./src/uploads/resumes/" + req.file.filename),
      };

      const data = await s3Client.send(new PutObjectCommand(bucketParams));

      // fs.unlink('./src/uploads/' + req.fileName, function (err) {
      //   if (err) return console.log(err)

      //   return res.status(200).json({
      //     message:
      //       'Successfully uploaded object at : ' +
      // CDN_URL + bucketParams.Key,
      //   })
      // })
      return res.status(200).json({
        status: true,
        code: 200,
        message:
          "Successfully uploaded object at : " + CDN_URL + bucketParams.Key,
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
5;
const deleteResume = async (req, res) => {
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
      const resumeName = req.query.resumeName;
      const bucketParams = {
        Bucket: BUCKET,
        Key: resumeName,
      };
      const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
      console.log("Success. Object deleted.", data);
      return res.status(200).json({
        status: true,
        code: 200,
        message: "object deleted successfully.",
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
  getBucketList,
  getBucketResumes,
  getBucketResumeByName,
  updateResumeLinks,
  uploadResume,
  deleteResume,
};
