"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productDetails extends Model {
    static associate(models) {
      productDetails.belongsTo(models.productCategories, {
        foreignKey: "category_id",
        as: "category",
        targetKey: "category_id",
      });
      productDetails.belongsTo(models.productSubcategories, {
        foreignKey: "subcategory_id",
        as: "subCategory",
        targetKey: "subcategory_id",
      });
      productDetails.belongsTo(models.users, {
        foreignKey: "account_id",
        as: "user",
        targetKey: "uuid",
      });
    }
  }
  productDetails.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subcategory_id: {
        type: DataTypes.INTEGER,
      },
      account_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      product_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      product_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price_currency: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      product_attributes: {
        type: DataTypes.JSON,
        get: function () {
          const rawValue = this.getDataValue("product_attributes");
          try {
            return rawValue ? JSON.parse(rawValue) : null;
          } catch (error) {
            console.error(`Error parsing product_attributes: ${error.message}`);
            return null;
          }
        },
      },
      brand_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      years_of_usage: {
        type: DataTypes.TEXT,
      },
      owners_count: {
        type: DataTypes.INTEGER,
      },
      specifications: {
        type: DataTypes.JSON,
        get: function () {
          const rawValue = this.getDataValue("specifications");
          try {
            return rawValue ? JSON.parse(rawValue) : null;
          } catch (error) {
            console.error(`Error parsing specifications: ${error.message}`);
            return null;
          }
        },
      },
      product_material: {
        type: DataTypes.TEXT,
      },
      search_keywords: {
        type: DataTypes.JSON,
        get: function () {
          const rawValue = this.getDataValue("search_keywords");
          try {
            return rawValue ? JSON.parse(rawValue) : null;
          } catch (error) {
            console.error(`Error parsing search_keywords: ${error.message}`);
            return null;
          }
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      thumbnail_image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      product_images: {
        type: DataTypes.TEXT,
        allowNull: false,
        get: function () {
          const rawValue = this.getDataValue("product_images");
          try {
            return rawValue ? JSON.parse(rawValue) : null;
          } catch (error) {
            console.error(`Error parsing product_images: ${error.message}`);
            return null;
          }
        },
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      approved_by: {
        type: DataTypes.TEXT,
      },
      action_date: {
        type: DataTypes.TEXT,
      },
      is_sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      sold_date: {
        type: DataTypes.TEXT,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "productDetails",
      tableName: "product_details",
      timestamps: false,
    }
  );
  return productDetails;
};
