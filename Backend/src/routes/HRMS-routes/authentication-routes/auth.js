const { Router } = require("express");
const authControllers = require("../../../repository/HRMS/authentication/auth");
const { check } = require("express-validator");
const router = Router();
const auth = require("../../../middleware/authorization");

router.post(
  "/addUserAccount",
  [
    check("email").notEmpty().withMessage("Email is required!"),
    check("name").notEmpty().withMessage("Name is required!"),
    check("contact").notEmpty().withMessage("Contact is required!"),
    check("role").notEmpty().withMessage("Role is required!"),
  ],
  authControllers.addUserAccount
);

router.post(
  "/userLogin",
  [
    check("email").notEmpty().withMessage("Email is required!"),
    check("role").notEmpty().withMessage("Role is required!"),
    check("password")
      .if((value, { req }) => {
        return (
          req.body.role === "Admin" ||
          req.body.role === "Accounts" ||
          req.body.role === "HR"
        );
      })
      .notEmpty()
      .withMessage("Password is required!"),
  ],
  authControllers.userLogin
);

router.post(
  "/sendOTP",
  [check("email").notEmpty().withMessage("Email is required!")],
  authControllers.sendOTP
);

router.post(
  "/changePassword",
  [
    check("uuid").notEmpty().withMessage("User id is required!"),
    check("newPassword").notEmpty().withMessage("New password is required!"),
  ],
  authControllers.changePassword
);

router.get(
  "/getAllUserAccounts",
  auth.isLoggedIn,
  authControllers.getAllUserAccounts
);

router.get(
  "/getActiveUserAccounts",
  auth.isLoggedIn,
  authControllers.getActiveUserAccounts
);

router.get(
  "/getInActiveUserAccounts",
  auth.isLoggedIn,
  authControllers.getInActiveUserAccounts
);

router.get(
  "/getUserAccountById",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("User id is required!"),
  authControllers.getUserAccountById
);

router.put(
  "/updateUserAccount",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("User id is required!"),
  authControllers.updateUserAccount
);

router.delete(
  "/deleteUserAccount",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("User id is required!"),
  authControllers.deleteUserAccount
);

router.delete(
  "/deleteDuplicateUserAccounts",
  auth.isLoggedIn,
  authControllers.deleteDuplicateUserAccounts
);

module.exports = router;
