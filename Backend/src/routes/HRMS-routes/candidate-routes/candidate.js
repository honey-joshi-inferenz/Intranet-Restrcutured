const { Router } = require("express");
const candidateControllers = require("../../../repository/HRMS/candidate/candidate");
const { imageUpload, zipUpload } = require("../../../middleware/utilities");
const auth = require("../../../middleware/authorization");
const { check } = require("express-validator");
const router = Router();

router.post("/saveFormData", candidateControllers.saveFormData);

router.post(
  "/addCandidateProfile",
  imageUpload.single("candidate_resume"),
  auth.isLoggedIn,
  check("candidate_resume")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Resume file is required!"),
  candidateControllers.addCandidateProfile
);

router.post(
  "/uploadBulkCandidates",
  zipUpload.single("candidates"),
  check("candidates")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Candidate file is required!"),
  candidateControllers.uploadBulkCandidates
);

router.post(
  "/importCandidateFile",
  imageUpload.single("candidateDetails"),
  auth.isLoggedIn,
  check("candidateDetails")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Candidates file is required!"),
  candidateControllers.importCandidateFile
);

router.put(
  "/updateCandidateProfile",
  imageUpload.fields([
    {
      name: "interviewImage",
      maxCount: 1,
    },
    {
      name: "candidate_resume",
      maxCount: 1,
    },
  ]),
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("Candidate UUID is required!"),
  candidateControllers.updateCandidateProfile
);

router.get(
  "/getCandidateById",
  auth.isLoggedIn,
  [check("uuid").notEmpty().withMessage("Candidate UUID is required!")],
  candidateControllers.getCandidateById
);

router.get(
  "/getInActiveCandidates",
  auth.isLoggedIn,
  candidateControllers.getInActiveCandidates
);

router.get(
  "/getActiveCandidates",
  auth.isLoggedIn,
  candidateControllers.getActiveCandidates
);

router.delete(
  "/deActivateCandidateProfile",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("Candidate UUID is required!"),
  candidateControllers.deActivateCandidateProfile
);

router.delete(
  "/deleteBulkCandidates",
  auth.isLoggedIn,
  imageUpload.single("updatedCandidates"),
  check("updatedCandidates")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Candidates file is required!"),
  candidateControllers.deleteBulkCandidates
);

router.delete(
  "/hardDeleteCandidateProfile",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("Candidate UUID is required!"),
  candidateControllers.hardDeleteCandidateProfile
);

router.put(
  "/reActivateCandidateProfile",
  auth.isLoggedIn,
  check("uuid").notEmpty().withMessage("Candidate UUID is required!"),
  candidateControllers.reActivateCandidateProfile
);

router.put(
  "/rescheduleInterview",
  [
    check("candidate_name")
      .notEmpty()
      .withMessage("Candidate name is required!"),
    check("position").notEmpty().withMessage("Candidate position is required!"),
    check("reason").notEmpty().withMessage("Reason is required!"),
    check("new_interview_date")
      .notEmpty()
      .withMessage("New interview date is required!"),
    check("new_interview_time")
      .notEmpty()
      .withMessage("New interview time is required!"),
    check("interviewer_name")
      .notEmpty()
      .withMessage("Interviewer name is required!"),
  ],
  auth.isLoggedIn,
  candidateControllers.rescheduleInterview
);

router.put(
  "/updateAppliedDates",
  auth.isLoggedIn,
  candidateControllers.updateAppliedDates
);

router.put(
  "/updateResumeLinks",
  auth.isLoggedIn,
  imageUpload.single("updatedCandidates"),
  check("updatedCandidates")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Candidates file is required!"),
  candidateControllers.updateResumeLinks
);

router.put(
  "/manualResumes",
  auth.isLoggedIn,
  imageUpload.single("updatedCandidates"),
  check("updatedCandidates")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Candidates file is required!"),
  candidateControllers.manualResumes
);

module.exports = router;
