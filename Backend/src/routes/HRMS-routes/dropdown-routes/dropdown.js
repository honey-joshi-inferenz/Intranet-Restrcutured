const { Router } = require("express");
const dropdownControllers = require("../../../repository/HRMS/dropdown/dropdown");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.post(
  "/addDropdownValue",
  [
    check("name").notEmpty().withMessage("Name is required!"),
    check("value").notEmpty().withMessage("Value is required!"),
    check("drp_name").notEmpty().withMessage("Dropdown name is required!"),
  ],
  auth.isLoggedIn,
  dropdownControllers.addDropdownValue
);

router.get(
  "/getDropdownValueById",
  [check("id").notEmpty().withMessage("Dropdown option id is required!")],
  auth.isLoggedIn,
  dropdownControllers.getDropdownValueById
);

router.put(
  "/updateDropdownValue",
  [check("id").notEmpty().withMessage("Dropdown option id is required!")],
  auth.isLoggedIn,
  dropdownControllers.updateDropdownValue
);

router.get("/getHRDetails", auth.isLoggedIn, dropdownControllers.getHRDetails);

router.get("/getHRDetails", auth.isLoggedIn, dropdownControllers.getHRDetails);

router.get(
  "/getInterviewers",
  auth.isLoggedIn,
  dropdownControllers.getInterviewers
);

router.get(
  "/getResumeSources",
  auth.isLoggedIn,
  dropdownControllers.getResumeSources
);

router.get("/getHRStatus", auth.isLoggedIn, dropdownControllers.getHRStatus);

router.get(
  "/getInterviewRounds",
  auth.isLoggedIn,
  dropdownControllers.getInterviewRounds
);

router.get(
  "/getFinalStatus",
  auth.isLoggedIn,
  dropdownControllers.getFinalStatus
);

router.get("/getUsers", auth.isLoggedIn, dropdownControllers.getUsers);

router.get("/getPositions", auth.isLoggedIn, dropdownControllers.getPositions);

router.get(
  "/getDepartments",
  auth.isLoggedIn,
  dropdownControllers.getDepartments
);

router.get(
  "/getPaymentModes",
  auth.isLoggedIn,
  dropdownControllers.getPaymentModes
);

router.get(
  "/getReimburseCategories",
  auth.isLoggedIn,
  dropdownControllers.getReimburseCategories
);

router.get(
  "/getFilteredColumns",
  check("uuid").notEmpty().withMessage("Interviewer UUID is required!"),
  auth.isLoggedIn,
  dropdownControllers.getFilteredColumns
);

router.delete(
  "/deleteDropdownValue",
  [check("id").notEmpty().withMessage("Id is required!")],
  auth.isLoggedIn,
  dropdownControllers.deleteDropdownValue
);

router.get("/getAppliedYear", dropdownControllers.getAppliedYear);

module.exports = router;
