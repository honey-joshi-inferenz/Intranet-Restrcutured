import React, { useState } from "react";
import "./Login.css";
import infLogo from "../../Assets/Logo/Logo.svg";
import adminLogo from "../../Assets/Logo/Frame 1.svg";
import hrLogo from "../../Assets/Logo/Frame 2.svg";
import accountsLogo from "../../Assets/Logo/Frame 3.svg";
import door from "../../Assets/Images/Sign In Door Image.png";
import { MdEmail } from "react-icons/md";
import { Button } from "@mui/material";
import { FaLock } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import { RegExp } from "../../Helpers/RegExp";
import { Loader } from "../../Assets/Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    userId: "",
    password: "",
  });
  const [role, setRole] = useState(null);
  const [formErrors, setFormErrors] = useState({
    userId: "",
    password: "",
    role: "",
  });
  const [visibility, setVisibility] = useState(false);
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

  const validateValues = (formValues, role) => {
    var errors = {};
    let emailRegexp = RegExp.REACT_APP_EMAILREGEX;

    if (formValues.userId?.trim().length === 0) {
      errors.userId = "User ID is required.";
    } else if (!emailRegexp.test(formValues.userId)) {
      errors.userId = "The value is not a valid user ID.";
    }

    if (formValues.password?.trim().length === 0) {
      errors.password = "Password is required.";
    }
    if (role === null) {
      errors.role = "Select the role.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateValues(values, role);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .post(BASE_URL + "userAccounts/userLogin", {
            email: values.userId,
            role: role,
            password: values.password,
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Loggedin succesfully.");
            localStorage.setItem("role", res.data.data.role);
            localStorage.setItem("department", res.data.data.dept_name);
            localStorage.setItem("employeeId", res.data.data.emp_code);
            localStorage.setItem("name", res.data.data.name);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("userId", res.data.data.uuid);
            localStorage.setItem("token", res.data.token);
            setTimeout(() => {
              if (res.data.data.is_temp_password) {
                navigate("/change-password");
              } else {
                navigate("/home");
              }
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
    <div className="login d-flex  align-items-center  justify-content-center bgImg">
      <div className="authFormCard bg-transparent position-absolute w-75 bg-light">
        <div className="loginForm d-flex flex-row">
          <div className="col-xl-6 col-12 p-5 d-flex flex-column bg-light">
            <img alt="infLogo" src={infLogo} className=" mb-3" />
            <form onSubmit={handleSubmit}>
              <div className="authFormCompo d-flex flex-column p-3">
                <span className="text-start text-light fs-3 fw-bold ">
                  Sign In
                </span>

                <div className="d-flex flex-column mb-3">
                  <span className="text-start text-light fs-6 fw-bold mt-3 mb-3">
                    Select Role
                  </span>
                  <div className="rolesDiv d-flex justify-content-md-between  flex-md-row flex-column ">
                    <button
                      className={
                        "p-3 tagDiv bg-light d-flex flex-row flex-md-column  align-items-center justify-content-center col-12 col-md-3 border border-0 " +
                        (role === "Admin" ? " activeRole" : "")
                      }
                      onClick={() => setRole("Admin")}
                      type="button"
                    >
                      <img alt="roleImg" src={adminLogo} />
                      <span className="fw-bold">Admin</span>
                    </button>
                    <button
                      className={
                        "p-3 tagDiv bg-light d-flex flex-row flex-md-column align-items-center justify-content-center col-12 col-md-3 mt-2 mt-md-0 border border-0 " +
                        (role === "HR" ? " activeRole" : "")
                      }
                      onClick={() => setRole("HR")}
                      type="button"
                    >
                      <img alt="roleImg" src={hrLogo} />
                      <span className="fw-bold">HR</span>
                    </button>
                    <button
                      className={
                        "p-3 tagDiv bg-light d-flex flex-row flex-md-column align-items-center justify-content-center col-12 col-md-3 mt-2 mt-md-0  border border-0" +
                        (role === "Accounts" ? " activeRole" : "")
                      }
                      onClick={() => setRole("Accounts")}
                      type="button"
                    >
                      <img alt="roleImg" src={accountsLogo} />
                      <span className="fw-bold">Accounts</span>
                    </button>
                  </div>
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
                      autoComplete="username"
                    />
                  </div>
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
                      autoComplete="current-password"
                    />
                    <span
                      className="input-group-text authFormIcon2"
                      style={{ cursor: "pointer" }}
                      onClick={() => setVisibility(!visibility)}
                    >
                      {visibility ? <VscEye /> : <VscEyeClosed />}
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between ">
                  <Button className="generalButton" type="submit">
                    {loading ? <Loader /> : "Sign In"}
                  </Button>
                  <Button
                    className="text-light text-decoration-underline "
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </Button>
                </div>
                {formErrors.userId && (
                  <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                    <MdError className="mx-2" />{" "}
                    <span>{formErrors.userId}</span>
                  </div>
                )}
                {formErrors.password && (
                  <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                    <MdError className="mx-2" />{" "}
                    <span>{formErrors.password}</span>
                  </div>
                )}
                {formErrors.role && (
                  <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                    <MdError className="mx-2" /> <span>{formErrors.role}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="col-6 authRightImage d-none d-xl-inline-block  bg-light  ">
            <img src={door} alt="adminDoor" />
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
