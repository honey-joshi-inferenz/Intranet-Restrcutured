require("dotenv").config();
const { CDN_URL, REGION, PROFILE, BUCKET, SECRET_KEY } = process.env;
const models = require("../../../shared/models");
const { validationResult } = require("express-validator");
const jwtAuth = require("../../../middleware/authorization");
const { sendEmail } = require("../../../middleware/utilities");
const fs = require("fs");
var mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");
const regEx = /[`!@#$%^&*()+\-=\[\{};':"\\|,<>\/?~]/g;

const s3Client = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
});

// It will save product details into the database.
const addNewProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      var thumbnailImageURL;
      var imageURLs = [];

      // Upload thumbnailImage on S3 bucket.
      if (!req.files.thumbnail_image) {
        thumbnailImageURL = null;
      } else {
        var thumbnail_image = req.files.thumbnail_image[0];

        var mimeType = mime.lookup(
          "./src/uploads/resumes/" + thumbnail_image.originalname
        );
        const thumbnailBucketParams = {
          Bucket: BUCKET,
          Key:
            "Intranet/Product_Thumbnails/" +
            thumbnail_image.originalname.replace(/ /g, "_").replace(regEx, ""),
          Body: fs.readFileSync(
            "./src/uploads/resumes/" + thumbnail_image.originalname
          ),
          ContentDisposition: "inline",
          ContentType: mimeType,
        };

        await s3Client
          .send(new PutObjectCommand(thumbnailBucketParams))
          .catch((err) => {
            console.log(err);
          });

        console.log(
          "Successfully uploaded object at : " +
            CDN_URL +
            thumbnailBucketParams.Key
        );

        thumbnailImageURL = CDN_URL + thumbnailBucketParams.Key;
        fs.unlink(
          "./src/uploads/resumes/" + thumbnail_image.originalname,
          function (err) {
            if (err) return console.log(err);
          }
        );
      }

      // Upload productImages on S3 bucket.
      if (!req.files.product_images) {
        imageURLs = [];
      } else {
        for (let i = 0; i < req.files.product_images.length; i++) {
          var product_image = req.files.product_images[i];

          var mimeType = mime.lookup(
            "./src/uploads/resumes/" + product_image.originalname
          );
          const bucketParams = {
            Bucket: BUCKET,
            Key:
              "Intranet/Product_Images/" +
              product_image.originalname.replace(/ /g, "_").replace(regEx, ""),
            Body: fs.readFileSync(
              "./src/uploads/resumes/" + product_image.originalname
            ),
            ContentDisposition: "inline",
            ContentType: mimeType,
          };

          await s3Client
            .send(new PutObjectCommand(bucketParams))
            .catch((err) => {
              console.log(err);
            });

          console.log(
            "Successfully uploaded object at : " + CDN_URL + bucketParams.Key
          );

          imageURLs.push(CDN_URL + bucketParams.Key);

          fs.unlink(
            "./src/uploads/resumes/" + product_image.originalname,
            function (err) {
              if (err) return console.log(err);
            }
          );
        }
      }

      const data = {
        category_id: req.body.category_id,
        subcategory_id: req.body.subcategory_id,
        account_id: req.body.account_id,
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        price_currency: req.body.price_currency,
        product_attributes:
          req.body.productAttributes != "" &&
          req.body.productAttributes != undefined &&
          req.body.productAttributes != "{}" &&
          req.body.productAttributes != {}
            ? JSON.parse(req.body.productAttributes)
            : {},
        brand_name: req.body.brand_name,
        years_of_usage: req.body.years_of_usage,
        owners_count: req.body.owners_count,
        specifications:
          req.body.specifications != "" &&
          req.body.specifications != undefined &&
          req.body.specifications != "undefined"
            ? JSON.stringify(req.body.specifications.split(","))
            : [],
        product_material: req.body.product_material,
        search_keywords:
          req.body.searchKeywords != "" &&
          req.body.searchKeywords != undefined &&
          req.body.searchKeywords != "undefined"
            ? JSON.stringify(req.body.searchKeywords.split(","))
            : [],
        quantity:
          req.body.quantity != "" &&
          req.body.quantity != null &&
          req.body.quantity != undefined
            ? req.body.quantity
            : 0,
        thumbnail_image: thumbnailImageURL,
        product_images: JSON.stringify(imageURLs),
        is_approved: false,
        is_sold: false,
        is_active: true,
        created_date: new Date().toISOString().split("T")[0],
        misc: req.body.misc,
      };

      console.log(data);
      var product = await models.productDetails.findOne({
        where: { account_id: data.account_id, product_name: data.product_name },
      });
      if (product) {
        return res.status(409).json({
          status: false,
          code: 409,
          message: "Product already exist!!",
        });
      } else {
        product = await models.productDetails.create(data);

        const accountUser = await models.users.findOne({
          where: { uuid: data.account_id },
        });

        // Send product added confirmation Email to product owner
        var subject = "Product Upload Verification";
        var msgBody = `Dear ${accountUser.dataValues.name},\n\nThank you for uploading a new product on IntraSell. We appreciate your contribution to our platform.\n\nTo ensure the quality and accuracy of the products listed on IntraSell, we would like to inform you that your uploaded product is currently under review. Our team will carefully assess the details provided to ensure compliance with our standards.\n\nOnce the review process is complete and management approves your product, you will receive a confirmation email. Additionally, all other employees will be notified about the new product launch through email.\n\nWe appreciate your cooperation in maintaining the quality of our product listings.\n\nBest regards,\nTeam HR`;
        sendEmail(accountUser.dataValues.email, subject, msgBody);

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Product added successfully.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will fetch product details based on ID.
const getProductById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { product_id } = req.query;
      const product = await models.productDetails.findOne({
        where: { product_id },
        include: [
          { model: models.users, as: "user" },
          { model: models.productCategories, as: "category" },
        ],
      });
      if (product) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: product,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Product with the specified ID does not exist!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will fetch uploaded products by current loggedIn user.
const getMyProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { account_id } = req.query;
      const products = await models.productDetails.findAll({
        where: { account_id },
        include: [{ model: models.productCategories, as: "category" }],
        order: [["product_id", "DESC"]],
      });
      if (products.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: products,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "You have not uploaded any products yet!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will fetch all product details from the database.
const getAllProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const products = await models.productDetails.findAll({
        include: [
          { model: models.users, as: "user" },
          { model: models.productCategories, as: "category" },
        ],
        order: [["product_id", "DESC"]],
      });
      if (products.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: products,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Product does not exist!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will fetch all approved product details from the database.
const getApprovedProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const products = await models.productDetails.findAll({
        where: { is_approved: true },
        include: [
          { model: models.users, as: "user" },
          { model: models.productCategories, as: "category" },
        ],
        order: [["product_id", "DESC"]],
      });
      if (products.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: products,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are no approved products available!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

// It will update product details into the database.
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { product_id } = req.body;

      var thumbnailImageURL = null;
      var imageURLs = [];

      const product = await models.productDetails.findOne({
        where: { product_id },
      });

      if (product) {
        // // Data formatting for product_attributes
        req.body.product_attributes =
          req.body.product_attributes !== undefined
            ? JSON.parse(req.body.product_attributes)
            : typeof product.dataValues.product_attributes === "string" &&
              product.dataValues.product_attributes.trim() !== "{}"
            ? JSON.parse(product.dataValues.product_attributes)
            : {};

        // Data formatting for specifications
        req.body.specifications =
          req.body.specifications !== undefined &&
          req.body.specifications.trim() !== "[]"
            ? JSON.stringify(req.body.specifications.split(","))
            : [];

        // Data formatting for search_keywords
        req.body.search_keywords =
          req.body.search_keywords !== undefined &&
          req.body.search_keywords.trim() !== "[]"
            ? JSON.stringify(req.body.search_keywords.split(","))
            : [];

        // Upload thumbnailImage on S3 bucket.
        if (!req.files.thumbnail_image) {
          thumbnailImageURL = product.dataValues.thumbnail_image;
        } else {
          var thumbnail_image = req.files.thumbnail_image[0];

          var mimeType = mime.lookup(
            "./src/uploads/resumes/" + thumbnail_image.originalname
          );
          const thumbnailBucketParams = {
            Bucket: BUCKET,
            Key:
              "Intranet/Product_Thumbnails/" +
              thumbnail_image.originalname
                .replace(/ /g, "_")
                .replace(regEx, ""),
            Body: fs.readFileSync(
              "./src/uploads/resumes/" + thumbnail_image.originalname
            ),
            ContentDisposition: "inline",
            ContentType: mimeType,
          };

          await s3Client
            .send(new PutObjectCommand(thumbnailBucketParams))
            .catch((err) => {
              console.log(err);
            });

          console.log(
            "Successfully uploaded object at : " +
              CDN_URL +
              thumbnailBucketParams.Key
          );

          thumbnailImageURL = CDN_URL + thumbnailBucketParams.Key;
          fs.unlink(
            "./src/uploads/resumes/" + thumbnail_image.originalname,
            function (err) {
              if (err) return console.log(err);
            }
          );
        }

        // Upload productImages on S3 bucket.
        if (!req.files.product_images) {
          imageURLs = product.dataValues.product_images;
        } else {
          for (let i = 0; i < req.files.product_images.length; i++) {
            var product_image = req.files.product_images[i];

            var mimeType = mime.lookup(
              "./src/uploads/resumes/" + product_image.originalname
            );
            const bucketParams = {
              Bucket: BUCKET,
              Key:
                "Intranet/Product_Images/" +
                product_image.originalname
                  .replace(/ /g, "_")
                  .replace(regEx, ""),
              Body: fs.readFileSync(
                "./src/uploads/resumes/" + product_image.originalname
              ),
              ContentDisposition: "inline",
              ContentType: mimeType,
            };

            await s3Client
              .send(new PutObjectCommand(bucketParams))
              .catch((err) => {
                console.log(err);
              });

            console.log(
              "Successfully uploaded object at : " + CDN_URL + bucketParams.Key
            );

            imageURLs.push(CDN_URL + bucketParams.Key);

            fs.unlink(
              "./src/uploads/resumes/" + product_image.originalname,
              function (err) {
                if (err) return console.log(err);
              }
            );
          }
        }

        req.body.thumbnail_image = thumbnailImageURL;
        req.body.product_images = !req.files.product_images
          ? imageURLs
          : JSON.stringify(imageURLs);

        const [updated] = await models.productDetails.update(req.body, {
          where: { product_id },
        });

        const updatedProduct = await models.productDetails.findOne({
          where: { product_id },
        });
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Product details updated successfully.",
          data: updatedProduct,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

// It will update product details into the database.
const verifyProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { product_id, is_approved, approved_by } = req.body;
      var subject, msgBody;
      const action_date = new Date()
        .toISOString()
        .slice(0, 23)
        .replace("T", " ");

      const product = await models.productDetails.findOne({
        where: { product_id },
        include: [
          {
            model: models.users,
            as: "user",
          },
        ],
      });

      if (product) {
        var userDetails = {
          name: product.dataValues.user.dataValues.name,
          email: product.dataValues.user.dataValues.email,
        };

        await models.productDetails.update(
          { is_approved, approved_by, action_date },
          {
            where: { product_id },
          }
        );

        const updatedProduct = await models.productDetails.findOne({
          where: { product_id },
        });

        if (is_approved) {
          var subject = "Product Approval Confirmation";
          var msgBody = `Dear ${userDetails.name},\n\nCongratulations! Your recently uploaded product on IntraSell has been reviewed and approved by our management team.\n\nWe are pleased to inform you that your product has met our quality standards, and it is now ready for sale on our platform. You will receive a confirmation email shortly.\n\nIn addition to your approval confirmation, all other employees will be notified about the new product launch through email. We appreciate your contribution to our product catalog and look forward to its success on IntraSell.\n\nThank you for your dedication and hard work.\n\nBest regards,\nTeam HR`;
          sendEmail(userDetails.email, subject, msgBody);
        } else {
          var subject = "Product Upload Rejection Notification";
          var msgBody = `Dear ${userDetails.name},\n\nWe regret to inform you that your recent product upload on IntraSell has not been approved by our management team.\n\nUpon review, it was found that the product did not meet our quality standards. Therefore, we cannot proceed with its approval for sale on our platform.\n\nWe appreciate your effort in contributing to our product catalog. However, we encourage you to review the product's details and make necessary improvements before resubmitting it for approval.\n\nIf you have any questions or need further clarification regarding the rejection, please don't hesitate to reach out to us.\n\nThank you for your understanding.\n\nBest regards,\nTeam HR`;
          sendEmail(userDetails.email, subject, msgBody);
        }

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Product approval status updated successfully.",
          data: updatedProduct,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

// It will delete product details based on ID.
const deleteProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "prameters missing!!",
        data: errors.array(),
      });
    } else {
      const { product_id } = req.query;
      const deleted = await models.productDetails.destroy({
        where: { product_id },
      });
      if (deleted) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Product deleted successfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Product with the specified ID does not exists!!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occured!!",
    });
  }
};

module.exports = {
  addNewProduct,
  getProductById,
  getMyProducts,
  getAllProducts,
  getApprovedProducts,
  updateProduct,
  verifyProduct,
  deleteProduct,
};
