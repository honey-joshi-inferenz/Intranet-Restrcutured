const models = require("../../../shared/models");
const { sequelize } = require("../../../../config/dbConfig");
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const { connection_reimbursement } = require("../../../../config/dbConfig");
const { validationResult } = require("express-validator");

const getTotalReimburse = async (req, res) => {
  try {
    const result = await models.reimburseTransactions.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("paid_amount")), "count"],
        [sequelize.fn("SUM", sequelize.col("paid_amount")), "total_amount"],
      ],
    });

    const { count, total_amount } = result.dataValues;

    return res.status(200).json({
      status: true,
      code: 200,
      data: {
        count: count || 0,
        total_amount: total_amount || 0,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occurred!!",
    });
  }
};

const getApprovedReimburse = async (req, res) => {
  try {
    const result = await models.reimburseTransactions.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("paid_amount")), "count"],
        [sequelize.fn("SUM", sequelize.col("paid_amount")), "total_amount"],
      ],
      where: {
        status: "Approved",
        final_status: "Payment Done",
      },
    });

    const { count, total_amount } = result.dataValues;

    return res.status(200).json({
      status: true,
      code: 200,
      data: {
        count: count || 0,
        total_amount: total_amount || 0,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occurred!!",
    });
  }
};

const getPendingReimburse = async (req, res) => {
  try {
    const result = await models.reimburseTransactions.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("paid_amount")), "count"],
        [sequelize.fn("SUM", sequelize.col("paid_amount")), "total_amount"],
      ],
      where: {
        status: "Approved",
        final_status: "Pending",
      },
    });

    const { count, total_amount } = result.dataValues;

    return res.status(200).json({
      status: true,
      code: 200,
      data: {
        count: count || 0,
        total_amount: total_amount || 0,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occurred!!",
    });
  }
};

const getRejectedReimburse = async (req, res) => {
  try {
    const result = await models.reimburseTransactions.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("paid_amount")), "count"],
        [sequelize.fn("SUM", sequelize.col("paid_amount")), "total_amount"],
      ],
      where: {
        [Op.or]: [{ status: "Rejected" }, { final_status: "Rejected" }],
      },
    });

    const { count, total_amount } = result.dataValues;

    return res.status(200).json({
      status: true,
      code: 200,
      data: {
        count: count || 0,
        total_amount: total_amount || 0,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal server error occurred!!",
    });
  }
};

module.exports = {
  getTotalReimburse,
  getApprovedReimburse,
  getPendingReimburse,
  getRejectedReimburse,
};
