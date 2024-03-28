"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_details", {
      product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "product_categories",
          key: "category_id",
        },
        allowNull: false,
      },
      subcategory_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "product_subcategories",
          key: "subcategory_id",
        },
      },
      account_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "uuid",
        },
        allowNull: false,
      },
      product_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      product_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      product_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      price_currency: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      product_attributes: {
        type: Sequelize.JSON,
      },
      brand_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      years_of_usage: {
        type: Sequelize.TEXT,
      },
      owners_count: {
        type: Sequelize.INTEGER,
      },
      specifications: {
        type: Sequelize.JSON,
      },
      product_material: {
        type: Sequelize.TEXT,
      },
      search_keywords: {
        type: Sequelize.JSON,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      thumbnail_image: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      product_images: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      approved_by: {
        type: Sequelize.TEXT,
      },
      action_date: {
        type: Sequelize.TEXT,
      },
      is_sold: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      sold_date: {
        type: Sequelize.TEXT,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_date: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_details");
  },
};
