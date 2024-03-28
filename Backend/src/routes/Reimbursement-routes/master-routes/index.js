const { Router } = require("express");
const requestRoutes = require("../request-routes/request");
const dashboardRoutes = require("../dashboard-routes/statistics");

const router = Router();

router.use("/request", requestRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
