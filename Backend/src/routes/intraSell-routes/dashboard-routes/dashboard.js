const { Router } = require("express");
const dashboardControllers = require("../../../repository/intraSell/dashboard/dashboard");
const auth = require("../../../middleware/authorization");
const router = Router();

router.get(
  "/getWeeklyBuyersSellersCount",
  auth.isLoggedIn,
  dashboardControllers.getWeeklyBuyersSellersCount
);

router.get(
  "/getCategoryWiseSellingCount",
  auth.isLoggedIn,
  dashboardControllers.getCategoryWiseSellingCount
);

router.get(
  "/getRecentlyUploadedProducts",
  auth.isLoggedIn,
  dashboardControllers.getRecentlyUploadedProducts
);

module.exports = router;
