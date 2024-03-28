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

const fileUpload = multer({
  storage: imageStorage,
});

// It will import new questions from excel to database.
router.post(
  "/importQuestions",
  fileUpload.single("questionsData"),
  (req, res) => {
    try {
      readXlsxFile("./src/uploads/" + req.fileName).then((rows) => {
        for (var i = 1; i < rows.length; i++) {
          const questionData = {
            sub_id: rows[i][0],
            c_id: rows[i][1],
            que_text: rows[i][2],
            opt1: rows[i][3],
            opt2: rows[i][4],
            opt3: rows[i][5],
            opt4: rows[i][6],
            correct_ans: rows[i][7],
          };

          var sqlquery = "INSERT INTO question_m SET ?";
          connection_examSimulator.query(
            sqlquery,
            questionData,
            function (err, data) {
              if (err) {
                console.log(err);
                res
                  .status(400)
                  .json({ status: false, message: "Data Entry Failed" });
              }
            }
          );

          if (parseInt(i) + 1 === rows.length) {
            fs.unlink("./src/uploads/" + req.fileName, function (err) {
              if (err) return console.log(err);
              res.status(200).json({
                status: true,
                message: "Questions Imported Successfully.",
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

// It will add new question into the database.
router.post("/addQuestion", (req, res) => {
  const queData = {
    sub_id: req.body.sub_id,
    c_id: req.body.c_id,
    que_text: req.body.que_text,
    opt1: req.body.opt1,
    opt2: req.body.opt2,
    opt3: req.body.opt3,
    opt4: req.body.opt4,
    correct_ans: req.body.correct_ans,
  };

  try {
    var sqlquery = "SELECT * FROM question_m WHERE que_text = ? ";
    connection_examSimulator.query(
      sqlquery,
      [queData.que_text],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          res
            .status(400)
            .json({ status: false, message: "Question Already Inserted!!" });
        } else {
          var sqlquery = "INSERT INTO question_m SET ?";
          connection_examSimulator.query(sqlquery, queData, function (err) {
            if (err) {
              res.status(400).json({
                status: false,
                message: "Something Went Wrong While Interact With Database!!",
              });
            } else {
              res.status(200).json({
                status: true,
                message: "Question Added Successfully.",
              });
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

// add question with image text
const image = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: function (req, file, cb) {
    req.fileName =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(null, req.fileName);
  },
});

const imageUpload = multer({
  storage: image,
});

router.post("/addQuestionImage", imageUpload.single("que_text"), (req, res) => {
  const formData = JSON.parse(req.body.data);
  const file = req.file;
  const data = {
    sub_id: formData.sub_id,
    c_id: formData.c_id,
    // que_text: 'http://192.168.8.233:8000/images/' + file.filename,
    que_text: "https://intranet.inferenz.ai:8000/images/" + file.filename,
    opt1: formData.opt1,
    opt2: formData.opt2,
    opt3: formData.opt3,
    opt4: formData.opt4,
    correct_ans: formData.correct_ans,
  };

  try {
    var sql = "INSERT INTO question_m SET ?";
    connection_examSimulator.query(sql, data, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res
          .status(200)
          .json({ status: true, message: "Question Added Successfully." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 400, message: "Internal Server Error!" });
  }
});

// It will fetch all questions from the database.
router.get("/fetchAllQuestions", (req, res) => {
  try {
    var sql = "SELECT * FROM question_m ORDER BY que_id DESC";
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
          .json({ status: false, message: "Questions Are Not Available!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will fetch question from the database based on question id.
router.post("/fetchQuestion", (req, res) => {
  try {
    var queID = req.body.que_id;

    var sql = "SELECT * FROM question_m WHERE que_id = ?";
    connection_examSimulator.query(sql, queID, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Question Is Not Available!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

function shuffleResult(array) {
  for (var i = array.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

// It will fetch all questions of particular subject from the database.
router.post("/fetchSubjectWiseQuestions", (req, res) => {
  var subID = req.body.sub_id;

  try {
    var sql = "SELECT * FROM question_m WHERE sub_id = ?";
    connection_examSimulator.query(sql, subID, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          data[i] = { serialNumber: i + 1, ...data[i] };
        }
        data = shuffleResult(data);
        res.status(200).json({ status: true, data });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Questions Are Not Available!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will fetch all questions of particular exam from the database.
router.post("/fetchExamWiseQuestions", (req, res) => {
  var examID = parseInt(req.body.exam_id);
  var studID = parseInt(req.body.stud_id);

  try {
    // Check whether student is enrolled for particular exam or not.
    var sql = "SELECT * FROM student_exam WHERE stud_id = ? AND exam_id = ?";
    connection_examSimulator.query(sql, [studID, examID], function (err, data) {
      if (data.length > 0) {
        // Fetch subject id and count of particular exam
        var time_taken = data[0].time_taken;
        var sql = "SELECT * FROM exam_m WHERE exam_id = ?";
        connection_examSimulator.query(sql, examID, function (err, data) {
          if (err) throw err;
          if (data.length > 0) {
            var sub_que = JSON.parse(data[0].sub_que);
            var sub_id = [];
            var queData = [];
            var filteredQuestions = [];
            var attemptedQue = [];

            // Calculate count of particular sub_id based on attempted question id.
            var sql =
              "SELECT B.sub_id, COUNT(B.sub_id) AS count FROM student_que A, question_m B WHERE A.stud_id = ? AND A.exam_id = ? AND A.que_id = B.que_id AND given_ans IS NOT NULL GROUP BY B.sub_id";
            connection_examSimulator.query(
              sql,
              [studID, examID],
              function (err, attemptedData) {
                if (err) throw err;
                if (attemptedData.length > 0) {
                  for (let i = 0; i < attemptedData.length; i++) {
                    attemptedQue.push({
                      sub_id: attemptedData[i].sub_id,
                      count: attemptedData[i].count,
                    });
                  }
                }
              }
            );

            // Iterate loop to extract { sub_id : count } from fetched array
            for (let i = 0; i < sub_que.length; i++) {
              sub_id.push(sub_que[i].sub_id);
            }

            // Fetch questions from question_m table which are not attempted by student previously
            var sql =
              "SELECT * FROM question_m WHERE sub_id IN (" +
              sub_id.toString() +
              ") AND que_id != ALL (SELECT que_id FROM student_que WHERE stud_id = " +
              studID +
              " AND exam_id = " +
              examID +
              " AND given_ans IS NOT NULL)";
            connection_examSimulator.query(sql, function (err, data) {
              if (err) throw err;
              if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  data[i] = { givenAns: "", ...data[i] };
                }
                queData.push(data);
                queData = queData.flat();
                queData = shuffleResult(queData);

                //Filter Complexity & Questions Count From Set of Shuffled Questions.
                for (let i = 0; i < sub_que.length; i++) {
                  // Check if student had already attempted any questions or not
                  if (attemptedQue.length > 0) {
                    // To match attempted question's sub_id and current sub_id
                    let currentSubID = attemptedQue.filter(
                      (item) =>
                        parseInt(item.sub_id) === parseInt(sub_que[i].sub_id)
                    );
                    // Execute when student had attempted question of particular subject
                    if (currentSubID[i] != undefined) {
                      const result = queData
                        .filter(
                          (que) =>
                            parseInt(que.sub_id) === parseInt(sub_que[i].sub_id)
                        )
                        .slice(0, sub_que[i].count - currentSubID[0].count);
                      filteredQuestions.push(result);
                    }
                    // Execute when student had not attempted any question of particular subject
                    else {
                      const result = queData
                        .filter(
                          (que) =>
                            parseInt(que.sub_id) === parseInt(sub_que[i].sub_id)
                        )
                        .slice(0, sub_que[i].count);
                      filteredQuestions.push(result);
                    }
                  }
                  // Execute when student had not attempted any question of particular subject
                  else {
                    const result = queData
                      .filter(
                        (que) =>
                          parseInt(que.sub_id) === parseInt(sub_que[i].sub_id)
                      )
                      .slice(0, sub_que[i].count);
                    filteredQuestions.push(result);
                  }

                  // This will merge sub arrays into one array and shuffle the questions
                  filteredQuestions = filteredQuestions.flat();
                  filteredQuestions = shuffleResult(filteredQuestions);

                  // Check for last iteration of loop and send the response to the client
                  if (i + 1 == sub_que.length) {
                    if (filteredQuestions.length > 0) {
                      res.status(200).json({
                        status: true,
                        totalQue: filteredQuestions.length,
                        data: filteredQuestions,
                        time_taken,
                      });
                    } else {
                      res.status(400).json({
                        status: false,
                        message: "Questions Are Not Available!!",
                      });
                    }
                  }
                }
              }
            });
          } else {
            res.status(400).json({
              status: false,
              message: "Questions Are Not Available!!",
            });
          }
        });
      } else {
        res.status(400).json({
          status: false,
          message: "You Are Not Enrolled In This Exam!!",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will update the question details based on question id.
router.post("/updateQuestion", (req, res) => {
  try {
    const queDetails = req.body;
    const sqlQ = "SELECT * FROM question_m WHERE que_id = ?";
    connection_examSimulator.query(
      sqlQ,
      [queDetails.que_id],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          const sql =
            "UPDATE question_m SET sub_id = ?, c_id = ?, que_text = ?, opt1 = ?, opt2 = ?, opt3 = ?, opt4 = ?, correct_ans = ? where que_id = ?";
          connection_examSimulator.query(
            sql,
            [
              queDetails.sub_id,
              queDetails.c_id,
              queDetails.que_text,
              queDetails.opt1,
              queDetails.opt2,
              queDetails.opt3,
              queDetails.opt4,
              queDetails.correct_ans,
              queDetails.que_id,
            ],
            function (err, data) {
              if (err) {
                console.log(err);
                res.status(400).json({
                  status: 400,
                  message:
                    "Something Went Wrong While Interact With Database!!",
                });
              } else {
                res.status(200).json({
                  status: 200,
                  message: "Question Updated Successfully.",
                });
              }
            }
          );
        } else {
          res
            .status(201)
            .json({ status: 201, message: "Question Doesn't Exists!!" });
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

// It will delete the question based on exam id.
router.post("/deleteQuestion", (req, res) => {
  try {
    const queID = req.body.que_id;
    const sqlQ = "SELECT * FROM question_m WHERE que_id = ?";
    connection_examSimulator.query(sqlQ, [queID], function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        const sql = "DELETE FROM question_m where que_id = ?";
        connection_examSimulator.query(sql, [queID], function (err, data) {
          if (err) {
            console.log(err);
            res.status(400).json({
              status: 400,
              message: "Something Went Wrong While Interact With Database!!",
            });
          } else {
            res
              .status(200)
              .json({ status: 200, message: "Question Deleted Successfully." });
          }
        });
      } else {
        res
          .status(201)
          .json({ status: 201, message: "Question Doesn't Exists!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will fetch question's complexity from the database.
router.get("/fetchComplexity", (req, res) => {
  try {
    var sql = "SELECT * FROM complexity_m";
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Data Not Available!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

router.post("/fetchExamWiseQuestionsTest", (req, res) => {
  var examID = parseInt(req.body.exam_id);
  var studID = parseInt(req.body.stud_id);

  try {
    // Check whether student is enrolled for particular exam or not.
    var sql = "SELECT * FROM student_exam WHERE stud_id = ? AND exam_id = ?";
    connection_examSimulator.query(sql, [studID, examID], function (err, data) {
      if (data.length > 0) {
        // Fetch subject id and count of particular exam
        var sql = "SELECT * FROM exam_m WHERE exam_id = ?";
        connection_examSimulator.query(sql, examID, function (err, data) {
          if (err) throw err;
          if (data.length > 0) {
            var sub_que = JSON.parse(data[0].sub_que);
            var sub_id = [];
            var queData = [];
            var filteredQuestions = [];
            var attemptedQue = [];

            // Calculate count of particular sub_id based on attempted question id.
            var sql =
              "SELECT B.sub_id, COUNT(B.sub_id) AS count FROM student_que A, question_m B WHERE A.stud_id = ? AND A.exam_id = ? AND A.que_id = B.que_id AND given_ans IS NOT NULL GROUP BY B.sub_id";
            connection_examSimulator.query(
              sql,
              [studID, examID],
              function (err, attemptedData) {
                if (err) throw err;
                if (attemptedData.length > 0) {
                  for (let i = 0; i < attemptedData.length; i++) {
                    attemptedQue.push({
                      sub_id: attemptedData[i].sub_id,
                      count: attemptedData[i].count,
                    });
                  }
                }
              }
            );

            // Iterate loop to extract { sub_id : count } from fetched array
            for (let i = 0; i < sub_que.length; i++) {
              sub_id.push(sub_que[i].sub_id);
            }

            // Fetch questions from question_m table which are not attempted by student previously
            var sql =
              "SELECT * FROM question_m WHERE sub_id IN (" +
              sub_id.toString() +
              ") AND que_id != ALL (SELECT que_id FROM student_que WHERE stud_id = " +
              studID +
              " AND exam_id = " +
              examID +
              " AND given_ans IS NOT NULL)";
            connection_examSimulator.query(sql, function (err, data) {
              if (err) throw err;
              if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  data[i] = { givenAns: "", ...data[i] };
                }
                queData.push(data);
                queData = queData.flat();
                queData = shuffleResult(queData);

                //Filter Complexity & Questions Count From Set of Shuffled Questions.
                for (let i = 0; i < sub_que.length; i++) {
                  // Check if student had already attempted any questions or not
                  if (attemptedQue.length > 0) {
                    // To match attempted question's sub_id and current sub_id
                    let currentSubID = attemptedQue.filter(
                      (item) =>
                        parseInt(item.sub_id) === parseInt(sub_que[i].sub_id)
                    );
                    // Execute when student had attempted question of particular subject
                    if (currentSubID[i] != undefined) {
                      const result = queData
                        .filter(
                          (que) =>
                            parseInt(que.sub_id) === parseInt(sub_que[i].sub_id)
                        )
                        .slice(0, sub_que[i].count - currentSubID[0].count);
                      filteredQuestions.push(result);
                    }
                    // Execute when student had not attempted any question of particular subject
                    else {
                      const result = queData
                        .filter(
                          (que) =>
                            parseInt(que.sub_id) === parseInt(sub_que[i].sub_id)
                        )
                        .slice(0, sub_que[i].count);
                      filteredQuestions.push(result);
                    }
                  }
                  // Execute when student had not attempted any question of particular subject
                  else {
                    const result = queData
                      .filter(
                        (que) =>
                          parseInt(que.sub_id) === parseInt(sub_que[i].sub_id)
                      )
                      .slice(0, sub_que[i].count);
                    filteredQuestions.push(result);
                  }

                  // This will merge sub arrays into one array and shuffle the questions
                  filteredQuestions = filteredQuestions.flat();
                  filteredQuestions = shuffleResult(filteredQuestions);

                  // Check for last iteration of loop and send the response to the client
                  if (i + 1 == sub_que.length) {
                    if (filteredQuestions.length > 0) {
                      res.status(200).json({
                        status: true,
                        totalQue: filteredQuestions.length,
                        data: filteredQuestions,
                      });
                    } else {
                      res.status(400).json({
                        status: false,
                        message: "Questions Are Not Available!!",
                      });
                    }
                  }
                }
              }
            });
          } else {
            res.status(400).json({
              status: false,
              message: "Questions Are Not Available!!",
            });
          }
        });
      } else {
        res.status(400).json({
          status: false,
          message: "You Are Not Enrolled In This Exam!!",
        });
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
