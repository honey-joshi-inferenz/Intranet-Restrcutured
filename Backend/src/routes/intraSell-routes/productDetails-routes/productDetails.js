const { Router } = require("express");
const productDetailsControllers = require("../../../repository/intraSell/productDetails/productDetails");
const { imageUpload } = require("../../../middleware/utilities");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.post(
  "/addNewProduct",
  imageUpload.fields([
    {
      name: "thumbnail_image",
      maxCount: 1,
    },
    {
      name: "product_images",
      maxCount: 5,
    },
  ]),
  auth.isLoggedIn,
  [
    check("category_id")
      .notEmpty()
      .withMessage("Product category id is required!"),
    check("account_id").notEmpty().withMessage("User id is required!"),
    check("product_name").notEmpty().withMessage("Product name is required!"),
    check("product_description")
      .notEmpty()
      .withMessage("Product description is required!"),
    check("product_price").notEmpty().withMessage("Product price is required!"),
    check("price_currency")
      .notEmpty()
      .withMessage("Price currency is required!"),
    check("brand_name").notEmpty().withMessage("Brand name is required!"),
    check("thumbnail_image").custom((value, { req }) => {
      if (!req.files.thumbnail_image)
        throw new Error("Thumbnail image is required!");
      return true;
    }),
    check("product_images").custom((value, { req }) => {
      if (!req.files.product_images)
        throw new Error("Product image is required!");
      return true;
    }),
  ],
  productDetailsControllers.addNewProduct
);

router.get(
  "/getProductById",
  auth.isLoggedIn,
  [check("product_id").notEmpty().withMessage("Product id is required!")],
  productDetailsControllers.getProductById
);

router.get(
  "/getMyProducts",
  auth.isLoggedIn,
  [check("account_id").notEmpty().withMessage("Account id is required!")],
  productDetailsControllers.getMyProducts
);

router.get(
  "/getAllProducts",
  auth.isLoggedIn,
  productDetailsControllers.getAllProducts
);

router.get(
  "/getApprovedProducts",
  auth.isLoggedIn,
  productDetailsControllers.getApprovedProducts
);

router.put(
  "/updateProduct",
  imageUpload.fields([
    {
      name: "thumbnail_image",
      maxCount: 1,
    },
    {
      name: "product_images",
      maxCount: 5,
    },
  ]),
  auth.isLoggedIn,
  [check("product_id").notEmpty().withMessage("Product id is required!")],
  productDetailsControllers.updateProduct
);

router.put(
  "/verifyProduct",
  [
    check("product_id").notEmpty().withMessage("Product id is required!"),
    check("is_approved").notEmpty().withMessage("Approval status is required!"),
    check("approved_by").notEmpty().withMessage("Approver name is required!"),
  ],
  auth.isLoggedIn,
  productDetailsControllers.verifyProduct
);

router.delete(
  "/deleteProduct",
  auth.isLoggedIn,
  [check("product_id").notEmpty().withMessage("Product id is required!")],
  productDetailsControllers.deleteProduct
);

module.exports = router;
