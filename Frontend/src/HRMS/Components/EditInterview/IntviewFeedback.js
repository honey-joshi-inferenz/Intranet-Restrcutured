import React, { useRef } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { Loader } from "../../../Assets/Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { RescheduleInterview } from "./RescheduleInterview";

export const InterviewFeedback = ({ data }) => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const userName = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const inputRef = useRef(null);
  const [reschedule, setReschedule] = useState(false);
  const [values, setValues] = useState({
    feedback: "",
    nextRound: null,
    attitudeFeedback: "",
    logicalFeedback: "",
    analyticalFeedback: "",
    confidenceFeedback: "",
    communicationFeedback: "",
  });
  const [file, setFile] = useState(null);
  const [formErrors, setFormErrors] = useState({
    feedback: "",
    nextRound: "",
    attitudeFeedback: "",
    logicalFeedback: "",
    analyticalFeedback: "",
    confidenceFeedback: "",
    communicationFeedback: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleFile = (file) => {
    setFile(file);
  };

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validateFeedback = (formValues, file) => {
    var errors = {};
    if (formValues.feedback?.trim().length === 0) {
      errors.feedback = "Interview feedback is required.";
    }

    if (formValues.nextRound === null) {
      errors.nextRound =
        "Please select the option for next round consideration.";
    }

    if (formValues.attitudeFeedback === "") {
      errors.attitudeFeedback = "Please select the option for feedback.";
    }

    if (formValues.logicalFeedback === "") {
      errors.logicalFeedback = "Please select the option for feedback.";
    }

    if (formValues.analyticalFeedback === "") {
      errors.analyticalFeedback = "Please select the option for feedback.";
    }

    if (formValues.confidenceFeedback === "") {
      errors.confidenceFeedback = "Please select the option for feedback.";
    }

    if (formValues.communicationFeedback === "") {
      errors.communicationFeedback = "Please select the option for feedback.";
    }
    return errors;
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    const errors = validateFeedback(values, file);
    setFormErrors(errors);

    const softSkills = {
      attitudeFeedback: values.attitudeFeedback,
      logicalFeedback: values.logicalFeedback,
      analyticalFeedback: values.analyticalFeedback,
      confidenceFeedback: values.confidenceFeedback,
      communicationFeedback: values.communicationFeedback,
    };

    const bodyData = {
      uuid: data.uuid,
      interview_round: data.interview_round,
      interviewer_name: userName,
      interview_feedback: values.feedback,
      interview_softSkills: JSON.stringify(softSkills),
      eligible_for_next_round: values.nextRound,
      nextRoundEmailStatus: true,
    };

    const formData = new FormData();
    // formData.append("uuid", data.uuid);
    // formData.append("interview_round", data.interview_round);
    // formData.append("interviewer_name", userName);
    // formData.append("interview_feedback", values.feedback);
    // formData.append("eligible_for_next_round", values.nextRound);
    // formData.append("nextRoundEmailStatus", true);
    formData.append("data", JSON.stringify(bodyData));
    formData.append("interviewImage", file);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .put(BASE_URL + "candidate/updateCandidateProfile", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Interview feedback added successfully.");
            setTimeout(() => {
              setLoading(false);
              handleCancel();
              if (role === "HR" || role === "Admin") {
                navigate("/recruiter-interview-history");
              } else {
                navigate("/recruiter-interviewHistory");
              }
            }, 2000);
          })
          .catch((err) => {
            console.log(err);
            setSnackbar(true);
            setErrorMsg(true);
            if (err.message) {
              setMessage(err.message);
            }
            if (err.response.data) {
              setMessage(err.response.data.message);
            }
            if (err.response.status === 401) {
              setMessage("Your session has been expired.");

              setTimeout(() => {
                if (role === "HR" || role === "Admin" || role === "Accounts") {
                  navigate("/adms");
                } else {
                  navigate("/");
                }
                localStorage.clear();
              }, 2000);
            }
            setTimeout(() => {
              setLoading(false);
            }, 2000);
          });
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
  };

  const handleCancel = () => {
    setValues({
      feedback: "",
      nextRound: null,
      attitudeFeedback: "",
      logicalFeedback: "",
      analyticalFeedback: "",
      confidenceFeedback: "",
      communicationFeedback: "",
    });

    setFormErrors({
      feedback: "",
      nextRound: "",
      attitudeFeedback: "",
      logicalFeedback: "",
      analyticalFeedback: "",
      confidenceFeedback: "",
      communicationFeedback: "",
    });
  };

  return (
    <div>
      {reschedule ? (
        <RescheduleInterview setReschedule={setReschedule} data={data} />
      ) : (
        <form onSubmit={handleFeedback}>
          <div className="card p-3">
            <span className="fs-5 fw-bold mb-4 text-start">
              Interview Feedback
            </span>

            <div className="mb-3 w-100 text-start">
              <label className="form-label">Technical Feedback</label>
              <textarea
                type="text"
                className="form-control formControlInput"
                placeholder="Technical Feedback"
                name="feedback"
                value={values.feedback}
                onChange={handleChange}
              />
              {formErrors.feedback && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.feedback}
                  </span>
                </div>
              )}
            </div>

            <div>
              {" "}
              <div className="d-flex flex-xl-row flex-column mb-2 ">
                <div className="col-12 col-xl-7 text-start d-flex flex-column ">
                  <label className="form-label ">Logical</label>
                  <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
                    Points to Consider : Rational, Reasoned, Sensible
                  </span>
                </div>
                <div className="col-12 col-xl-5 d-flex justify-content-xl-end flex-md-row flex-column ">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="logicalFeedback"
                      value="Good"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Good</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="logicalFeedback"
                      value="Average"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">
                      Average
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="logicalFeedback"
                      value="Bad"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Bad</label>
                  </div>
                </div>
              </div>
              {formErrors.logicalFeedback && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1 mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.logicalFeedback}
                  </span>
                </div>
              )}
            </div>
            <div>
              {" "}
              <div className="d-flex flex-xl-row flex-column mb-2">
                <div className="col-12 col-xl-7 text-start d-flex  flex-column  ">
                  <label className="form-label ">Analytical</label>
                  <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
                    Points to Consider : Systematic, Perceptive, Insightful
                  </span>
                </div>
                <div className="col-12 col-xl-5 d-flex justify-content-xl-end flex-md-row flex-column ">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="analyticalFeedback"
                      value="Good"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Good</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="analyticalFeedback"
                      value="Average"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">
                      Average
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="analyticalFeedback"
                      value="Bad"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Bad</label>
                  </div>
                </div>
              </div>
              {formErrors.analyticalFeedback && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1 mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.analyticalFeedback}
                  </span>
                </div>
              )}
            </div>
            <div>
              {" "}
              <div className="d-flex flex-xl-row flex-column mb-2">
                <div className="col-12 col-xl-7 text-start d-flex  flex-column ">
                  <label className="form-label ">Confidence</label>
                  <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
                    Points to Consider : Self-Assurance, Poise, Self-Confidence
                  </span>
                </div>
                <div className="col-12 col-xl-5 d-flex  justify-content-xl-end flex-md-row flex-column ">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="confidenceFeedback"
                      value="Good"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Good</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="confidenceFeedback"
                      value="Average"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">
                      Average
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="confidenceFeedback"
                      value="Bad"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Bad</label>
                  </div>
                </div>
              </div>
              {formErrors.confidenceFeedback && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1 mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.confidenceFeedback}
                  </span>
                </div>
              )}
            </div>
            <div>
              {" "}
              <div className="d-flex flex-xl-row flex-column mb-2">
                <div className="col-12 col-xl-7 text-start d-flex flex-column ">
                  <label className="form-label ">Communication Skills</label>
                  <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
                    Points to Consider : Interpersonal Skills, Articulate
                    Expression, Effective Discourse
                  </span>
                </div>
                <div className="col-12 col-xl-5 d-flex justify-content-xl-end flex-md-row flex-column">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="communicationFeedback"
                      value="Good"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Good</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="communicationFeedback"
                      value="Average"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">
                      Average
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="communicationFeedback"
                      value="Bad"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Bad</label>
                  </div>
                </div>
              </div>{" "}
              {formErrors.communicationFeedback && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1 mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.communicationFeedback}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="d-flex flex-xl-row flex-column">
                <div className="col-12 col-xl-7 text-start d-flex flex-column ">
                  <label className="form-label ">Attitude</label>
                  <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
                    Points to Consider : Mindset, Outlook, Approach
                  </span>
                </div>
                <div className="col-12 col-xl-5 d-flex  justify-content-xl-end flex-md-row flex-column">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="attitudeFeedback"
                      value="Good"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Good</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="attitudeFeedback"
                      value="Average"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">
                      Average
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="attitudeFeedback"
                      value="Bad"
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Bad</label>
                  </div>
                </div>
              </div>
              {formErrors.attitudeFeedback && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1 mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.attitudeFeedback}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="card mt-3 p-3">
            <div className="mb-3 w-100 text-start">
              <label className="form-label">
                Upload screenshot of Interview
              </label>
              <input
                ref={inputRef}
                accept="image/png,image/jpg"
                type="file"
                className="form-control formControlInput"
                name="screenshort"
                onChange={(e) => {
                  handleFile(e.target.files[0]);
                }}
              />
              <span
                className="text-center mt-3 w-75"
                style={{ fontSize: "13px", color: "#A1A5B7" }}
              >
                .png, .jpg file only.
              </span>
            </div>

            <div className="w-100 text-start">
              <div className="d-flex justify-content-between ">
                <label className="form-label">
                  Can we consider the candidate for the next round?
                </label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="nextRound"
                      value={true}
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="nextRound"
                      value={false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label form-label">No</label>
                  </div>
                </div>
              </div>
              {formErrors.nextRound && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.nextRound}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-end mb-5">
            <Button className="headerButton" type="submit">
              {loading ? <Loader /> : "Submit"}
            </Button>
            <Button
              className="cancelBtn fw-bold  ms-2"
              onClick={() => setReschedule(true)}
            >
              Reschedule Interview ?
            </Button>
          </div>
        </form>
      )}
      <Snackbar
        open={snackbar}
        autoHideDuration={2000}
        onClose={handleSnackbar}
      >
        <Alert
          severity={errorMsg ? "error" : "success"}
          sx={{ width: "100%" }}
          onClose={handleSnackbar}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
