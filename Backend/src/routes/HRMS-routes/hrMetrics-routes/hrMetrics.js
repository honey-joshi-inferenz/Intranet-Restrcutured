const { Router } = require("express");
const router = Router();
const hrMetricsController = require("../../../repository/HRMS/hrMetrics/hrMetrics");
const auth = require("../../../middleware/authorization");

router.get(
  "/getHeadcountsByOwner",
  auth.isLoggedIn,
  hrMetricsController.getCountsByOwner
);

router.get(
  "/getHeadcountsByPosition",
  auth.isLoggedIn,
  hrMetricsController.getCountsByPosition
);

router.get(
  "/getUpcomingJoiners",
  auth.isLoggedIn,
  hrMetricsController.getUpcomingJoiner
);

router.get(
  "/getHeadcountsByResumeSource",
  auth.isLoggedIn,
  hrMetricsController.getCountsByResumeSource
);

router.get(
  "/getHeadcountsByMonth",
  auth.isLoggedIn,
  hrMetricsController.getCountByMonth
);

router.get(
  "/getHeadcountsByHrStatus",
  auth.isLoggedIn,
  hrMetricsController.getCountsByHrStatus
);

router.get(
  "/getHeadcountsByFinalStatus",
  auth.isLoggedIn,
  hrMetricsController.getCountsByFinalStatus
);

router.get(
  "/getHeadcountsByInterviewRounds",
  auth.isLoggedIn,
  hrMetricsController.getCountsByInterviewRounds
);

module.exports = router;
