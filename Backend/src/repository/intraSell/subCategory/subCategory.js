require("dotenv").config();
const { CDN_URL, REGION, PROFILE, BUCKET, SECRET_KEY } = process.env;
const models = require("../../../shared/models");
const { validationResult } = require("express-validator");
const jwtAuth = require("../../../middleware/authorization");
const fs = require("fs");
var mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");
const regEx = /[`!@#$%^&*()+\-=\[\{};':"\\|,<>\/?~]/g;

const s3Client = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
});

// It will save product subcategory into the database.
const addProductSubCategory = async (req, res) => {
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
      var thumbnail_image = req.file;
      if (thumbnail_image) {
        var mimeType = mime.lookup(
          "./src/uploads/resumes/" + thumbnail_image.originalname
        );
        const bucketParams = {
          Bucket: BUCKET,
          Key:
            "Intranet/Product_Subcategories/" +
            thumbnail_image.originalname.replace(/ /g, "_").replace(regEx, ""),
          Body: fs.readFileSync(
            "./src/uploads/resumes/" + thumbnail_image.originalname
          ),
          ContentDisposition: "inline",
          ContentType: mimeType,
        };
        await s3Client.send(new PutObjectCommand(bucketParams)).catch((err) => {
          console.log(err);
        });
        fs.unlink(
          "./src/uploads/resumes/" + thumbnail_image.originalname,
          function (err) {
            if (err) return console.log(err);
          }
        );

        console.log(
          "Successfully uploaded object at : " + CDN_URL + bucketParams.Key
        );

        req.body.thumbnail_image = CDN_URL + bucketParams.Key;
      } else {
        req.body.thumbnail_image = null;
      }

      const data = {
        category_id: req.body.category_id,
        subcategory_name: req.body.subcategory_name,
        thumbnail_image: req.body.thumbnail_image,
        is_active: true,
        created_by: req.body.created_by,
        created_date: new Date().toISOString().split("T")[0],
        misc: req.body.misc,
      };

      var subCategory = await models.productSubcategories.findOne({
        where: { subcategory_name: data.subcategory_name },
      });
      if (subCategory) {
        return res.status(409).json({
          status: false,
          code: 409,
          message: "product subcategory already exist!!",
        });
      } else {
        subCategory = await models.productSubcategories.create(data);
        return res.status(200).json({
          status: true,
          code: 200,
          message: "product subcategory added successfully.",
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

// It will fetch product subcategory based on ID.
const getProductSubCategoryById = async (req, res) => {
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
      const { subcategory_id } = req.query;
      const subCategory = await models.productSubcategories.findOne({
        where: { subcategory_id },
      });
      if (subCategory) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: subCategory,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "product subcategory with the specified ID does not exist!!",
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

// It will fetch product subcategory based on ID.
const getProductSubCategoriesByCategoryId = async (req, res) => {
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
      const { category_id } = req.query;
      const subCategories = await models.productSubcategories.findAll({
        where: { category_id },
      });
      if (subCategories.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: subCategories,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message:
          "product subcategories with the specified category ID does not exist!!",
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

// It will fetch all product subCategories from the database.
const getAllProductSubCategories = async (req, res) => {
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
      const subCategories = await models.productSubcategories.findAll({
        order: [["subcategory_id", "DESC"]],
      });
      if (subCategories.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: subCategories,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Product subCategories does not exist!!",
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

// It will update product subcategory into the database.
const updateProductSubCategory = async (req, res) => {
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
      const { subcategory_id } = req.body;

      var thumbnail_image = req.file;
      if (thumbnail_image) {
        var mimeType = mime.lookup(
          "./src/uploads/resumes/" + thumbnail_image.originalname
        );
        const bucketParams = {
          Bucket: BUCKET,
          Key:
            "Intranet/Product_Subcategories/" +
            thumbnail_image.originalname.replace(/ /g, "_").replace(regEx, ""),
          Body: fs.readFileSync(
            "./src/uploads/resumes/" + thumbnail_image.originalname
          ),
          ContentDisposition: "inline",
          ContentType: mimeType,
        };
        await s3Client.send(new PutObjectCommand(bucketParams)).catch((err) => {
          console.log(err);
        });
        fs.unlink(
          "./src/uploads/resumes/" + thumbnail_image.originalname,
          function (err) {
            if (err) return console.log(err);
          }
        );

        console.log(
          "Successfully uploaded object at : " + CDN_URL + bucketParams.Key
        );

        req.body.thumbnail_image = CDN_URL + bucketParams.Key;
      }

      const [updated] = await models.productSubcategories.update(req.body, {
        where: { subcategory_id },
      });
      if (updated) {
        const updatedSubcategory = await models.productSubcategories.findOne({
          where: { subcategory_id },
        });
        return res.status(200).json({
          status: true,
          code: 200,
          message: "product subcategory updated successfully.",
          data: updatedSubcategory,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message:
            "product subcategory with the specified ID does not exists!!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

// It will delete product subcategory based on ID.
const deleteProductSubCategory = async (req, res) => {
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
      const { subcategory_id } = req.query;
      const deleted = await models.productSubcategories.destroy({
        where: { subcategory_id },
      });
      if (deleted) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "product subcategory deleted successfully.",
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message:
            "product subcategory with the specified ID does not exists!!",
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
  addProductSubCategory,
  getProductSubCategoryById,
  getProductSubCategoriesByCategoryId,
  getAllProductSubCategories,
  updateProductSubCategory,
  deleteProductSubCategory,
};
