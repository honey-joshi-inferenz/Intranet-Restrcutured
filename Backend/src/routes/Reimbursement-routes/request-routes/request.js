const { Router } = require("express");
const requestControllers = require("../../../repository/reimbursement/request/request");
const { invoiceUpload } = require("../../../middleware/utilities");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.post(
  "/addNewRequest",
  invoiceUpload.single("invoice"),
  check("invoice")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Invoice is required!"),
  check("account_id").notEmpty().withMessage("User id is required!"),
  check("purpose_of_expenditure")
    .notEmpty()
    .withMessage("Purpose of expenditure is required!"),
  check("date_of_expense")
    .notEmpty()
    .withMessage("Date of expense is required!"),
  check("paid_amount").notEmpty().withMessage("Paid amount is required!"),
  auth.isLoggedIn,
  requestControllers.addNewRequest
);

router.get(
  "/getRequestById",
  check("transaction_id").notEmpty().withMessage("Request id is required!"),
  auth.isLoggedIn,
  requestControllers.getRequestById
);

router.get(
  "/getMyReimbursements",
  check("account_id").notEmpty().withMessage("User id is required!"),
  auth.isLoggedIn,
  requestControllers.getMyReimbursements
);

router.get(
  "/getApprovedRequests",
  auth.isLoggedIn,
  requestControllers.getApprovedRequests
);

router.get(
  "/getRejectedRequests",
  auth.isLoggedIn,
  requestControllers.getRejectedRequests
);

router.get(
  "/getAllRequests",
  auth.isLoggedIn,
  requestControllers.getAllRequests
);

router.put(
  "/updateStatusByHR",
  [
    check("transaction_id").notEmpty().withMessage("Request id is required!"),
    check("status").notEmpty().withMessage("Status is required!"),
    check("hr_approved_by")
      .notEmpty()
      .withMessage("Approver name is required!"),
  ],
  auth.isLoggedIn,
  requestControllers.updateStatusByHR
);

router.put(
  "/updateStatusByAdmin",
  [
    check("transaction_id").notEmpty().withMessage("Request id is required!"),
    check("final_status").notEmpty().withMessage("Final status is required!"),
    check("admin_approved_by")
      .notEmpty()
      .withMessage("Approver name is required!"),
  ],
  auth.isLoggedIn,
  requestControllers.updateStatusByAdmin
);

router.put(
  "/updateRequest",
  invoiceUpload.single("invoice"),
  check("transaction_id").notEmpty().withMessage("Request id is required!"),
  auth.isLoggedIn,
  requestControllers.updateRequest
);

router.delete(
  "/deleteRequest",
  check("transaction_id").notEmpty().withMessage("Request id is required!"),
  auth.isLoggedIn,
  requestControllers.deleteRequest
);

module.exports = router;
