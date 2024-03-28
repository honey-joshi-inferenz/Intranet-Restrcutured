import React, { useEffect, useState } from "react";
import "./UserPofile.css";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../Assets/Images/i.png";
import bg from "../../../../Assets/Backgrounds/Profile Pic Banner.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "@mui/material";
import { Loader } from "../../../../Assets/Loader/Loader";
import { MdEmail, MdEdit, MdDone } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import AppLoader from "../../../../Assets/Loader/pageLoader.gif";
import { RegExp } from "../../../../Helpers/RegExp";

export const UserPofile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { recruiterNavVisible } = useContext(SidebarContext);
  const uuid = localStorage.getItem("userId");
  const username = localStorage.getItem("name");
  const department = localStorage.getItem("department");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [phone, setPhone] = useState("");
  const [values, setValues] = useState([]);
  const [formErrors, setFormErrors] = useState({
    name: "",
    dept_name: "",
    emp_code: "",
    conatct: "",
    password: "",
  });
  const [editMode, setEditMode] = useState({
    name: false,
    dept_name: false,
    emp_code: false,
    phone: false,
    password: false,
  });

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const handleEditClick = (fieldName) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [fieldName]: !prevEditMode[fieldName],
    }));
  };

  const validate = (formValues, contact) => {
    var errors = {};

    const upperCase = RegExp.REACT_APP_UPPERCASEREGEX;
    const lowerCase = RegExp.REACT_APP_LOWERCASEREGEX;
    const digit = RegExp.REACT_APP_DIGITSREGEX;
    const specialChar = RegExp.REACT_APP_SPECIALCHARREGEX;

    if (formValues.name?.trim().length === 0) {
      errors.name = "User name is required.";
    }

    if (formValues.dept_name?.trim().length === 0) {
      errors.dept_name = "Department is required.";
    }
    if (formValues.emp_code?.trim().length === 0) {
      errors.emp_code = "Employee ID is required.";
    }
    if (contact?.trim().length === 0) {
      errors.conatct = "Contact is required.";
    }
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

    return errors;
  };

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + `userAccounts/getUserAccountById?uuid=${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setValues(res.data.data);
          setPhone(res.data.data.contact);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Your session has been expired.");

            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(values, phone);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .put(
            BASE_URL + "userAccounts/updateUserAccount",
            {
              uuid: uuid,
              name: values.name,
              contact: phone,
              password: values.password,
              dept_name: values.dept_name,
              emp_code: values.emp_code,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            localStorage.setItem("role", res.data.data.role);
            localStorage.setItem("department", res.data.data.dept_name);
            localStorage.setItem("employeeId", res.data.data.emp_code);
            localStorage.setItem("name", res.data.data.name);
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Your profile data updated succesfully.");
            setTimeout(() => {
              setLoading(false);
              setEditMode({
                name: false,
                dept_name: false,
                emp_code: false,
                phone: false,
                password: false,
              });
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
                navigate("/adms");
                localStorage.clear();
              }, 2000);
            }
            setTimeout(() => {
              setLoading(false);
              setEditMode({
                name: false,
                dept_name: false,
                emp_code: false,
                phone: false,
                password: false,
              });
            }, 2000);
          });
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
          setEditMode({
            name: false,
            dept_name: false,
            emp_code: false,
            phone: false,
            password: false,
          });
        }, 2000);
      }
    }
  };

  return (
    <div className="maincontainer">
      <Sidebar />
      <Header />
      <div
        className={
          !recruiterNavVisible
            ? "page page-without-navbar"
            : "page page-with-navbar"
        }
      >
        {Object.keys(values).length > 0 ? (
          <div className="userProfile container w-100 p-4  mt-5 mt-lg-0">
            <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
              <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
                My Profile
              </h4>
              <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/recruiter-dashboard" className="link">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    My Profile
                  </li>
                </ol>
              </div>
            </div>
            <div className="userPrfoileCompo mt-2 d-flex flex-column  justify-content-center align-items-center">
              <div className="userProfileData position-relative">
                <img src={bg} alt="bg" className="w-100" />
                <div className="userProfileBgData d-flex align-items-center ">
                  <div className="profileEllipse d-flex  justify-content-center  align-items-center">
                    <img src={logo} alt="logo" height={70} />
                  </div>
                  <div className="ms-3 text-start text-light  ">
                    <h4 className="fw-bold">{username}</h4>
                    <span className="text-light">{department}</span>
                  </div>
                </div>
              </div>
              <div className="useProfileForm w-50 p-3">
                <form onSubmit={handleSubmit}>
                  <div className="d-flex flex-column flex-md-row mb-3">
                    <div className="col-12">
                      <div className=" input-group ">
                        <input
                          type="text"
                          className={
                            "form-control userProfileInput " +
                            (editMode.name ? " editMode" : "")
                          }
                          placeholder="First name"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          readOnly={!editMode.name}
                        />
                        <span
                          className={
                            "input-group-text userProfileInputGrp" +
                            (editMode.name ? " editMode" : "")
                          }
                          onClick={() => handleEditClick("name")}
                        >
                          {editMode.name ? <MdDone /> : <MdEdit />}
                        </span>
                      </div>
                      {formErrors.name && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-100 text-start">
                    <div className="input-group mb-3">
                      <span className="input-group-text userProfileInputGrp">
                        <MdEmail />
                      </span>
                      <input
                        type="text"
                        className="form-control userProfileInput"
                        placeholder="userid@inferenz.ai"
                        name="email"
                        value={values.email}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="w-100 text-start d-flex mb-3">
                    <div className="input-group userProfileContact">
                      <PhoneInput
                        country={"in"}
                        value={phone}
                        onChange={setPhone}
                        enableSearch
                        inputStyle={{ width: "100%", height: "3rem" }}
                        inputClass={
                          "userProfileInput " +
                          (editMode.phone ? " editMode" : "")
                        }
                        disabled={!editMode.phone}
                      />
                    </div>
                    <span
                      className={
                        "input-group-text userProfileInputGrp" +
                        (editMode.phone ? " editMode" : "")
                      }
                      onClick={() => handleEditClick("phone")}
                    >
                      {editMode.phone ? <MdDone /> : <MdEdit />}
                    </span>
                  </div>
                  {formErrors.conatct && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.conatct}
                      </span>
                    </div>
                  )}
                  <div className="w-100 text-start">
                    <div className="input-group mb-3">
                      <span
                        className={
                          "input-group-text userProfileInputGrp" +
                          (editMode.password ? " editMode" : "")
                        }
                        onClick={() => setVisibility(!visibility)}
                      >
                        {visibility ? <IoMdEyeOff /> : <IoMdEye />}
                      </span>
                      <input
                        type={visibility ? "text" : "password"}
                        className={
                          "form-control userProfileInput " +
                          (editMode.password ? " editMode" : "")
                        }
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        readOnly={!editMode.password}
                      />
                      <span
                        className={
                          "input-group-text userProfileInputGrp" +
                          (editMode.password ? " editMode" : "")
                        }
                        onClick={() => handleEditClick("password")}
                      >
                        {editMode.password ? <MdDone /> : <MdEdit />}
                      </span>
                    </div>
                    {formErrors.password && (
                      <div className="w-100 text-start">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.password}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-column flex-md-row mb-3">
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <div className="input-group">
                        <input
                          type="text"
                          className={
                            "form-control userProfileInput " +
                            (editMode.dept_name ? " editMode" : "")
                          }
                          placeholder="dept_name"
                          name="dept_name"
                          value={values.dept_name}
                          onChange={handleChange}
                          readOnly={!editMode.dept_name}
                        />
                        <span
                          className={
                            "input-group-text userProfileInputGrp" +
                            (editMode.dept_name ? " editMode" : "")
                          }
                          onClick={() => handleEditClick("dept_name")}
                        >
                          {editMode.dept_name ? <MdDone /> : <MdEdit />}
                        </span>
                      </div>
                      {formErrors.dept_name && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.dept_name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-6 mt-3 mt-md-0">
                      <div className=" input-group ">
                        <input
                          type="text"
                          className={
                            "form-control userProfileInput " +
                            (editMode.emp_code ? " editMode" : "")
                          }
                          placeholder="Employee ID"
                          name="emp_code"
                          value={values.emp_code}
                          onChange={handleChange}
                          readOnly={!editMode.emp_code}
                        />
                        <span
                          className={
                            "input-group-text userProfileInputGrp" +
                            (editMode.emp_code ? " editMode" : "")
                          }
                          onClick={() => handleEditClick("emp_code")}
                        >
                          {editMode.emp_code ? <MdDone /> : <MdEdit />}
                        </span>
                      </div>
                      {formErrors.emp_code && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.emp_code}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-start mt-3">
                    <Button className="generalButton" type="submit">
                      {loading ? <Loader /> : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-100 appLoader d-flex align-items-center justify-content-center ">
            <img src={AppLoader} alt="apploader" height={100} />
          </div>
        )}
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
