"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productSubcategories extends Model {
    static associate(models) {
      productSubcategories.belongsTo(models.productCategories, {
        foreignKey: "category_id",
        as: "category",
        targetKey: "category_id",
      });
      productSubcategories.hasMany(models.productDetails, {
        foreignKey: "subcategory_id",
        as: "products",
        sourceKey: "subcategory_id",
      });
    }
  }
  productSubcategories.init(
    {
      subcategory_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subcategory_name: {
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
      modelName: "productSubcategories",
      tableName: "product_subcategories",
      timestamps: false,
    }
  );
  return productSubcategories;
};
