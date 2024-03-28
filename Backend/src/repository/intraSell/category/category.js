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

// It will save product category into the database.
const addProductCategory = async (req, res) => {
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
            "Intranet/Product_Categories/" +
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
        category_name: req.body.category_name,
        thumbnail_image: req.body.thumbnail_image,
        is_active: true,
        created_by: req.body.created_by,
        created_date: new Date().toISOString().split("T")[0],
        misc: req.body.misc,
      };

      var category = await models.productCategories.findOne({
        where: { category_name: data.category_name },
      });
      if (category) {
        return res.status(409).json({
          status: false,
          code: 409,
          message: "Product category already exist!!",
        });
      } else {
        category = await models.productCategories.create(data);
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Product category added successfully.",
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

// It will save product category & it's subCategories into the database.
const addCategoryAndSubCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Parameters missing!!",
        data: errors.array(),
      });
    } else {
      var bucketParams = {};
      var productCategoryId;

      const categoryData = {
        category_name: req.body.category_name,
        thumbnail_image: null,
        is_active: true,
        created_by: req.body.created_by,
        created_date: new Date().toISOString().split("T")[0],
        misc: req.body.misc,
      };

      var category = await models.productCategories.findOne({
        where: {
          category_name: categoryData.category_name,
        },
      });
      if (category) {
        return res.status(409).json({
          status: false,
          code: 409,
          message: categoryData.category_name + " category already exists!!",
        });
      } else {
        category = await models.productCategories.create(categoryData);
        productCategoryId = category.dataValues.category_id;

        // Create subCategories of provided recently created category.
        var subCategories = req.body.subCategories;
        var productSubCategories = [];

        for (let i = 0; i < subCategories.length; i++) {
          const subCategoryData = {
            category_id: productCategoryId,
            subcategory_name: subCategories[i].subcategory_name,
            thumbnail_image: null,
            is_active: true,
            created_by: req.body.created_by,
            created_date: new Date().toISOString().split("T")[0],
            misc: req.body.misc,
          };

          var subCategory = await models.productSubcategories.findOne({
            where: {
              category_id: productCategoryId,
              subcategory_name: subCategories[i].subcategory_name,
            },
          });

          if (!subCategory) {
            subCategory = await models.productSubcategories.create(
              subCategoryData
            );
          }
          productSubCategories.push(subCategory);

          if (i + 1 == subCategories.length) {
            category = {
              ...category.dataValues,
              productSubCategories,
            };

            return res.status(200).json({
              status: true,
              code: 200,
              message: "Product category & subCategories added successfully.",
              data: category,
            });
          }
        }
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

// It will fetch product category based on ID.
const getProductCategoryById = async (req, res) => {
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
      const category = await models.productCategories.findOne({
        where: { category_id },
        include: [
          {
            model: models.productSubcategories,
            as: "subCategories",
          },
        ],
      });
      if (category) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: category,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Product category with the specified ID does not exist!!",
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

// It will fetch all product categories from the database.
const getAllProductCategories = async (req, res) => {
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
      const categories = await models.productCategories.findAll({
        include: [
          {
            model: models.productSubcategories,
            as: "subCategories",
          },
        ],
        order: [["category_id", "DESC"]],
      });
      if (categories.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: categories,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Product categories does not exist!!",
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

// It will fetch all active product categories from the database.
const getActiveProductCategories = async (req, res) => {
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
      const categories = await models.productCategories.findAll({
        where: { is_active: true },
        include: [
          {
            model: models.productSubcategories,
            as: "subCategories",
            where: { is_active: true },
          },
        ],
        order: [["category_id", "DESC"]],
      });
      if (categories.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: categories,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are no active product categories available!!",
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

// It will fetch all de-active product categories from the database.
const getDeactiveProductCategories = async (req, res) => {
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
      const categories = await models.productCategories.findAll({
        where: { is_active: false },
        include: [
          {
            model: models.productSubcategories,
            as: "subCategories",
            where: { is_active: false },
          },
        ],
        order: [["category_id", "DESC"]],
      });
      if (categories.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: categories,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are no deactive product categories available!!",
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

// It will update product category into the database.
const updateProductCategory = async (req, res) => {
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
      const { category_id } = req.body;

      var thumbnail_image = req.file;
      if (thumbnail_image) {
        var mimeType = mime.lookup(
          "./src/uploads/resumes/" + thumbnail_image.originalname
        );
        const bucketParams = {
          Bucket: BUCKET,
          Key:
            "Intranet/Product_Categories/" +
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

      const [updated] = await models.productCategories.update(req.body, {
        where: { category_id },
      });
      if (updated) {
        const updatedCategory = await models.productCategories.findOne({
          where: { category_id },
        });
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Product category updated successfully.",
          data: updatedCategory,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Product category with the specified ID does not exists!!",
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

// It will updated category and subcategories associated with parent category.
const updateCategoryAndSubCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Parameters missing!!",
        data: errors.array(),
      });
    } else {
      const { category_id, updated_by } = req.body;

      var category = await models.productCategories.findOne({
        where: { category_id },
      });

      if (category) {
        //Update category record based on productCategoryId
        await models.productCategories.update(
          { category_name: req.body.category_name },
          {
            where: { category_id },
          }
        );

        var updatedCategory = await models.productCategories.findOne({
          where: { category_id },
        });

        //Update Subcategories
        var subCategories = req.body.subCategories;
        var productSubCategories = [];

        for (let i = 0; i < subCategories.length; i++) {
          const subCategoryData = {
            category_id,
            subcategory_name: subCategories[i].subcategory_name,
            thumbnail_image: null,
            is_active: true,
            created_by: updated_by,
            created_date: new Date().toISOString().split("T")[0],
          };

          var subCategory = await models.productSubcategories.findOne({
            where: {
              subcategory_id: subCategories[i].subcategory_id,
            },
          });

          if (!subCategory) {
            subCategory = await models.productSubcategories.create(
              subCategoryData
            );
          } else {
            const subCategoryData = {
              subcategory_name: subCategories[i].subcategory_name,
            };
            subCategory = await models.productSubcategories.update(
              subCategoryData,
              {
                where: {
                  subcategory_id: subCategories[i].subcategory_id,
                },
              }
            );

            subCategory = await models.productSubcategories.findOne({
              where: {
                subcategory_id: subCategories[i].subcategory_id,
              },
            });
          }
          productSubCategories.push(subCategory);

          if (i + 1 == subCategories.length) {
            category = {
              ...updatedCategory.dataValues,
              productSubCategories,
            };

            return res.status(200).json({
              status: true,
              code: 200,
              message: "Product Category & SubCategories Updated Successfully.",
              data: category,
            });
          }
        }

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Product category updated successfully.",
          data: updatedCategory,
        });
      } else {
        return res.status(404).json({
          status: false,
          code: 404,
          message: "Product category with the specified ID does not exists2!!",
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

// It will update active status of product category & sub-categories based on ID.
const updateCategoryAndSubCategoryStatus = async (req, res) => {
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
      const { category_id, is_active } = req.query;

      // It will update active status of category based on ID.
      await models.productCategories.update(
        { is_active },
        {
          where: { category_id },
        }
      );

      // It will update active status of related sub-categories of parent category.
      await models.productSubcategories.update(
        { is_active },
        {
          where: { category_id },
        }
      );

      return res.status(200).json({
        status: true,
        code: 200,
        message:
          "Product category & subCategories status updated successfully.",
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

module.exports = {
  addProductCategory,
  addCategoryAndSubCategory,
  getProductCategoryById,
  getAllProductCategories,
  getActiveProductCategories,
  getDeactiveProductCategories,
  updateProductCategory,
  updateCategoryAndSubCategory,
  updateCategoryAndSubCategoryStatus,
};
