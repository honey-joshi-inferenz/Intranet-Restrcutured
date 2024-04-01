import React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { Loader } from "../../../Assets/Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const RescheduleInterview = ({ setReschedule, data }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const userName = localStorage.getItem("name");
  const [values, setValues] = useState({
    rescheduleReason: "",
    rescheduleTime: "",
    rescheduleDate: "",
  });
  const [formErrors, setFormErrors] = useState({
    rescheduleReason: "",
    rescheduleTime: "",
    rescheduleDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validateReschedule = (formValues) => {
    var errors = {};

    if (formValues.rescheduleReason?.trim().length === 0) {
      errors.rescheduleReason = "Reason for reschedule is required.";
    }
    if (formValues.rescheduleTime?.trim().length === 0) {
      errors.rescheduleTime = "Please select time to reschedule.";
    }
    if (formValues.rescheduleDate?.trim().length === 0) {
      errors.rescheduleDate = "Please select date to reschedule.";
    }
    return errors;
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    const errors = validateReschedule(values);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .put(
            BASE_URL + "candidate/rescheduleInterview",
            {
              reason: values.rescheduleReason,
              new_interview_time: values.rescheduleTime,
              new_interview_date: values.rescheduleDate,
              candidate_name: data.candidate_name,
              position: data.designation,
              interviewer_name: userName,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Request for Rescheduling the Interview has been sent.");
            setTimeout(() => {
              setLoading(false);
              handleCancel();
              setReschedule(false);
              if (role === "HR" || role === "Admin") {
                navigate("/recruiter-dashboard");
              } else {
                navigate("/recruiter-interviews");
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
      rescheduleReason: "",
      rescheduleTime: "",
      rescheduleDate: "",
    });

    setFormErrors({
      rescheduleReason: "",
      rescheduleTime: "",
      rescheduleDate: "",
    });
  };

  return (
    <div>
      <form onSubmit={handleReschedule}>
        <div className="card p-3">
          <span className="fs-5 fw-bold mb-4 text-start">
            Reschedule Interview
          </span>
          <div className="mb-3 w-100 text-start">
            <label className="form-label">Reason for Reschedule</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              placeholder="Reason for Reschedule"
              name="rescheduleReason"
              value={values.rescheduleReason}
              onChange={handleChange}
            />
            {formErrors.rescheduleReason && (
              <div className="w-100 text-start">
                <span className="text-danger mx-1" style={{ fontSize: "12px" }}>
                  {formErrors.rescheduleReason}
                </span>
              </div>
            )}
          </div>
          <div className="mb-3 w-100 text-start d-flex flex-lg-row flex-column ">
            <div className="col-12 col-lg-6 me-2">
              <label className="form-label">Reason Time</label>
              <input
                type="time"
                className="form-control formControlInput"
                placeholder="Reason For Reschedule"
                name="rescheduleTime"
                value={values.rescheduleTime}
                onChange={handleChange}
              />
              {formErrors.rescheduleTime && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.rescheduleTime}
                  </span>
                </div>
              )}
            </div>
            <div className="col-12 col-lg-6">
              <label className="form-label">Reason Date</label>
              <input
                type="date"
                className="form-control formControlInput"
                placeholder="Reason For Reschedule"
                name="rescheduleDate"
                value={values.rescheduleDate}
                onChange={handleChange}
              />
              {formErrors.rescheduleDate && (
                <div className="w-100 text-start">
                  <span
                    className="text-danger mx-1"
                    style={{ fontSize: "12px" }}
                  >
                    {formErrors.rescheduleDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-end ">
          <Button className="headerButton" type="submit">
            {loading ? <Loader /> : "Submit"}
          </Button>
          <Button
            className="cancelBtn fw-bold  ms-2"
            onClick={() => {
              setReschedule(false);
              handleCancel();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
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
