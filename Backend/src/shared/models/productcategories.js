"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productCategories extends Model {
    static associate(models) {
      productCategories.hasMany(models.productSubcategories, {
        foreignKey: "category_id",
        as: "subCategories",
        sourceKey: "category_id",
      });
      productCategories.hasMany(models.productDetails, {
        foreignKey: "category_id",
        as: "products",
        sourceKey: "category_id",
      });
    }
  }
  productCategories.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      category_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail_image: {
        type: DataTypes.TEXT,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "productCategories",
      tableName: "product_categories",
      timestamps: false,
    }
  );
  return productCategories;
};
