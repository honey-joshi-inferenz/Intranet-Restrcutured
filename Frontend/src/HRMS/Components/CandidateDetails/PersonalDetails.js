import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useContext } from "react";
import { CandidateContext } from "../../../Context/CreateContext";
import { Api } from "../../../Config/API";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const PersonalDetails = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {
    phone,
    setPhone,
    firstPhone,
    setFirstPhone,
    secondPhone,
    setSecondPhone,
    handleChange,
    formErrors,
    filledData,
  } = useContext(CandidateContext);
  const [hrs, setHRs] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  useEffect(() => {
    let api = new Api();

    api.getAssignedOwner(token).then((res) => {
      setHRs(res.data.data);
      if (res.error?.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(false);
        setMessage("Your session has been expired.");

        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });

    // eslint-disable-next-line
  }, []);

  return (
    <div className="mt-3 w-100 d-flex flex-column flex-md-row ">
      <div
        className="col-md-4 me-0 me-md-2 card p-3"
        style={{ height: "100%" }}
      >
        <div className="mb-3 text-start">
          <label className="form-label">Assign Owner</label>
          <FormControl className="w-100">
            <Select
              className="outlinedDropdown w-100"
              name="owner_name"
              value={filledData.owner_name}
              onChange={handleChange}
              displayEmpty
              style={{ height: "48px", borderRadius: "0.4rem" }}
            >
              <MenuItem value={filledData.owner_name} disabled>
                Select
              </MenuItem>
              {hrs?.length > 0 &&
                hrs.map((i, index) => {
                  return (
                    <MenuItem value={i.email} key={index}>
                      {i.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <div className="mb-3 text-start">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control formControlInput"
            name="candidate_name"
            value={filledData.candidate_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3 text-start">
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-control formControlInput"
            name="email"
            value={filledData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3 text-start">
          <label className="form-label">Contact</label>
          <PhoneInput
            country={"in"}
            value={phone}
            onChange={setPhone}
            enableSearch
            inputStyle={{ width: "100%", height: "3rem" }}
            inputClass="contactClass"
          />
        </div>
        <div className="mb-3 text-start">
          <label className="form-label">Source of Resume</label>
          <input
            type="text"
            className="form-control formControlInput"
            name="resume_source"
            value={filledData.resume_source}
            onChange={handleChange}
          />
        </div>
        {filledData.resume_source === "Referral" && (
          <div className="mb-3 text-start">
            <label className="form-label">Referred By</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="referred_by"
              value={filledData.referred_by}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
      <div
        className="col-md-8 card p-3 mt-2 mt-md-0"
        style={{ height: "100%" }}
      >
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Current Location</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="current_location"
              value={filledData.current_location}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Permanent / Native Location</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="permanent_place"
              value={filledData.permanent_place}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Position</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="designation"
              value={filledData.designation}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Relevant Experience in The Industry
            </label>
            <input
              type="text"
              className="form-control formControlInput"
              name="relevant_it_experience"
              value={filledData.relevant_it_experience}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6  me-0 me-md-2">
            <label className="form-label">Current Organization</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="current_organisation"
              value={filledData.current_organisation}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Current CTC in LPA</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="current_ctc"
              value={filledData.current_ctc}
              onChange={handleChange}
            />
            {formErrors.current_ctc && (
              <div className="w-100 text-start">
                <span className="text-danger mx-1" style={{ fontSize: "12px" }}>
                  {formErrors.current_ctc}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Expected CTC in LPA</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="expected_ctc"
              value={filledData.expected_ctc}
              onChange={handleChange}
            />
            {formErrors.expected_ctc && (
              <div className="w-100 text-start">
                <span className="text-danger mx-1" style={{ fontSize: "12px" }}>
                  {formErrors.expected_ctc}
                </span>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Negotiated CTC in LPA</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="negotiated_ctc"
              value={filledData.negotiated_ctc}
              onChange={handleChange}
            />
            {formErrors.negotiated_ctc && (
              <div className="w-100 text-start">
                <span className="text-danger mx-1" style={{ fontSize: "12px" }}>
                  {formErrors.negotiated_ctc}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Notice Period</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="notice_period"
              value={filledData.notice_period}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Reson for Job Change</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="reason_for_job_change"
              value={filledData.reason_for_job_change}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">First Reference Name</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="reference1_name"
              value={filledData.reference1_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">First Reference Contact</label>
            <PhoneInput
              country={"in"}
              value={firstPhone}
              onChange={setFirstPhone}
              enableSearch
              inputStyle={{ width: "100%", height: "3rem" }}
              inputClass="contactClass"
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0 me-md-2">
            <label className="form-label">Second Reference Name</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="reference2_name"
              value={filledData.reference2_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Second Reference Contact</label>
            <PhoneInput
              country={"in"}
              value={secondPhone}
              onChange={setSecondPhone}
              enableSearch
              inputStyle={{ width: "100%", height: "3rem" }}
              inputClass="contactClass"
            />
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
