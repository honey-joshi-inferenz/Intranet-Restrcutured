const express = require("express");
const router = express.Router();
const { connection_examSimulator } = require("../../../config/dbConfig");

// It will store student result based on correct/wrong answers.
router.post("/storeResult", (req, res) => {
  var today = new Date();
  let stud_id = req.body.stud_id;
  let exam_id = req.body.exam_id;
  let time_taken = req.body.time_taken;
  let correct_ans = 0;
  let percentage = 0;
  let wrong_ans = 0;
  let status_pf = "";
  console.log(req.body);

  try {
    var sqlquery =
      "SELECT A.*, B.total_que, B.passing_marks FROM student_que A, exam_m B WHERE A.stud_id = ? AND A.exam_id = ? AND A.exam_id = B.exam_id";
    connection_examSimulator.query(
      sqlquery,
      [stud_id, exam_id],
      function (err, data) {
        if (err) {
          console.log(err);
          res
            .status(400)
            .json({
              status: false,
              message: "Something Went Wrong While Interact With Database!!",
            });
        } else {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].given_ans == data[i].correct_ans) {
                correct_ans++;
              } else {
                wrong_ans++;
              }
            }
            if (correct_ans >= data[0].passing_marks) {
              status_pf = "Pass";
            } else {
              status_pf = "Fail";
            }
            percentage = (correct_ans / data[0].total_que) * 100 + "%";

            var sqlquery =
              "SELECT time_taken FROM student_exam WHERE stud_id = ? AND exam_id = ?";
            connection_examSimulator.query(
              sqlquery,
              [stud_id, exam_id],
              function (err, studData) {
                if (err) {
                  console.log(err);
                  res
                    .status(400)
                    .json({
                      status: false,
                      message:
                        "Something Went Wrong While Interact With Database!!",
                    });
                } else {
                  time_taken = time_taken + Number(studData[0].time_taken);
                  console.log(time_taken, "time ------");

                  const resultData = {
                    stud_id: stud_id,
                    exam_id: exam_id,
                    exam_given_date: today,
                    status_pf: status_pf,
                    score: correct_ans,
                    percentage: percentage,
                    time_taken: time_taken,
                    correct_ans: correct_ans,
                  };

                  var sqlquery =
                    "UPDATE student_exam SET exam_given_date = ?, status_pf = ?, score = ?, percentage = ?, time_taken = ?,correct_ans = ? WHERE stud_id = ? AND exam_id = ?";
                  connection_examSimulator.query(
                    sqlquery,
                    [
                      resultData.exam_given_date,
                      resultData.status_pf,
                      resultData.score,
                      resultData.percentage,
                      resultData.time_taken,
                      resultData.correct_ans,
                      stud_id,
                      exam_id,
                    ],
                    function (err) {
                      if (err) {
                        console.log(err);
                        res
                          .status(400)
                          .json({
                            status: false,
                            message:
                              "Something Went Wrong While Interact With Database!!",
                          });
                      } else {
                        res
                          .status(200)
                          .json({
                            status: true,
                            message: "Result Stored Successfully.",
                            data: req.body,
                          });
                      }
                    }
                  );
                }
              }
            );
          } else {
            const resultData = {
              stud_id: stud_id,
              exam_id: exam_id,
              exam_given_date: today,
              status_pf: "Fail",
              score: 0,
              percentage: 0 + "%",
              time_taken: Number(time_taken) + 1000,
              correct_ans: 0,
            };

            var sqlquery =
              "UPDATE student_exam SET exam_given_date = ?, status_pf = ?, score = ?, percentage = ?, time_taken = ?,correct_ans = ? WHERE stud_id = ? AND exam_id = ?";
            connection_examSimulator.query(
              sqlquery,
              [
                resultData.exam_given_date,
                resultData.status_pf,
                resultData.score,
                resultData.percentage,
                resultData.time_taken,
                resultData.correct_ans,
                stud_id,
                exam_id,
              ],
              function (err) {
                if (err) {
                  console.log(err);
                  res
                    .status(400)
                    .json({
                      status: false,
                      message:
                        "Student Not Enrolled For This Exam OR Something Went Wrong While Interact With Database!!",
                    });
                } else {
                  res
                    .status(200)
                    .json({
                      status: true,
                      message: "Result Stored Successfully.",
                      data: req.body,
                    });
                }
              }
            );
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

// It will fetch fetch result from the database based on candidate id & exam id.
router.post("/fetchCandidateResult", (req, res) => {
  try {
    var candidData = req.body;

    var sql =
      "SELECT A.exam_given_date, A.status_pf, A.correct_ans, A.time_taken, B.enrollment, B.name, B.email, B.contact, B.institute, B.applied_for, B.applied_date, C.exam_name, C.total_que FROM student_exam A, users B, exam_m C WHERE A.stud_id = ? AND A.exam_id = ? AND A.stud_id = B.id AND A.exam_id = C.exam_id";
    connection_examSimulator.query(
      sql,
      [candidData.stud_id, candidData.exam_id],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          res.status(200).json({ status: true, data });
        } else {
          res
            .status(400)
            .json({ status: false, message: "Result Is Not Available!!" });
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

// It will fetch all results of particular candidate based on candidate id.
router.get("/fetchCandidateResults", (req, res) => {
  try {
    var candidID = req.body.stud_id;

    var sql = "SELECT * FROM student_exam WHERE stud_id = ?";
    connection_examSimulator.query(sql, candidID, function (err, data) {
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

module.exports = router;
