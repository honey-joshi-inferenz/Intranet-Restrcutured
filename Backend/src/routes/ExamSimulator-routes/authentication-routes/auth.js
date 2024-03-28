const express = require("express");
const router = express.Router();
const { connection_examSimulator } = require("../../../config/dbConfig");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");

var dir = "./src/uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const imageStorage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, cb) {
    req.fileName =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(null, req.fileName);
  },
});

const imageUpload = multer({
  storage: imageStorage,
});

// It will register new user into the system.
router.post(
  "/studentRegistration",
  imageUpload.single("registerData"),
  (req, res) => {
    try {
      var today = new Date();
      readXlsxFile("./src/uploads/" + req.fileName).then((rows) => {
        for (var i = 1; i < rows.length; i++) {
          const registerData = {
            enrollment: rows[i][0],
            name: rows[i][1],
            email: rows[i][2],
            contact: rows[i][3],
            password: rows[i][0],
            course: rows[i][4],
            institute: rows[i][5],
            academic_year: rows[i][6],
            applied_for: rows[i][7],
            ins_status: rows[i][9],
            exam_id: rows[i][8],
            start_date: rows[i][10],
            end_date: rows[i][11],
            applied_date: today,
          };

          var sqlquery =
            "INSERT INTO users(enrollment,name,email,contact,password,course,institute,academic_year,applied_for,ins_status,applied_date) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
          connection_examSimulator.query(
            sqlquery,
            [
              registerData.enrollment,
              registerData.name,
              registerData.email,
              registerData.contact,
              registerData.password,
              registerData.course,
              registerData.institute,
              registerData.academic_year,
              registerData.applied_for,
              registerData.ins_status,
              registerData.applied_date,
            ],
            function (err, data) {
              if (err) {
                console.log(err);
                res
                  .status(400)
                  .json({ status: false, message: "Data Entry Failed" });
              } else {
                var sqlquery =
                  "INSERT INTO student_exam(stud_id, exam_id, start_date, end_date) VALUES(?,?,?,?)";
                connection_examSimulator.query(
                  sqlquery,
                  [
                    data.insertId,
                    registerData.exam_id,
                    registerData.start_date,
                    registerData.end_date,
                  ],
                  function (err) {
                    if (err) {
                      console.log(err);
                      res
                        .status(400)
                        .json({ status: false, message: "Data Entry Failed" });
                    }
                  }
                );
              }
            }
          );

          if (parseInt(i) + 1 === rows.length) {
            fs.unlink("./src/uploads/" + req.fileName, function (err) {
              if (err) return console.log(err);
              res.status(200).json({
                status: true,
                message: "Student Data Imported Successfully.",
              });
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ status: false, message: "Internal Server Error occured!!" });
    }
  }
);

// It will register new user into the system.
router.post("/manualStudentRegistration", (req, res) => {
  try {
    var today = new Date();
    var studentData = req.body;
    var registerData = {
      enrollment: studentData.enrollment,
      name: studentData.name,
      email: studentData.email,
      contact: studentData.contact,
      password: studentData.password,
      course: studentData.course,
      institute: studentData.institute,
      academic_year: studentData.academic_year,
      applied_for: studentData.applied_for,
      ins_status: studentData.ins_status,
      applied_date: today,
    };

    var sqlquery = "INSERT INTO users SET ?";
    connection_examSimulator.query(
      sqlquery,
      registerData,
      function (err, data) {
        if (err) {
          console.log(err);
          res.status(400).json({ status: false, message: "Data Entry Failed" });
        } else {
          var sqlquery =
            "INSERT INTO student_exam(stud_id, exam_id, start_date, end_date) VALUES(?,?,?,?)";
          connection_examSimulator.query(
            sqlquery,
            [
              data.insertId,
              studentData.exam_id,
              studentData.start_date,
              studentData.end_date,
            ],
            function (err) {
              if (err) {
                console.log(err);
                res
                  .status(400)
                  .json({ status: false, message: "Data Entry Failed" });
              } else {
                res.status(200).json({
                  status: true,
                  message: "Student Registered Successfully.",
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will check weather the credentials are correct or not provided by user.
router.post("/login", (req, res) => {
  try {
    var enrollment = req.body.enrollment;
    var password = req.body.password;
    var today = new Date().toISOString().split("T")[0];
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var currentTime = today + " " + hours + ":" + minutes;

    var sql = "SELECT * FROM users WHERE enrollment = ? AND password = ?";
    connection_examSimulator.query(
      sql,
      [enrollment, password],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          var sql =
            "SELECT * FROM student_exam WHERE stud_id = " +
            data[0].id +
            " AND exam_given_date IS NULL AND DATEDIFF(end_date,'" +
            today +
            "') >= 0 AND CAST('" +
            currentTime +
            "' As datetime) >= SUBTIME(CAST(start_date As datetime), 500)";
          connection_examSimulator.query(sql, function (err, data1) {
            if (err) throw err;
            if (data1.length > 0) {
              res.status(200).json({
                status: true,
                message: "Login Successful",
                userID: data[0].id,
              });
            } else {
              res.status(400).json({
                status: false,
                message: "You Are Not Allowed To Access This Portal!!",
              });
            }
          });
        } else {
          res
            .status(400)
            .json({ status: false, message: "Invalid Credentials!!" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will return complete profile of user based on email.
router.post("/fetchProfile", (req, res) => {
  try {
    var studID = req.body.stud_id;

    var sql = "SELECT * FROM users WHERE id = ?";
    connection_examSimulator.query(sql, [studID], function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res.status(400).json({ status: false, message: "User Not Found!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will update the user profile.
router.post("/updateProfile", (req, res) => {
  try {
    const profileDetails = req.body;
    const sqlQ = "SELECT * FROM users WHERE email = ?";
    connection_examSimulator.query(
      sqlQ,
      [profileDetails.email],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          const sql =
            "UPDATE users SET name = ?, role = ?, password = ? where email = ?";
          connection_examSimulator.query(
            sql,
            [
              profileDetails.name,
              profileDetails.role,
              profileDetails.password,
              profileDetails.email,
            ],
            function (err, data) {
              if (err) {
                console.log(err);
                res
                  .status(400)
                  .json({ status: 400, message: "Request Failed!!" });
              } else {
                res.status(200).json({
                  status: 200,
                  message: "Profile Updated Successfully.",
                });
              }
            }
          );
        } else {
          res
            .status(201)
            .json({ status: 201, message: "User Doesn't Exists!!" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: 400, message: "Interanl Server Error occured!!" });
  }
});

// It will return profile of users based on role.
router.get("/fetchExamGivenStudents", (req, res) => {
  try {
    var sql =
      "SELECT A.*, B.exam_id, B.exam_given_date, B.correct_ans, C.exam_name FROM users A, student_exam B, exam_m C WHERE B.exam_given_date IS NOT NULL AND A.id = B.stud_id AND B.exam_id = C.exam_id ORDER BY A.id DESC";
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          data[i] = { serialNumber: i + 1, ...data[i] };
        }
        res.status(200).json({ status: true, data });
      } else {
        res.status(400).json({ status: false, message: "User Not Found!!" });
      }
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will return profile of users based on role.
router.get("/fetchAllStudents", (req, res) => {
  try {
    var sql =
      "SELECT A.*, B.exam_id FROM users A, student_exam B WHERE A.id = B.stud_id";
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          data[i] = { serialNumber: i + 1, ...data[i] };
        }
        res.status(200).json({ status: true, data });
      } else {
        res.status(400).json({ status: false, message: "User Not Found!!" });
      }
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// fetch student details based on id
router.post("/fetchStudentById", (req, res) => {
  try {
    var id = req.body.id;

    var sql =
      "SELECT A.*,B.start_date, B.end_date,C.exam_name,C.exam_id FROM users A,student_exam B,exam_m C WHERE  A.id = ? AND A.id = B.stud_id AND B.exam_id = C.exam_id";
    connection_examSimulator.query(sql, [id], function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res.status(400).json({ status: false, message: "User Not Found!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

//update student profile
router.post("/updateStudentProfile", (req, res) => {
  try {
    var stud_id = req.body.id;
    var exam_id = req.body.exam_id;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;

    var sql = "SELECT * FROM student_exam WHERE stud_id = ?";
    connection_examSimulator.query(sql, [stud_id], function (err, data) {
      if (err) throw err;

      if (data.length > 0) {
        var sql =
          "UPDATE student_exam SET exam_id=?,start_date=?,end_date=? WHERE stud_id=?";

        connection_examSimulator.query(
          sql,
          [exam_id, start_date, end_date, stud_id],
          function (err, data) {
            if (err) {
              console.log(err);
              res
                .status(400)
                .json({ status: 400, message: "Request Failed!!" });
            } else {
              res.status(200).json({
                status: 200,
                message: "Profile Updated Successfully.",
              });
            }
          }
        );
      } else {
        res.status(201).json({ status: 201, message: "User Doesn't Exists!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

module.exports = router;
