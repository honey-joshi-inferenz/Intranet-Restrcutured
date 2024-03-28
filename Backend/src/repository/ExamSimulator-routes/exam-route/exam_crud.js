const express = require("express");
const router = express.Router();
const { connection_examSimulator } = require("../../../config/dbConfig");

// It will declare new exam into the system.
router.post("/declareExam", (req, res) => {
  var today = new Date();

  const examData = {
    exam_name: req.body.exam_name,
    total_que: req.body.total_que,
    sub_que: JSON.stringify(req.body.sub_que),
    complexity_level: JSON.stringify(req.body.complexity_level),
    tot_marks: req.body.tot_marks,
    passing_marks: req.body.passing_marks,
    duration: req.body.duration * 60 * 1000,
    exam_declared_date: today,
    start_stop_flag: true,
  };

  console.log(examData);
  try {
    var sqlquery = "SELECT * FROM exam_m WHERE exam_name = ? ";
    connection_examSimulator.query(
      sqlquery,
      [examData.exam_name],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          res
            .status(400)
            .json({
              status: false,
              message: examData.exam_name + " Already Declared!!",
            });
        } else {
          var sqlquery = "INSERT INTO exam_m SET ?";
          connection_examSimulator.query(sqlquery, examData, function (err) {
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
                .json({ status: true, message: "Exam Declared Successfully." });
            }
          });
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

// It will fetch all the declared exams from the database.
router.get("/fetchAllExams", (req, res) => {
  try {
    var sql = "SELECT * FROM exam_m ORDER BY exam_id DESC";
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          data[i] = { serialNumber: i + 1, ...data[i] };
        }
        res.status(200).json({ status: true, data });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Exams Are Not Declared Yet!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will return exam details based on exam id.
router.post("/fetchExam", (req, res) => {
  try {
    var examID = req.body.exam_id;

    var sql = "SELECT * FROM exam_m WHERE exam_id = ?";
    connection_examSimulator.query(sql, examID, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        console.log(typeof json);
        res.status(200).json({ status: true, data });
      } else {
        res.status(400).json({ status: false, message: "Exam Not Found!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will update the exam details based on exam id.
router.post("/updateExam", (req, res) => {
  try {
    const examDetails = req.body;
    console.log(examDetails);
    const sqlQ = "SELECT * FROM exam_m WHERE exam_id = ?";
    connection_examSimulator.query(
      sqlQ,
      [examDetails.exam_id],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          const sql =
            "UPDATE exam_m SET exam_name = ?, total_que = ?, sub_que = ?, complexity_level = ?, tot_marks = ?, passing_marks = ?, duration = ? WHERE exam_id = ?";
          connection_examSimulator.query(
            sql,
            [
              examDetails.exam_name,
              examDetails.total_que,
              examDetails.sub_que,
              examDetails.complexity_level,
              examDetails.tot_marks,
              examDetails.passing_marks,
              examDetails.duration,
              examDetails.exam_id,
            ],
            function (err, data) {
              if (err) {
                console.log(err);
                res
                  .status(400)
                  .json({
                    status: 400,
                    message:
                      "Something Went Wrong While Interact With Database!!",
                  });
              } else {
                res
                  .status(200)
                  .json({
                    status: 200,
                    message: "Exam Details Updated Successfully.",
                  });
              }
            }
          );
        } else {
          res
            .status(201)
            .json({ status: 201, message: "Exam Doesn't Exists!!" });
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

// It will delete the exam details based on exam id.
router.post("/deleteExam", (req, res) => {
  try {
    const examID = req.body.exam_id;
    const sqlQ = "SELECT * FROM exam_m WHERE exam_id = ?";
    connection_examSimulator.query(sqlQ, [examID], function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        const sql = "DELETE FROM exam_m where exam_id = ?";
        connection_examSimulator.query(sql, [examID], function (err, data) {
          if (err) {
            console.log(err);
            res
              .status(400)
              .json({
                status: 400,
                message: "Something Went Wrong While Interact With Database!!",
              });
          } else {
            res
              .status(200)
              .json({ status: 200, message: "Exam Deleted Successfully." });
          }
        });
      } else {
        res.status(201).json({ status: 201, message: "Exam Doesn't Exists!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will update the exam status based on exam id.
router.post("/startStop", (req, res) => {
  try {
    const examDetails = req.body;
    console.log(examDetails);
    const sqlQ = "SELECT * FROM exam_m WHERE exam_id = ?";
    connection_examSimulator.query(
      sqlQ,
      [examDetails.exam_id],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          const sql = "UPDATE exam_m SET start_stop_flag = ? where exam_id = ?";
          connection_examSimulator.query(
            sql,
            [examDetails.start_stop_flag, examDetails.exam_id],
            function (err, data) {
              if (err) {
                console.log(err);
                res
                  .status(400)
                  .json({
                    status: 400,
                    message:
                      "Something Went Wrong While Interact With Database!!",
                  });
              } else {
                res
                  .status(200)
                  .json({
                    status: 200,
                    message: "Exam Status Updated Successfully.",
                  });
              }
            }
          );
        } else {
          res
            .status(201)
            .json({ status: 201, message: "Exam Doesn't Exists!!" });
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

module.exports = router;
