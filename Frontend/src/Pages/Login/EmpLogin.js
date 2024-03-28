import React, { useState } from "react";
import "./Login.css";
import infLogo from "../../Assets/Logo/Logo.svg";
import empLogo from "../../Assets/Logo/Frame 5.svg";
import handlePuzzle from "../../Assets/Images/Puzzle Image.png";
import { MdEmail } from "react-icons/md";
import { Button } from "@mui/material";
import OTPInput from "otp-input-react";
import { useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import { RegExp } from "../../Helpers/RegExp";
import { Loader } from "../../Assets/Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const EmpLogin = () => {
  const navigate = useNavigate();

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [OTP, setOTP] = useState("");
  const [getOTP, setGetOTP] = useState("");
  const [values, setValues] = useState({
    userId: "",
    firstname: "",
    lastname: "",
  });
  const [formErrors, setFormErrors] = useState({
    userId: "",
    firstname: "",
    lastname: "",
    otp: "",
  });

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validateOTP = (otp) => {
    var errors = {};

    if (otp?.trim().length === 0) {
      errors.otp = "Please enter the OTP.";
    } else if (getOTP !== Number(otp)) {
      errors.otp = "OTP does not match.";
    }

    return errors;
  };

  const validateValues = (formValues) => {
    var errors = {};

    let emailRegexp = RegExp.REACT_APP_EMAILREGEX;

    if (formValues.userId?.trim().length === 0) {
      errors.userId = "User ID is required.";
    } else if (!emailRegexp.test(formValues.userId)) {
      errors.userId = "The value is not a valid user ID.";
    }
    // if (formValues.firstname?.trim().length === 0) {
    //   errors.firstname = "First name is required.";
    // }
    // if (formValues.lastname?.trim().length === 0) {
    //   errors.lastname = "Last name is required.";
    // }

    return errors;
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    const errors = validateValues(values);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .post(BASE_URL + "userAccounts/sendOTP", { email: values.userId })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("An OTP has been sent to your email.");
            setGetOTP(res.data.otp);
            localStorage.setItem("role", res.data.data.role);
            localStorage.setItem("department", res.data.data.dept_name);
            localStorage.setItem("employeeId", res.data.data.emp_code);
            localStorage.setItem("name", res.data.data.name);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("userId", res.data.data.uuid);
            localStorage.setItem("token", res.data.token);
            setTimeout(() => {
              setOtpSent(true);
              setLoading(false);
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

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const errors = validateOTP(OTP);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      setSnackbar(true);
      setErrorMsg(false);
      setMessage("Loggedin succesfully.");
      setTimeout(() => {
        navigate("/home");
        setLoading(false);
      }, 2000);
    }
  };
  return (
    <div className="empLogin d-flex  align-items-center  justify-content-center bgImg">
      <div className="authFormCard bg-transparent position-absolute w-75 bg-light  ">
        <div className="loginForm d-flex flex-row">
          <div
            className="col-xl-6 col-12 p-5 d-flex flex-column"
            style={{ background: "#fff" }}
          >
            <img alt="infLogo" src={infLogo} className=" mb-3" />
            <div className="authFormCompo d-flex flex-column p-3">
              <span className="text-start text-light fs-3 fw-bold ">
                Sign In
              </span>

              {otpSent ? (
                <form onSubmit={handleVerifyOTP}>
                  <div className="w-100 text-start ">
                    <span className="text-start text-light fs-6 fw-bold mt-3 w-100">
                      Please enter the OTP sent to your inbox.
                    </span>
                    <OTPInput
                      value={OTP}
                      onChange={setOTP}
                      autoFocus
                      OTPLength={4}
                      otpType="number"
                      disabled={false}
                      className="mb-3 mt-3 otpInput p-3"
                    />
                    <div className="d-flex justify-content-start ">
                      <Button className="generalButton" type="submit">
                        {loading ? <Loader /> : "Sign in"}
                      </Button>
                    </div>
                  </div>
                  {formErrors.otp && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3  ">
                      <MdError className="mx-2" /> <span>{formErrors.otp}</span>
                    </div>
                  )}
                </form>
              ) : (
                <form onSubmit={handleSubmitOTP}>
                  <div className="d-flex mt-3 p-3 tagDiv bg-light  w-100 align-items-center  justify-content-center flex-row mb-3">
                    <div className="col-3">
                      <img src={empLogo} alt="empLogo" />
                    </div>
                    <span className="fs-4 fw-bold col-9 text-start">
                      Employee Intranet
                    </span>
                  </div>
                  <div className="d-flex flex-column ">
                    <div className="input-group mb-3">
                      <span className="input-group-text authFormIcon">
                        <MdEmail />
                      </span>
                      <input
                        type="text"
                        className="form-control authFormControl"
                        placeholder="userid@inferenz.ai"
                        name="userId"
                        value={values.userId}
                        onChange={handleChange}
                      />
                    </div>

                    {/* <div className="mb-3 d-flex flex-column flex-md-row  justify-content-between ">
                      <input
                        type="text"
                        className="form-control me-0 me-md-2 mb-3 mb-md-0  authFormControl"
                        placeholder="First name"
                        name="firstname"
                        value={values.firstname}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control authFormControl"
                        placeholder="Last name"
                        name="lastname"
                        value={values.lastname}
                        onChange={handleChange}
                      />
                    </div> */}
                  </div>
                  <div className="d-flex justify-content-between ">
                    <Button className="generalButton" type="submit">
                      {loading ? <Loader /> : "Send OTP"}
                    </Button>
                    <Button
                      className="text-light text-decoration-underline "
                      type="button"
                      onClick={() => navigate("/signup")}
                    >
                      New Here? Create an Account
                    </Button>
                  </div>
                  {formErrors.userId && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.userId}</span>
                    </div>
                  )}
                  {formErrors.firstname && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.firstname}</span>
                    </div>
                  )}
                  {formErrors.lastname && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.lastname}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
          <div className="col-md-6 authRightImage d-none d-xl-inline-block bg-light">
            <img src={handlePuzzle} alt="handPuzzle" />
          </div>
        </div>
      </div>
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
