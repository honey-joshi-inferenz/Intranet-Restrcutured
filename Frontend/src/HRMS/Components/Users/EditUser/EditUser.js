import React from "react";
import "./EditUser.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { useState } from "react";
import { Loader } from "../../../../Assets/Loader/Loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { useEffect } from "react";
import { Api } from "../../../../Config/API";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const EditUser = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [phone, setPhone] = useState("");
  const [values, setValues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    role: "",
    dept_name: "",
    contact: "",
    emp_code: "",
  });

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validation = (formValues, contact) => {
    var errors = {};

    if (formValues.name?.trim().length === 0) {
      errors.name = "User name is required.";
    }
    if (formValues.email?.trim().length === 0) {
      errors.email = "User email is required.";
    }
    if (formValues.role?.trim().length === 0) {
      errors.role = "Please select role.";
    }
    if (formValues.dept_name?.trim().length === 0) {
      errors.dept_name = "Please select department.";
    }
    if (contact?.trim().length === 0) {
      errors.contact = "User contact is required.";
    }

    return errors;
  };

  useEffect(() => {
    let api = new Api();
    api.getDepartments(token).then((res) => {
      setDepartments(res.data.data);
      if (res.error?.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(true);
        setMessage("Your session has been expired.");

        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });

    api.getRoles(token).then((res) => {
      setRoles(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

  const getUser = async () => {
    await axios
      .get(BASE_URL + `userAccounts/getUserAccountById?uuid=${id}`, {
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
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(values, phone);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .put(
            BASE_URL + "userAccounts/updateUserAccount",

            {
              uuid: id,
              name: values.name,
              email: values.email,
              role: values.role,
              dept_name: values.dept_name,
              emp_code: values.emp_code,
              contact: phone,
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
            setMessage("User updated succesfully.");
            setTimeout(() => {
              setLoading(false);
              handleClose();
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
              handleClose();
            }, 2000);
          });
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, 2000);
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="muiModal" sx={{ width: 600 }}>
          <div className=" w-100 modalHeader d-flex justify-content-between  align-items-center border-bottom p-4">
            <div>
              <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
                Edit User
              </h4>
            </div>
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                handleClose();
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          </div>
          {Object.keys(values).length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="modalForm p-4 pb-0">
                <div className="mb-3 d-flex flex-column flex-md-row  w-100">
                  <div className="col-12 col-md-6  me-0 me-md-2">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control formControlInput"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
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
                  <div className="col-12 col-md-6 mt-2 mt-md-0 ">
                    <label className="form-label">Email</label>
                    <input
                      type="text"
                      className="form-control formControlInput"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {formErrors.email && (
                      <div className="w-100 text-start">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3 d-flex flex-column  flex-md-row w-100">
                  <div className="col-12 col-md-6 me-0 me-md-2 d-flex flex-column ">
                    <label className="form-label">Contact</label>
                    <PhoneInput
                      country={"in"}
                      value={phone}
                      onChange={setPhone}
                      enableSearch
                      inputStyle={{ width: "100%", height: "3rem" }}
                      inputClass="contactClass"
                    />
                    {formErrors.contact && (
                      <div className="w-100 text-start">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.contact}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6 d-flex flex-column mt-2 mt-md-0 ">
                    <label className="form-label">Role</label>
                    <FormControl>
                      <Select
                        className="outlinedDropdown"
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                        displayEmpty
                        style={{ height: "90%", borderRadius: "0.4rem" }}
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        {roles?.length > 0 &&
                          roles.map((i, index) => {
                            return (
                              <MenuItem value={i.value} key={index}>
                                {i.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                    {formErrors.role && (
                      <div className="w-100 text-start">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.role}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3 d-flex flex-column flex-md-row  w-100">
                  <div className="col-md-6 col-12 me-0 me-md-2 ">
                    <label className="form-label">Department</label>
                    <FormControl className="w-100">
                      <Select
                        className="outlinedDropdown"
                        name="dept_name"
                        value={values.dept_name}
                        onChange={handleChange}
                        displayEmpty
                        style={{ height: "48px", borderRadius: "0.4rem" }}
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        {departments?.length > 0 &&
                          departments?.map((i, index) => {
                            return (
                              <MenuItem value={i.value} key={index}>
                                {i.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
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
                  <div className="col-md-6 col-12 mt-2 mt-md-0 ">
                    <label className="form-label">Employee Id</label>

                    <input
                      type="text"
                      className="form-control formControlInput"
                      name="emp_code"
                      value={values.emp_code}
                      onChange={handleChange}
                    />
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
              </div>
              <div className="modalFooter p-4 border-top d-flex justify-content-center ">
                <Button
                  className="cancelBtn fw-bold"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>
                <Button className="headerButton ms-2" type="submit">
                  {loading ? <Loader /> : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <span className="fw-bold p-4 d-flex align-items-center justify-content-center ">
              Something went wrong!
            </span>
          )}
        </Box>
      </Modal>
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
