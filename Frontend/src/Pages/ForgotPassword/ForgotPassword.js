import React, { useState } from "react";
import infLogo from "../../Assets/Logo/Logo.svg";
import forgotPass from "../../Assets/Images/Forget Password.png";
import { MdEmail } from "react-icons/md";
import { Button } from "@mui/material";
import OTPInput from "otp-input-react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FaLock } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { IoBagCheck } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RegExp } from "../../Helpers/RegExp";
import { MdError } from "react-icons/md";
import { Loader } from "../../Assets/Loader/Loader";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { BASE_URL } from "../../Config/BaseUrl";
import axios from "axios";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [OTP, setOTP] = useState("");
  const [getOTP, setGetOTP] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [uuid, setUuid] = useState("");
  const [values, setValues] = useState({
    userId: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    userId: "",
    role: "",
    password: "",
    confirmPassword: "",
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
    if (formValues.role?.trim().length === 0) {
      errors.role = "Select the role.";
    }

    return errors;
  };

  const validatePassword = (formValues) => {
    var errors = {};

    const upperCase = RegExp.REACT_APP_UPPERCASEREGEX;
    const lowerCase = RegExp.REACT_APP_LOWERCASEREGEX;
    const digit = RegExp.REACT_APP_DIGITSREGEX;
    const specialChar = RegExp.REACT_APP_SPECIALCHARREGEX;

    if (formValues.password.trim().length === 0) {
      errors.password = "The password is required.";
    } else if (!upperCase.test(formValues.password)) {
      errors.password =
        "The password must contain atleast one upper case letter.";
    } else if (!lowerCase.test(formValues.password)) {
      errors.password =
        "The password must contain altleast one lower case letter.";
    } else if (!digit.test(formValues.password)) {
      errors.password = "The password must contain atleast one digit.";
    } else if (!specialChar.test(formValues.password)) {
      errors.password =
        "The password must contain atleast one special character.";
    } else if (formValues.password.length < 8) {
      errors.password = "The password must be more than 8 characters.";
    }

    if (formValues.confirmPassword.trim().length === 0) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = "Confirm password does not match.";
    }

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
          .post(BASE_URL + "userAccounts/sendOTP", {
            email: values.userId,
            role: values.role,
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("An OTP has been sent to your email.");
            setGetOTP(res.data.otp);
            setUuid(res.data.data.uuid);
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
      setTimeout(() => {
        setOtpVerified(true);
        setLoading(false);
        setSnackbar(true);
        setErrorMsg(false);
        setMessage("OTP verified successfully.");
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePassword(values);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .post(BASE_URL + "userAccounts/changePassword", {
            uuid: uuid,
            newPassword: values.password,
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Your password has been updated successfully.");
            setTimeout(() => {
              navigate("/adms");
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

  return (
    <div>
      <div className="forgotPass d-flex  align-items-center  justify-content-center bgImg">
        <div className="authFormCard bg-transparent position-absolute w-75 ">
          <div className="d-flex flex-row">
            <div className="col-xl-6 col-12 p-5 d-flex flex-column bg-light">
              <img alt="infLogo" src={infLogo} className=" mb-3" />
              <div className="authFormCompo d-flex flex-column p-3">
                {otpVerified ? (
                  <span className="text-start text-light fs-3 fw-bold mb-3">
                    Reset Password
                  </span>
                ) : (
                  <span className="text-start text-light fs-3 fw-bold mb-3">
                    Forgot Password
                  </span>
                )}

                {otpVerified ? (
                  <form onSubmit={handleSubmit}>
                    <div className="text-start w-100">
                      <div className="input-group mb-3">
                        <span className="input-group-text authFormIcon">
                          <FaLock />
                        </span>
                        <input
                          type={visibility ? "text" : "password"}
                          className="form-control authFormControl"
                          placeholder="Password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                        <span
                          className="input-group-text authFormIcon2"
                          style={{ cursor: "pointer" }}
                          onClick={() => setVisibility(!visibility)}
                        >
                          {visibility ? <VscEye /> : <VscEyeClosed />}
                        </span>
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text authFormIcon">
                          <IoBagCheck />
                        </span>
                        <input
                          type="password"
                          className="form-control authFormControl"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                      </div>
                      <div className="d-flex justify-content-start ">
                        <Button className="generalButton" type="submit">
                          {loading ? <Loader /> : "Reset"}
                        </Button>
                      </div>
                      {formErrors.password && (
                        <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                          <MdError className="mx-2" />
                          <span>{formErrors.password}</span>
                        </div>
                      )}
                      {formErrors.confirmPassword && (
                        <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                          <MdError className="mx-2" />
                          <span>{formErrors.confirmPassword}</span>
                        </div>
                      )}
                    </div>
                  </form>
                ) : otpSent ? (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="w-100 text-start">
                      <span className="text-start text-light fs-6 fw-bold mt-3">
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
                          {loading ? <Loader /> : "Verify OTP"}
                        </Button>
                      </div>
                      {formErrors.otp && (
                        <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3  ">
                          <MdError className="mx-2" />{" "}
                          <span>{formErrors.otp}</span>
                        </div>
                      )}
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitOTP}>
                    <div className="w-100 text-start">
                      <span className="text-start text-light fs-6 fw-bold mt-3 mb-3">
                        Enter the email associated with your account.
                      </span>
                      <div className="input-group mb-3 mt-3">
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
                      <div className="w-100">
                        <FormControl
                          className="mb-3 w-100"
                          sx={{ minWidth: 80 }}
                        >
                          <Select
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            displayEmpty
                            className="authFormSelect"
                          >
                            <MenuItem value="" disabled>
                              Select Role
                            </MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="HR">HR</MenuItem>
                            <MenuItem value="Accounts">Accounts</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start ">
                      <Button className="generalButton" type="submit">
                        {loading ? <Loader /> : "Send OTP"}
                      </Button>
                    </div>
                    {formErrors.userId && (
                      <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                        <MdError className="mx-2" />{" "}
                        <span>{formErrors.userId}</span>
                      </div>
                    )}
                    {formErrors.role && (
                      <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                        <MdError className="mx-2" />{" "}
                        <span>{formErrors.role}</span>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
            <div className="col-6 authRightImage d-none d-xl-inline-block bg-light">
              <img src={forgotPass} alt="handPuzzle" />
            </div>
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
