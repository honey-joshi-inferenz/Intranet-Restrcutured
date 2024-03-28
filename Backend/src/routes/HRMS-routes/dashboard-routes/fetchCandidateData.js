const { workerData, parentPort } = require("worker_threads");
const { connection_hrms } = require("../../../config/dbConfig");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const PORT = process.env.SECRET_KEY || SECRET_KEY;
const Cryptr = require("cryptr");
const cryptr = new Cryptr(SECRET_KEY);

function fetchCandidateData() {
  const query =
    "SELECT *,CASE WHEN interviewer_name is null THEN 'Not Assigned' WHEN interviewer_name is not null THEN (SELECT name from users where email = interviewer_name AND role='Interviewer') END AS interviewer_name FROM interviewer_candidate WHERE referred_by IS NULL AND visible = true ORDER BY id DESC";

  connection_hrms.query(query, (err, data) => {
    if (err) throw err;

    for (let i = 0; i < data.length / workerData.thread_count; i++) {
      data[i].current_ctc = cryptr.decrypt(data[i].current_ctc);
      data[i].expected_ctc = cryptr.decrypt(data[i].expected_ctc);
      data[i].negotiated_ctc = cryptr.decrypt(data[i].negotiated_ctc);
      data[i].offered_salary = cryptr.decrypt(data[i].offered_salary);
      data[i].offered_bonus = cryptr.decrypt(data[i].offered_bonus);
      data[i].final_remarks = cryptr.decrypt(data[i].final_remarks);
    }

    // Send the processed data back to the main thread
    parentPort.postMessage(data);
  });
}
