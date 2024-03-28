const { Router } = require("express");
const dashboardControllers = require("../../../repository/HRMS/dashboard/statistics");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.get(
  "/getActiveApplications",
  auth.isLoggedIn,
  dashboardControllers.getActiveApplications
);

router.get(
  "/getApplicationStatistics",
  auth.isLoggedIn,
  dashboardControllers.getApplicationStatistics
);

router.get(
  "/getConfirmedApplications",
  auth.isLoggedIn,
  dashboardControllers.getConfirmedApplications
);

router.get(
  "/getLastMonthApplications",
  auth.isLoggedIn,
  dashboardControllers.getLastMonthApplications
);

router.get(
  "/getCurrentMonthApplications",
  auth.isLoggedIn,
  dashboardControllers.getCurrentMonthApplications
);

router.get(
  "/getTodayApplications",
  auth.isLoggedIn,
  dashboardControllers.getTodayApplications
);

router.get(
  "/getApplicationsBetweenDates",
  [
    check("from_date").notEmpty().withMessage("From date is required!"),
    check("to_date").notEmpty().withMessage("To date is required!"),
  ],
  auth.isLoggedIn,
  dashboardControllers.getApplicationsBetweenDates
);

router.get(
  "/getInProgressApplications",
  auth.isLoggedIn,
  dashboardControllers.getInProgressApplications
);

router.get(
  "/getPendingApplications",
  auth.isLoggedIn,
  dashboardControllers.getPendingApplications
);

router.get(
  "/getJoinedApplications",
  auth.isLoggedIn,
  dashboardControllers.getJoinedApplications
);

router.get(
  "/getAllCandidatesData",
  auth.isLoggedIn,
  dashboardControllers.getAllCandidatesData
);

router.get(
  "/getAssignedCandidates",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("Interviewer UUID is required!"),
  dashboardControllers.getAssignedCandidates
);

router.get(
  "/getCompletedApplications",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("Interviewer UUID is required!"),
  dashboardControllers.getCompletedApplications
);

module.exports = router;
