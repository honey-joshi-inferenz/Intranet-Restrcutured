const express = require("express");
const router = express.Router();
const { connection_examSimulator } = require("../../../config/dbConfig");

// It will add new question into the database.
router.post("/storeAns", (req, res) => {
  var today = new Date();
  const ansData = {
    stud_id: req.body.stud_id,
    exam_id: req.body.exam_id,
    que_id: req.body.que_id,
    given_ans: req.body.given_ans,
    correct_ans: req.body.correct_ans,
    attempted_date: today,
  };

  try {
    var sqlquery =
      "SELECT * FROM student_que WHERE stud_id = ? AND exam_id = ? AND que_id = ?";
    connection_examSimulator.query(
      sqlquery,
      [ansData.stud_id, ansData.exam_id, ansData.que_id],
      function (err, data) {
        if (err) {
          console.log(err);
          res.status(400).json({
            status: false,
            message: "Something Went Wrong While Interact With Database!!",
          });
        } else {
          if (data.length > 0) {
            var sqlquery =
              "UPDATE student_que SET given_ans = ?, attempted_date = ? WHERE stud_id = ? AND exam_id = ? AND que_id = ?";
            connection_examSimulator.query(
              sqlquery,
              [
                ansData.given_ans,
                ansData.attempted_date,
                ansData.stud_id,
                ansData.exam_id,
                ansData.que_id,
              ],
              function (err) {
                if (err) {
                  console.log(err);
                  res.status(400).json({
                    status: false,
                    message:
                      "Something Went Wrong While Interact With Database!!",
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    message: "Answer Stored Successfully.",
                  });
                }
              }
            );
          } else {
            var sqlquery = "INSERT INTO student_que SET ?";
            connection_examSimulator.query(sqlquery, ansData, function (err) {
              if (err) {
                res.status(400).json({
                  status: false,
                  message:
                    "Something Went Wrong While Interact With Database!!",
                });
              } else {
                res.status(200).json({
                  status: true,
                  message: "Answer Stored Successfully.",
                });
              }
            });
          }
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

// It will update attempted exam time of student on particular duration
router.post("/updateTime", (req, res) => {
  var stud_id = req.body.stud_id;
  var exam_id = req.body.exam_id;
  var time_taken = req.body.time_taken;
  console.log(stud_id, exam_id, time_taken, "updateTime");

  var sqlquery =
    "UPDATE student_exam SET time_taken = ? WHERE stud_id = ? AND exam_id = ?";
  connection_examSimulator.query(
    sqlquery,
    [time_taken, stud_id, exam_id],
    function (err) {
      if (err) {
        console.log(err);
        res.status(400).json({
          status: false,
          message: "Something Went Wrong While Interact With Database!!",
        });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Answer Stored Successfully." });
      }
    }
  );
});

// It will fetch all results from the database.
router.get("/fetchAllResults", (req, res) => {
  try {
    var sql = "SELECT * FROM student_exam";
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Results Are Not Available!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will fetch all the pending exams of the particular student.
router.post("/fetchOngoingExams", (req, res) => {
  try {
    var studID = req.body.stud_id;
    var sql =
      "SELECT B.* FROM student_exam A, exam_m B WHERE A.stud_id = " +
      studID +
      " AND A.exam_given_date IS NULL AND A.exam_id = B.exam_id";
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Exams Not Available!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will fetch all the completed exams of the particular student.
router.post("/fetchGivenExams", (req, res) => {
  try {
    var studID = req.body.stud_id;
    var sql =
      "SELECT A.*, B.* FROM student_exam A, exam_m B WHERE A.stud_id = " +
      studID +
      " AND A.exam_given_date IS NOT NULL AND A.exam_id = B.exam_id";
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Exams Not Available!!" });
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
