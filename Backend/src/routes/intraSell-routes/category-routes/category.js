const { Router } = require("express");
const categoryControllers = require("../../../repository/intraSell/category/category");
const { imageUpload } = require("../../../middleware/utilities");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.post(
  "/addProductCategory",
  imageUpload.single("thumbnail_image"),
  auth.isLoggedIn,
  [
    check("category_name").notEmpty().withMessage("Category name is required!"),
    check("created_by").notEmpty().withMessage("Creator name is required!"),
  ],
  categoryControllers.addProductCategory
);

router.post(
  "/addCategoryAndSubCategory",
  auth.isLoggedIn,
  [
    check("category_name").notEmpty().withMessage("Category name is required!"),
    check("subCategories")
      .custom((value, { req }) => {
        var subCategories = req.body.subCategories;
        if (
          typeof subCategories === "object" &&
          subCategories &&
          Array.isArray(subCategories) &&
          subCategories.length > 0
        ) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage("Atleast one Subcategory is required!"),
    check("created_by").notEmpty().withMessage("Creator name is required!"),
  ],
  categoryControllers.addCategoryAndSubCategory
);

router.get(
  "/getProductCategoryById",
  auth.isLoggedIn,
  [
    check("category_id")
      .notEmpty()
      .withMessage("Product category id is required!"),
  ],
  categoryControllers.getProductCategoryById
);

router.get(
  "/getAllProductCategories",
  auth.isLoggedIn,
  categoryControllers.getAllProductCategories
);

router.get(
  "/getActiveProductCategories",
  auth.isLoggedIn,
  categoryControllers.getActiveProductCategories
);

router.get(
  "/getDeactiveProductCategories",
  auth.isLoggedIn,
  categoryControllers.getDeactiveProductCategories
);

router.put(
  "/updateProductCategory",
  imageUpload.single("thumbnail_image"),
  auth.isLoggedIn,
  [
    check("category_id")
      .notEmpty()
      .withMessage("Product category id is required!"),
  ],
  categoryControllers.updateProductCategory
);

router.put(
  "/updateCategoryAndSubCategory",
  auth.isLoggedIn,
  [
    check("category_id")
      .notEmpty()
      .withMessage("Product category id is required!"),
    check("updated_by").notEmpty().withMessage("Updator name is required!"),
  ],
  categoryControllers.updateCategoryAndSubCategory
);

router.put(
  "/updateCategoryAndSubCategoryStatus",
  auth.isLoggedIn,
  [
    check("category_id")
      .notEmpty()
      .withMessage("Product category id is required!"),
    check("is_active").notEmpty().withMessage("Active status is required!"),
  ],
  categoryControllers.updateCategoryAndSubCategoryStatus
);

module.exports = router;
