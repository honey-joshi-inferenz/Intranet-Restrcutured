const { Router } = require("express");
const dashboardControllers = require("../../../repository/reimbursement/dashboard/statistics");
const auth = require("../../../middleware/authorization");
const router = Router();

router.get(
  "/getTotalReimburse",
  auth.isLoggedIn,
  dashboardControllers.getTotalReimburse
);

router.get(
  "/getApprovedReimburse",
  auth.isLoggedIn,
  dashboardControllers.getApprovedReimburse
);

router.get(
  "/getPendingReimburse",
  auth.isLoggedIn,
  dashboardControllers.getPendingReimburse
);

router.get(
  "/getRejectedReimburse",
  auth.isLoggedIn,
  dashboardControllers.getRejectedReimburse
);

module.exports = router;
