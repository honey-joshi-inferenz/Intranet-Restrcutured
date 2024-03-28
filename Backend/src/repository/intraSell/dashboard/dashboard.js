require("dotenv").config();
const models = require("../../../shared/models");
const { validationResult } = require("express-validator");
const jwtAuth = require("../../../middleware/authorization");
const { Sequelize, Op } = require("sequelize");

// It will fetch weekly buyes & sellers count.
const getWeeklyBuyersSellersCount = async (req, res) => {
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
      const today = new Date();
      var day = today.getDate() + 1;

      var weekStartDay = day - today.getDay();
      var weekEndDay = weekStartDay + 6;

      var weekStartDate = new Date(today.setDate(weekStartDay));
      var weekEndDate = new Date(today.setDate(weekEndDay));

      var weekDays = [];

      // Creating an array to add week dates and days accordingly
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStartDate);
        day.setDate(weekStartDate.getDate() + i);
        weekDays.push({
          day: day.toLocaleDateString("en-US", { weekday: "long" }),
          date: day.toISOString().split("T")[0],
        });
      }

      // Find weekly buyer count
      const buyersData = await models.productDetails.findAll({
        where: {
          sold_date: {
            [Op.gte]: weekStartDate,
            [Op.lte]: weekEndDate,
          },
        },
        attributes: [
          "sold_date",
          [Sequelize.fn("COUNT", Sequelize.col("product_id")), "buyerCount"],
        ],
        group: ["sold_date"],
      });

      // Find weekly seller count
      const sellersData = await models.productDetails.findAll({
        where: {
          created_date: {
            [Op.gte]: weekStartDate,
            [Op.lte]: weekEndDate,
          },
        },
        attributes: [
          "created_date",
          [Sequelize.fn("COUNT", Sequelize.col("product_id")), "sellerCount"],
        ],
        group: ["created_date"],
      });

      // Combine response of seller & buyer
      const buyersMap = new Map();
      const sellersMap = new Map();

      buyersData.forEach((item) => {
        const buyDate = item.getDataValue("sold_date");
        buyersMap.set(buyDate, {
          buyerCount: item.getDataValue("buyerCount"),
        });
      });

      sellersData.forEach((item) => {
        const sellDate = item.getDataValue("created_date");
        sellersMap.set(sellDate, {
          sellerCount: item.getDataValue("sellerCount"),
        });
      });

      // Final re-arrangement of buyers & sellers count with week dates.
      weekDays.forEach((item) => {
        const buyerRecord = buyersMap.get(item.date);
        const sellerRecord = sellersMap.get(item.date);

        if (buyerRecord) {
          item.buyerCount = buyerRecord.buyerCount;
        } else {
          item.buyerCount = 0;
        }

        if (sellerRecord) {
          item.sellerCount = sellerRecord.sellerCount;
        } else {
          item.sellerCount = 0;
        }
      });

      // Sending final response
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: weekDays,
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

// It will fetch category wise selling count.
const getCategoryWiseSellingCount = async (req, res) => {
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
      // Find seller count
      const sellersData = await models.productDetails.findAll({
        attributes: [
          [Sequelize.col("category.category_name"), "categoryName"],
          [Sequelize.fn("COUNT", Sequelize.col("product_id")), "sellerCount"],
        ],
        include: [
          {
            model: models.productCategories,
            as: "category",
            attributes: [],
          },
        ],
        group: [Sequelize.col("productDetails.category_id")],
      });

      // Sending final response
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Data retrieved successfully.",
        data: sellersData,
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

// It will fetch recently uploaded top 10 products.
const getRecentlyUploadedProducts = async (req, res) => {
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
      const productsData = await models.productDetails.findAll({
        attributes: {
          include: [
            [Sequelize.col("user.name"), "userName"],
            [Sequelize.col("category.category_name"), "categoryName"],
          ],
        },
        include: [
          {
            model: models.users,
            as: "user",
            attributes: [],
          },
          {
            model: models.productCategories,
            as: "category",
            attributes: [],
          },
        ],
        order: [["created_date", "DESC"]],
        limit: 10,
      });
      if (productsData.length > 0) {
        return res.status(200).json({
          status: true,
          code: 200,
          message: "Data retrieved successfully.",
          data: productsData,
        });
      }
      return res.status(404).json({
        status: false,
        code: 404,
        message: "There are no products available for sale!!",
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
  getWeeklyBuyersSellersCount,
  getCategoryWiseSellingCount,
  getRecentlyUploadedProducts,
};
