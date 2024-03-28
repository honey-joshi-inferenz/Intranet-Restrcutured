const { Router } = require("express");
const categoryRoutes = require("../category-routes/category");
const subCategoryRoutes = require("../subCategory-routes/subCategory");
const productDetailsRoutes = require("../productDetails-routes/productDetails");
const dashboardRoutes = require("../dashboard-routes/dashboard");

const router = Router();

router.use("/category", categoryRoutes);
router.use("/subCategory", subCategoryRoutes);
router.use("/productDetails", productDetailsRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
