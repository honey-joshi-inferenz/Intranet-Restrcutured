const { Router } = require("express");
const subCategoryControllers = require("../../../repository/intraSell/subCategory/subCategory");
const { imageUpload } = require("../../../middleware/utilities");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.post(
  "/addProductSubCategory",
  imageUpload.single("thumbnail_image"),
  auth.isLoggedIn,
  [
    check("category_id")
      .notEmpty()
      .withMessage("Product category id is required!"),
    check("subcategory_name")
      .notEmpty()
      .withMessage("Subcategory name is required!"),
    check("created_by").notEmpty().withMessage("Creator name is required!"),
  ],
  subCategoryControllers.addProductSubCategory
);

router.get(
  "/getProductSubCategoryById",
  auth.isLoggedIn,
  [
    check("subcategory_id")
      .notEmpty()
      .withMessage("Product subcategory id is required!"),
  ],
  subCategoryControllers.getProductSubCategoryById
);

router.get(
  "/getProductSubCategoriesByCategoryId",
  auth.isLoggedIn,
  [
    check("category_id")
      .notEmpty()
      .withMessage("Product category id is required!"),
  ],
  subCategoryControllers.getProductSubCategoriesByCategoryId
);

router.get(
  "/getAllProductSubCategories",
  auth.isLoggedIn,
  subCategoryControllers.getAllProductSubCategories
);

router.put(
  "/updateProductSubCategory",
  imageUpload.single("thumbnail_image"),
  auth.isLoggedIn,
  [
    check("subcategory_id")
      .notEmpty()
      .withMessage("Product subcategory id is required!"),
  ],
  subCategoryControllers.updateProductSubCategory
);

router.delete(
  "/deleteProductSubCategory",
  auth.isLoggedIn,
  [
    check("subcategory_id")
      .notEmpty()
      .withMessage("Product subcategory id is required!"),
  ],
  subCategoryControllers.deleteProductSubCategory
);

module.exports = router;
