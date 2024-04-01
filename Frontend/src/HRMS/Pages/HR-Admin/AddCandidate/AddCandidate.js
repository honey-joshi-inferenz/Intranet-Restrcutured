import React, { useEffect, useState } from "react";
import "./AddCandidate.css";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import Button from "@mui/material/Button";
import { UploadFileModal } from "../../../Components/AddCandidate/UploadFileModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Loader } from "../../../../Assets/Loader/Loader";
import { RegExp } from "../../../../Helpers/RegExp";
import { Api } from "../../../../Config/API";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AddCandidate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const inputRef = useRef();
  const { recruiterNavVisible } = useContext(SidebarContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loading, setLoading] = useState(false);
  const [others, setOthers] = useState(false);
  const [Phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [positions, setPositions] = useState([]);
  const [sources, setSources] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    currentLocation: "",
    permanentLocation: "",
    position: "",
    experience: "",
    currentOrganization: "",
    noticePeriod: "",
    reasonOfJobChange: "",
    linkedin: "",
    resumeSource: "",
    otherResumeSource: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    position: "",
    resumeSource: "",
    otherResumeSource: "",
    resume: "",
  });

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
    if (name === "resumeSource" && value === "Others") {
      setOthers(true);
    } else if (name === "resumeSource" && value !== "Others") {
      setOthers(false);
    }
  };

  const handleFile = (file) => {
    setFile(file);
  };

  const validate = (formvalues, file) => {
    var errors = {};
    const specialCharRegExp = RegExp.REACT_APP_SPECIALCHARREGEX;

    if (formvalues.resumeSource?.trim().length === 0) {
      errors.resumeSource = "Please select source of resume.";
    }
    if (others && formvalues.otherResumeSource?.trim().length === 0) {
      errors.otherResumeSource = "Please enter source of resume.";
    }
    if (formvalues.name?.trim().length === 0) {
      errors.name = "Candidate name is required.";
    }
    if (formvalues.email?.trim().length === 0) {
      errors.email = "Candidate email is required.";
    } else if (!specialCharRegExp.test(formvalues.email)) {
      errors.email = "The value is not a valid email ID.";
    }
    if (formvalues.position?.trim().length === 0) {
      errors.position = "Please select position.";
    }
    if (file === null) {
      errors.resume = "Please select candidate Resume / CV.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(values, file);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      const bodyData = {
        candidate_name: values.name,
        email: values.email,
        contact: Phone,
        resume_source:
          values.resumeSource === "Others"
            ? values.otherResumeSource
            : values.resumeSource,
        designation: values.position,
        relevant_it_experience: values.experience,
        current_organisation: values.currentOrganization,
        current_location: values.currentLocation,
        permanent_place: values.permanentLocation,
        notice_period: values.noticePeriod,
        reason_for_job_change: values.reasonOfJobChange,
        candidate_linkedin: values.linkedin,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(bodyData));
      formData.append("candidate_resume", file);

      try {
        await axios
          .post(BASE_URL + "candidate/addCandidateProfile", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Candidate added succesfully.");
            setTimeout(() => {
              setLoading(false);
              handleClear();
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

  const handleClear = () => {
    setValues({
      name: "",
      email: "",
      currentLocation: "",
      permanentLocation: "",
      position: "",
      experience: "",
      currentOrganization: "",
      noticePeriod: "",
      reasonOfJobChange: "",
      linkedin: "",
      resumeSource: "",
      otherResumeSource: "",
    });
    setFormErrors({
      name: "",
      email: "",
      position: "",
      resumeSource: "",
      otherResumeSource: "",
      resume: "",
    });
    setPhone("");
    inputRef.current.value = null;
    setFile(null);
  };

  useEffect(() => {
    let api = new Api();

    api.getPositions(token).then((res) => {
      setPositions(res.data.data);
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

    api.getSources(token).then((res) => {
      setSources(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

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
        <div className="addCandidate container w-100 p-4 mt-5 mt-lg-0">
          <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Add Candidate
            </h4>
            <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/recruiter-dashboard" className="link">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Candidate
                </li>
              </ol>
            </div>
          </div>
          <div className="addCandidateCompo mt-2">
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-column flex-md-row">
                <div className="card p-3 col-12 col-md-4 me-0 me-md-2 addCandidateCardLeft">
                  <div className="mb-3 text-start">
                    <label className="form-label">Source of Resume</label>
                    <FormControl className="w-100">
                      <Select
                        className="outlinedDropdown w-100"
                        name="resumeSource"
                        value={values.resumeSource}
                        onChange={handleChange}
                        displayEmpty
                        style={{ height: "48px", borderRadius: "0.4rem" }}
                      >
                        <MenuItem value="" disabled>
                          Select
                        </MenuItem>
                        {sources?.length > 0 &&
                          sources.map((i, index) => {
                            return (
                              <MenuItem value={i.value} key={index}>
                                {i.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                    {formErrors.resumeSource && (
                      <div className="w-100 text-start">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.resumeSource}
                        </span>
                      </div>
                    )}
                  </div>
                  {others && (
                    <div className="mb-3 text-start">
                      <label className="form-label">Others</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="otherResumeSource"
                        value={values.otherResumeSource}
                        onChange={handleChange}
                      />
                      {formErrors.otherResumeSource && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.otherResumeSource}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mb-3 text-start">
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
                  <div className="mb-3 text-start">
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
                  <div className="mb-3 text-start">
                    <label className="form-label">Contact</label>
                    <PhoneInput
                      country={"in"}
                      value={Phone}
                      onChange={setPhone}
                      enableSearch
                      inputStyle={{ width: "100%", height: "3rem" }}
                      inputClass="contactClass"
                    />
                  </div>
                </div>
                <div className="card p-3 col-12 col-md-8 mt-2 mt-md-0 addCandidateCardRight">
                  <div className="d-flex flex-md-row flex-column text-start mb-3">
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <label className="form-label">Current Location</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="currentLocation"
                        value={values.currentLocation}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">
                        Permanent / Native Location
                      </label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="permanentLocation"
                        value={values.permanentLocation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-md-row flex-column text-start mb-3">
                    <div className="col-12 col-md-6  me-0 me-md-2">
                      <label className="form-label">Position</label>
                      <FormControl className="w-100">
                        <Select
                          className="outlinedDropdown w-100"
                          displayEmpty
                          name="position"
                          onChange={handleChange}
                          value={values.position}
                          style={{ height: "48px", borderRadius: "0.4rem" }}
                        >
                          <MenuItem value="" disabled>
                            Select
                          </MenuItem>
                          {positions?.length > 0 &&
                            positions.map((i, index) => {
                              return (
                                <MenuItem value={i.value} key={index}>
                                  {i.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      {formErrors.position && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.position}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">
                        Relevant Experience in The Industry
                      </label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="experience"
                        value={values.experience}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-md-row flex-column text-start mb-3">
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <label className="form-label">Current Organization</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="currentOrganization"
                        value={values.currentOrganization}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Notice Period</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="noticePeriod"
                        value={values.noticePeriod}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-md-row flex-column text-start mb-3">
                    <div className="col-12 col-md-6 me-0 me-md-2">
                      <label className="form-label">Reson for Job Change</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="reasonOfJobChange"
                        value={values.reasonOfJobChange}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6 ">
                      <label className="form-label">Linkedin Profile</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="linkedin"
                        value={values.linkedin}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="text-start mb-3">
                    <label className="form-label">Resume / CV</label>
                    <input
                      ref={inputRef}
                      type="file"
                      className="form-control formControlInput"
                      accept=".doc,.docx,.pdf"
                      onChange={(e) => handleFile(e.target.files[0])}
                    />
                    {formErrors.resume && (
                      <div className="w-100 text-start">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.resume}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end  w-100 mt-2">
                <Button className="headerButton" type="submit">
                  {loading ? <Loader /> : "Submit"}
                </Button>
                <Button className="headerButton ms-2" onClick={handleOpen}>
                  Upload File
                </Button>
              </div>
            </form>
            <UploadFileModal open={open} handleClose={handleClose} />
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
