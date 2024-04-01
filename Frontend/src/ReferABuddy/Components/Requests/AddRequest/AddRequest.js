import React, { useEffect, useRef } from "react";
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
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Api } from "../../../../Config/API";
import { useNavigate } from "react-router-dom";

export const AddReferRequest = ({ open, handleClose, getData }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [phone, setPhone] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    designation: "",
    totalExp: "",
    linedIn: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    designation: "",
    totalExp: "",
    contact: "",
  });
  const [file, setFile] = useState(null);
  const [fileSuccessMsg, setFileSuccessMsg] = useState("");
  const [department, setDepartment] = useState([]);

  const empName = localStorage.getItem("name");
  const empEmail = localStorage.getItem("email");

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

  const validation = (formValues, file, contact) => {
    var errors = {};
    if (file === null) {
      errors.file = "Please select resume.";
    } else if (file?.type === "application/pdf" && file?.size < 5000000) {
      setFileSuccessMsg("File uploded Successfully.");
    } else if (file?.size > 5000000) {
      errors.file = "File is too large ! Maximum file size is 5 MB.";
    } else {
      errors.file = "Failed to upload file; the format is not supported.";
    }
    if (formValues.name?.trim().length === 0) {
      errors.name = "Candidate name is required.";
    }
    if (formValues.email?.trim().length === 0) {
      errors.email = "Candidate email is required.";
    }
    if (formValues.designation?.trim().length === 0) {
      errors.designation = "Please select designation.";
    }
    if (formValues.totalExp?.trim().length === 0) {
      errors.totalExp = "Total experience is required.";
    }
    if (contact?.trim().length === 0) {
      errors.contact = "Candidate contact is required.";
    }

    return errors;
  };

  useEffect(() => {
    let api = new Api();

    api.getPositions(token).then((res) => {
      setDepartment(res.data.data);
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
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(values, file, phone);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      const bodyData = {
        candidate_name: values.name,
        email: values.email,
        contact: phone,
        designation: values.designation,
        relevant_it_experience: values.totalExp,
        candidate_linkedin: values.linedIn,
        referred_by: empName,
        referral_email: empEmail,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(bodyData));
      formData.append("candidate_resume", file);

      try {
        await axios
          .post(BASE_URL + "referral/addReferralRequest", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Your request has been added succesfully.");
            setTimeout(() => {
              setLoading(false);
              handleClose();
              handleClear();
              getData();
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

  const handleClear = () => {
    setValues({
      name: "",
      email: "",
      designation: "",
      totalExp: "",
      linedIn: "",
    });
    setFormErrors({
      name: "",
      email: "",
      designation: "",
      totalExp: "",
      contact: "",
    });
    setPhone("");
    setFileSuccessMsg("");
    inputRef.current.value = null;
    setFile(null);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="muiModal w-50">
          <div className=" w-100 modalHeader d-flex justify-content-between  align-items-center border-bottom p-4">
            <div>
              <h4
                className="fw-bold text-start w-100"
                style={{ color: "#042049" }}
              >
                Add Request
              </h4>
            </div>
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                handleClose();
                handleClear();
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modalForm p-4 pt-1 pb-0">
              <div className="mb-3 d-flex flex-column flex-md-row  w-100">
                <div className="col-12 col-md-6  me-0 me-md-2">
                  <label className="form-label">Candidate Name</label>
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
                  <label className="form-label">Candidate Email</label>
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
                  <label className="form-label">Candidate Contact</label>
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
                  <label className="form-label">Designation</label>
                  <FormControl>
                    <Select
                      className="outlinedDropdown"
                      name="designation"
                      value={values.designation}
                      onChange={handleChange}
                      displayEmpty
                      style={{ height: "90%", borderRadius: "0.4rem" }}
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      {department.length > 0 &&
                        department.map((i, index) => {
                          return (
                            <MenuItem value={i.value} key={index}>
                              {i.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  {formErrors.designation && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.designation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3 d-flex flex-column flex-md-row  w-100">
                <div className="col-12 col-md-6  me-0 me-md-2">
                  <label className="form-label">Total Experience</label>
                  <input
                    type="text"
                    className="form-control formControlInput"
                    name="totalExp"
                    value={values.totalExp}
                    onChange={handleChange}
                  />
                  {formErrors.totalExp && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.totalExp}
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6 mt-2 mt-md-0 ">
                  <label className="form-label">Linkedin Profile</label>
                  <input
                    type="text"
                    className="form-control formControlInput"
                    name="linedIn"
                    value={values.linedIn}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Resume/CV</label>
                <input
                  ref={inputRef}
                  accept="application/pdf,.doc, .docx"
                  type="file"
                  className="form-control formControlInput"
                  name="invoice"
                  onChange={(e) => {
                    handleFile(e.target.files[0]);
                  }}
                />
                <span
                  className="text-center mt-3 w-75"
                  style={{ fontSize: "13px", color: "#A1A5B7" }}
                >
                  .pdf,.doc, .docx file only. Maximum file size is 5 MB.
                </span>
                {(formErrors.file || fileSuccessMsg) && (
                  <div className="w-100 text-start">
                    <span
                      className={
                        formErrors.file
                          ? "text-danger mx-1"
                          : "text-success  mx-1"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {formErrors.file
                        ? formErrors.file
                        : fileSuccessMsg
                        ? fileSuccessMsg
                        : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="modalFooter p-4 border-top d-flex justify-content-center ">
              <Button
                className="cancelBtn fw-bold"
                onClick={() => {
                  handleClose();
                  handleClear();
                }}
              >
                Cancel
              </Button>
              <Button className="headerButton ms-2" type="submit">
                {loading ? <Loader /> : "Submit"}
              </Button>
            </div>
          </form>
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
