const { Router } = require("express");
const resumeControllers = require("../../../repository/HRMS/resume/resumeOperations");
const { imageUpload } = require("../../../middleware/utilities");
const { check } = require("express-validator");
const router = Router();

router.get("/getBucketList", resumeControllers.getBucketList);

router.get("/getBucketResumes", resumeControllers.getBucketResumes);

router.get(
  "/getBucketResumeByName",
  check("resumeName").notEmpty().withMessage("Resume name is required!"),
  resumeControllers.getBucketResumeByName
);

router.get(
  "/updateResumeLinks",
  imageUpload.single("candidate_resume"),
  resumeControllers.updateResumeLinks
);

router.post(
  "/uploadResume",
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

  // check("candidate_resume").notEmpty().withMessage("Resume file is required!"),
  resumeControllers.uploadResume
);

router.delete(
  "/deleteResume",
  check("resumeName").notEmpty().withMessage("Resume name is required!"),
  resumeControllers.deleteResume
);

module.exports = router;
