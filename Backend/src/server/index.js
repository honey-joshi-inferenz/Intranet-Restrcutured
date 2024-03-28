require("../../config/dbConfig");
const express = require("express");
const app = express();
const path = require("path");
var cors = require("cors");

const userAccountsRoutes = require("../../src/routes/HRMS-routes/authentication-routes/auth");
const dashboardRoutes = require("../../src/routes/HRMS-routes/dashboard-routes/statistics");
const hrMetricsRoutes = require("../../src/routes/HRMS-routes/hrMetrics-routes/hrMetrics");
const dropdownRoutes = require("../../src/routes/HRMS-routes/dropdown-routes/dropdown");
const resumeRoutes = require("../../src/routes/HRMS-routes/resume-routes/resumeOperations");
const candidateRoutes = require("../../src/routes/HRMS-routes/candidate-routes/candidate");
const referralRoutes = require("../../src/routes/HRMS-routes/referral-routes/referral");
const reimbursementRoutes = require("../../src/routes/Reimbursement-routes/master-routes");
const intraSellRoutes = require("../../src/routes/intraSell-routes/master-routes");

// Require Configuration For NodeJS
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "20mb" }));
app.use(express.static(path.join("./", "uploads")));
app.use("/uploads", express.static(path.resolve(__dirname + "/src/uploads")));

app.get("/", (req, res) => {
  res.send("App Running Successfully..");
});

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: true,
    code: 200,
    message: "OK",
  });
});

app.use("/userAccounts", userAccountsRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/hrmetrics", hrMetricsRoutes);
app.use("/dropdown", dropdownRoutes);
app.use("/resume", resumeRoutes);
app.use("/candidate", candidateRoutes);
app.use("/referral", referralRoutes);
app.use("/reimbursement", reimbursementRoutes);
app.use("/intraSell", intraSellRoutes);

app.all("*", (req, res) => {
  return res.status(404).json({
    status: false,
    code: 404,
    message: "Requested endpoint not found at server!!",
  });
});

module.exports = app;
