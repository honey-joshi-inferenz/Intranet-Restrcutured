const { Router } = require("express");
const referralControllers = require("../../../repository/HRMS/referral/referral");
const { imageUpload } = require("../../../middleware/utilities");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.post(
  "/addReferralRequest",
  imageUpload.single("candidate_resume"),
  check("candidate_resume")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Resume file is required!"),
  auth.isLoggedIn,
  referralControllers.addReferralRequest
);

router.get(
  "/getMyReferrals",
  check("uuid").notEmpty().withMessage("Employee UUID is required!"),
  auth.isLoggedIn,
  referralControllers.getMyReferrals
);

module.exports = router;
