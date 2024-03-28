import React, { useState } from "react";
import "./Registration.css";
import infLogo from "../../Assets/Logo/Logo.svg";
import register from "../../Assets/Images/Register.png";
import { MdEmail } from "react-icons/md";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RegExp } from "../../Helpers/RegExp";
import { MdError } from "react-icons/md";
import { Loader } from "../../Assets/Loader/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { BASE_URL } from "../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const Registration = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [phone, setPhone] = useState("");
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    department: "",
    empId: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    department: "",
    empId: "",
    email: "",
    conatct: "",
  });

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validate = (formValues, contact) => {
    var errors = {};

    let emailRegexp = RegExp.REACT_APP_EMAILREGEX;

    if (formValues.email?.trim().length === 0) {
      errors.email = "Email ID is required.";
    } else if (!emailRegexp.test(formValues.email)) {
      errors.email = "The value is not a valid email ID.";
    }
    if (formValues.firstName?.trim().length === 0) {
      errors.firstName = "First name is required.";
    }
    if (formValues.lastName?.trim().length === 0) {
      errors.lastName = "Last name is required.";
    }
    if (formValues.department?.trim().length === 0) {
      errors.department = "Department is required.";
    }
    if (formValues.empId?.trim().length === 0) {
      errors.empId = "Employee ID is required.";
    }
    if (contact?.trim().length === 0) {
      errors.conatct = "Contact is required.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(values, phone);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .post(BASE_URL + "userAccounts/addUserAccount", {
            email: values.email,
            name: values.firstName + " " + values.lastName,
            contact: phone,
            emp_code: values.empId,
            dept_name: values.department,
            role: "Employee",
            selfRegistration: true,
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Your account has been created succesfully.");
            localStorage.setItem("role", res.data.data.role);
            localStorage.setItem("department", res.data.data.dept_name);
            localStorage.setItem("employeeId", res.data.data.emp_code);
            localStorage.setItem("name", res.data.data.name);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("userId", res.data.data.uuid);
            setTimeout(() => {
              setLoading(false);
              navigate("/home");
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
      <div className="register d-flex  align-items-center  justify-content-center bgImg">
        <div className="authFormCard bg-transparent position-absolute w-75 ">
          <div className="d-flex flex-row">
            <div className="col-xl-6 col-12 p-5 d-flex flex-column bg-light">
              <img alt="infLogo" src={infLogo} className=" mb-3" />
              <div className="authFormCompo d-flex flex-column p-3">
                <span className="text-start text-light fs-3 fw-bold mb-3">
                  Register
                </span>
                <form onSubmit={handleSubmit}>
                  <div className="d-flex flex-column flex-md-row mb-3">
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <input
                        type="text"
                        className="form-control authFormControl"
                        placeholder="First name"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <input
                        type="text"
                        className="form-control authFormControl"
                        placeholder="Last name"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row mb-3">
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <input
                        type="text"
                        className="form-control authFormControl"
                        placeholder="Department"
                        name="department"
                        value={values.department}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <input
                        type="text"
                        className="form-control authFormControl"
                        placeholder="Employee ID"
                        name="empId"
                        value={values.empId}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-100 text-start">
                    <div className="input-group mb-3">
                      <span className="input-group-text authFormIcon">
                        <MdEmail />
                      </span>
                      <input
                        type="text"
                        className="form-control authFormControl"
                        placeholder="userid@inferenz.ai"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-100 text-start mb-3">
                    <PhoneInput
                      country={"in"}
                      value={phone}
                      onChange={setPhone}
                      enableSearch
                      inputStyle={{ width: "100%", height: "3rem" }}
                      inputClass="registerContactClass"
                    />
                  </div>
                  <div className="d-flex justify-content-between ">
                    <Button className="generalButton" type="submit">
                      {loading ? <Loader /> : "Submit"}
                    </Button>
                    <Button
                      className="text-light text-decoration-underline "
                      type="button"
                      onClick={() => navigate("/")}
                    >
                      Already have an account? Sign in here
                    </Button>
                  </div>
                  {formErrors.firstName && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.firstName}</span>
                    </div>
                  )}
                  {formErrors.lastName && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.lastName}</span>
                    </div>
                  )}
                  {formErrors.department && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.department}</span>
                    </div>
                  )}
                  {formErrors.empId && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.empId}</span>
                    </div>
                  )}
                  {formErrors.email && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                  {formErrors.conatct && (
                    <div className="validationError rounded-pill bg-danger text-light p-1 text-start mt-3 ">
                      <MdError className="mx-2" />{" "}
                      <span>{formErrors.conatct}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className="col-6 authRightImage d-none d-xl-inline-block bg-light">
              <img src={register} alt="handPuzzle" className="w-75" />
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
