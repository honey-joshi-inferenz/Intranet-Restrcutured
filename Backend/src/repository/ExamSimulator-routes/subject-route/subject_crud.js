const express = require("express");
const router = express.Router();
const { connection_examSimulator } = require("../../../config/dbConfig");

// It will declare new subject into the system.
router.post("/addSubject", (req, res) => {
  var name = req.body.sub_name;

  try {
    var sqlquery = "SELECT * FROM subject_m WHERE name = ? ";
    connection_examSimulator.query(sqlquery, [name], function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res
          .status(400)
          .json({ status: false, message: name + " Already Inserted!!" });
      } else {
        var sqlquery = "INSERT INTO subject_m SET name=?";
        connection_examSimulator.query(sqlquery, [name], function (err) {
          if (err) {
            console.log(err);
            res
              .status(400)
              .json({
                status: false,
                message: "Something Went Wrong While Interact With Database!!",
              });
          } else {
            res
              .status(200)
              .json({
                status: true,
                message: "Subject Inserted Successfully.",
              });
          }
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

// It will fetch all the Subjects from the database.
router.post("/fetchSubject", (req, res) => {
  try {
    var subID = req.body.sub_id;
    var sql = "SELECT * FROM subject_m WHERE sub_id = " + subID;
    connection_examSimulator.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ status: true, data });
      } else {
        res.status(400).json({ status: false, message: "Subject Not Found!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will fetch all the Subjects from the database.
router.get("/fetchAllSubjects", (req, res) => {
  try {
    var sql = "SELECT * FROM subject_m ORDER BY sub_id DESC";
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
          .json({ status: false, message: "Subjects Are Not Declared Yet!!" });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Internal Server Error occured!!" });
  }
});

// It will update the subject details based on subject id.
router.post("/updateSubject", (req, res) => {
  try {
    const subjectDetails = req.body;
    const sqlQ = "SELECT * FROM subject_m WHERE sub_id = ?";
    connection_examSimulator.query(
      sqlQ,
      [subjectDetails.sub_id],
      function (err, data) {
        if (err) throw err;
        if (data.length > 0) {
          const sql = "UPDATE subject_m SET name = ? where sub_id = ?";
          connection_examSimulator.query(
            sql,
            [subjectDetails.sub_name, subjectDetails.sub_id],
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
                    message: "Subject Details Updated Successfully.",
                  });
              }
            }
          );
        } else {
          res
            .status(201)
            .json({ status: 201, message: "Subject Doesn't Exists!!" });
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

// It will delete the subject details based on subject id.
router.post("/deleteSubject", (req, res) => {
  try {
    const subjectID = req.body.sub_id;
    const sqlQ = "SELECT * FROM subject_m WHERE sub_id = ?";
    connection_examSimulator.query(sqlQ, [subjectID], function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        const sql = "DELETE FROM subject_m where sub_id = ?";
        connection_examSimulator.query(sql, [subjectID], function (err, data) {
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
              .json({ status: 200, message: "Subject Deleted Successfully." });
          }
        });
      } else {
        res
          .status(201)
          .json({ status: 201, message: "Subject Doesn't Exists!!" });
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
