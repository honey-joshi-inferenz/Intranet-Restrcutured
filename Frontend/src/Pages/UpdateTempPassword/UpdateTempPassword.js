import React, { useState } from "react";
import infLogo from "../../Assets/Logo/Logo.svg";
import forgotPass from "../../Assets/Images/Forget Password.png";
import { Button } from "@mui/material";
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

export const UpdateTempPassword = () => {
  const navigate = useNavigate();
  const uuid = localStorage.getItem("userId");
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
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
              navigate("/home");
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
                <span className="text-start text-light fs-3 fw-bold mb-3">
                  Reset Password
                </span>
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
