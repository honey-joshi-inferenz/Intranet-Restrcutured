import React, { useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { CandidateContext } from "../../../Context/CreateContext";
import { useEffect } from "react";
import { useState } from "react";
import { Api } from "../../../Config/API";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const InterviewDetails = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {
    data,
    handleChange,
    relocate,
    rejected,
    otherReason,
    handleRadioChange,
    formErrors,
    hired,
    otherOffer,
    softSkills,
    filledData,
  } = useContext(CandidateContext);
  const [hrStatus, setHrStatus] = useState([]);
  const [finalStatus, setFinalStatus] = useState([]);
  const [interiewRounds, setInterviewRounds] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  useEffect(() => {
    let api = new Api();

    api.getFinalStatus(token).then((res) => {
      setFinalStatus(res.data.data);
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
    api.getHrStatus(token).then((res) => {
      setHrStatus(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    api.getInterviewRound(token).then((res) => {
      setInterviewRounds(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    api.getListOfInterviewers(token).then((res) => {
      setInterviewers(res.data.data);
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
    <div className="mt-3 w-100 d-flex flex-column ">
      <div className="card p-3">
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">HR Status</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="status_hr"
                value={filledData.status_hr}
                onChange={handleChange}
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value={filledData.status_hr} disabled>
                  Select
                </MenuItem>
                {hrStatus?.length > 0 &&
                  hrStatus.map((i, index) => {
                    return (
                      <MenuItem value={i.value} key={index}>
                        {i.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interviewer</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="interviewer_name"
                value={filledData.interviewer_name}
                onChange={handleChange}
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value={filledData.interviewer_name} disabled>
                  Select
                </MenuItem>
                {interviewers?.length > 0 &&
                  interviewers.map((i, index) => {
                    return (
                      <MenuItem
                        value={i.email}
                        key={index}
                        disabled={i.visible === true ? false : true}
                      >
                        {i.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interview Round</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="interview_round"
                value={filledData.interview_round}
                onChange={handleChange}
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value={filledData.interview_round} disabled>
                  Select
                </MenuItem>
                {interiewRounds?.length > 0 &&
                  interiewRounds.map((i, index) => {
                    return (
                      <MenuItem value={i.value} key={index}>
                        {i.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interview Date</label>
            <input
              type="date"
              className="form-control formControlInput"
              name="interview_date"
              value={filledData.interview_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-4 me-0 me-md-1">
            <label className="form-label">Interview Time</label>
            <input
              type="time"
              className="form-control formControlInput"
              name="interview_time"
              value={filledData.interview_time}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">
              Considered for next round ? (Yes / No)
            </label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="eligible_for_next_round"
                value={filledData.eligible_for_next_round}
                onChange={handleChange}
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value={filledData.eligible_for_next_round} disabled>
                  Select
                </MenuItem>
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">Interview Feedback</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="interview_feedback"
              value={filledData.interview_feedback}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Remarks from HR</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="remarks_hr"
              value={filledData.remarks_hr}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="card p-3 mt-3">
        <div className="d-flex flex-xl-row flex-column mb-2">
          <div className="d-flex flex-column  col-12 col-xl-7 text-start">
            <label className="form-label">Logical</label>
            <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
              Points to Consider : Rational, Reasoned, Sensible
            </span>
          </div>
          <div className="col-12 col-xl-5 d-flex justify-content-xl-end flex-md-row flex-column ">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="logicalFeedback"
                value="Good"
                onChange={handleChange}
                checked={softSkills?.logicalFeedback === "Good"}
              />
              <label className="form-check-label form-label">Good</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="logicalFeedback"
                value="Average"
                onChange={handleChange}
                checked={softSkills?.logicalFeedback === "Average"}
              />
              <label className="form-check-label form-label">Average</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="logicalFeedback"
                value="Bad"
                onChange={handleChange}
                checked={softSkills?.logicalFeedback === "Bad"}
              />
              <label className="form-check-label form-label">Bad</label>
            </div>
          </div>
        </div>
        <div className="d-flex flex-xl-row flex-column mb-2">
          <div className="col-12 col-xl-7 text-start d-flex flex-column ">
            <label className="form-label  ">Analytical</label>
            <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
              Points to Consider : Systematic, Perceptive, Insightful
            </span>
          </div>
          <div className="col-12 col-xl-5 d-flex justify-content-xl-end flex-md-row flex-column ">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="analyticalFeedback"
                value="Good"
                onChange={handleChange}
                checked={softSkills?.analyticalFeedback === "Good"}
              />
              <label className="form-check-label form-label">Good</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="analyticalFeedback"
                value="Average"
                onChange={handleChange}
                checked={softSkills?.analyticalFeedback === "Average"}
              />
              <label className="form-check-label form-label">Average</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="analyticalFeedback"
                value="Bad"
                onChange={handleChange}
                checked={softSkills?.analyticalFeedback === "Bad"}
              />
              <label className="form-check-label form-label">Bad</label>
            </div>
          </div>
        </div>
        <div className="d-flex flex-xl-row flex-column mb-2">
          <div className="d-flex flex-column col-12 col-xl-7 text-start">
            <label className="form-label ">Confidence</label>
            <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
              Points to Consider : Self-Assurance, Poise, Self-Confidence
            </span>
          </div>
          <div className="col-12 col-xl-5 d-flex  justify-content-xl-end flex-md-row flex-column ">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="confidenceFeedback"
                value="Good"
                onChange={handleChange}
                checked={softSkills?.confidenceFeedback === "Good"}
              />
              <label className="form-check-label form-label">Good</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="confidenceFeedback"
                value="Average"
                onChange={handleChange}
                checked={softSkills?.confidenceFeedback === "Average"}
              />
              <label className="form-check-label form-label">Average</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="confidenceFeedback"
                value="Bad"
                onChange={handleChange}
                checked={softSkills?.confidenceFeedback === "Bad"}
              />
              <label className="form-check-label form-label">Bad</label>
            </div>
          </div>
        </div>
        <div className="d-flex flex-xl-row flex-column mb-2">
          <div className="d-flex flex-column col-12 col-xl-7 text-start">
            <label className="form-label ">Communication Skills</label>
            <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
              Points to Consider : Interpersonal Skills, Articulate Expression,
              Effective Discourse
            </span>
          </div>
          <div className="col-12 col-xl-5 d-flex justify-content-xl-end flex-md-row flex-column ">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="communicationFeedback"
                value="Good"
                onChange={handleChange}
                checked={softSkills?.communicationFeedback === "Good"}
              />
              <label className="form-check-label form-label">Good</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="communicationFeedback"
                value="Average"
                onChange={handleChange}
                checked={softSkills?.communicationFeedback === "Average"}
              />
              <label className="form-check-label form-label">Average</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="communicationFeedback"
                value="Bad"
                onChange={handleChange}
                checked={softSkills?.communicationFeedback === "Bad"}
              />
              <label className="form-check-label form-label">Bad</label>
            </div>
          </div>
        </div>
        <div className="d-flex flex-xl-row flex-column">
          <div className="d-flex flex-column  col-12 col-xl-7 text-start">
            <label className="form-label ">Attitude</label>
            <span style={{ fontSize: "12px", color: "#B5B5C3" }}>
              Points to Consider : Mindset, Outlook, Approach
            </span>
          </div>
          <div className="col-12 col-xl-5 d-flex  justify-content-xl-end flex-md-row flex-column">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="attitudeFeedback"
                value="Good"
                onChange={handleChange}
                checked={softSkills?.attitudeFeedback === "Good"}
              />
              <label className="form-check-label form-label">Good</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="attitudeFeedback"
                value="Average"
                onChange={handleChange}
                checked={softSkills?.attitudeFeedback === "Average"}
              />
              <label className="form-check-label form-label">Average</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="attitudeFeedback"
                value="Bad"
                onChange={handleChange}
                checked={softSkills?.attitudeFeedback === "Bad"}
              />
              <label className="form-check-label form-label">Bad</label>
            </div>
          </div>
        </div>
      </div>
      <div className="card p-3 mt-3">
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div
            className={
              "col-12 me-0 " +
              ((relocate && !otherOffer) || (otherOffer && !relocate)
                ? " col-md-4 me-md-1 "
                : " col-md-6 me-md-2 ")
            }
          >
            <label className="form-label">Ready to Relocate ?</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="relocate_to_ahmedabad"
                value={filledData.relocate_to_ahmedabad}
                onChange={handleChange}
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value={filledData.relocate_to_ahmedabad} disabled>
                  Select
                </MenuItem>
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
                <MenuItem value={2}>Other</MenuItem>
              </Select>
            </FormControl>
          </div>
          {relocate && !otherOffer && (
            <div className="col-12 col-md-4 me-0  me-md-1">
              <label className="form-label">Relocate Location</label>
              <input
                type="text"
                className="form-control formControlInput"
                name="relocate_location"
                value={filledData.relocate_location}
                onChange={handleChange}
              />
            </div>
          )}
          <div
            className={
              "col-12 " +
              ((relocate && !otherOffer) || (otherOffer && !relocate)
                ? " col-md-4 "
                : " col-md-6 ")
            }
          >
            <label className="form-label">
              Do You Have Any Other Offer on Your Hand ?
            </label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="other_offer_on_hand"
                value={filledData.other_offer_on_hand}
                onChange={handleChange}
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value={filledData.other_offer_on_hand} disabled>
                  Select
                </MenuItem>
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </Select>
            </FormControl>
          </div>
          {otherOffer && !relocate && (
            <div className="col-12 col-md-4 ms-0  ms-md-1">
              <label className="form-label">Other Offer Amount</label>
              <input
                type="text"
                className="form-control formControlInput"
                name="other_offer_amount"
                value={filledData.other_offer_amount}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        {relocate && otherOffer && (
          <div className="d-flex flex-md-row flex-column text-start mb-3">
            <div className="col-12 me-0  col-md-6 me-md-2 ">
              <label className="form-label">Relocate Location</label>
              <input
                type="text"
                className="form-control formControlInput"
                name="relocate_location"
                value={filledData.relocate_location}
                onChange={handleChange}
              />
            </div>

            <div className="col-12  col-md-6 ">
              <label className="form-label">Other Offer Amount</label>
              <input
                type="text"
                className="form-control formControlInput"
                name="other_offer_amount"
                value={filledData.other_offer_amount}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">Final Status</label>
            <FormControl className="w-100">
              <Select
                className="outlinedDropdown w-100"
                name="final_status"
                value={filledData.final_status}
                onChange={handleChange}
                displayEmpty
                style={{ height: "48px", borderRadius: "0.4rem" }}
              >
                <MenuItem value={filledData.final_status} disabled>
                  Select
                </MenuItem>
                {finalStatus?.length > 0 &&
                  finalStatus.map((i, index) => {
                    return (
                      <MenuItem value={i.value} key={index}>
                        {i.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>

          <div className="col-12 col-md-6 me-0  me-md-2">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              className="form-control formControlInput"
              name="joinig_date"
              value={filledData.joinig_date}
              onChange={handleChange}
              disabled={!hired}
            />
          </div>
        </div>
        {rejected && (
          <div className="d-flex flex-md-row flex-column text-start mb-3">
            <div className="col-12 col-md-6 me-0  me-md-2">
              <label className="form-label">
                Do you want to send rejection email to candidate?
              </label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sendRejectionEmail"
                    value={true}
                    onChange={handleRadioChange}
                  />
                  <label className="form-check-label form-label">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sendRejectionEmail"
                    value={false}
                    onChange={handleRadioChange}
                  />
                  <label className="form-check-label form-label">No</label>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 me-0  me-md-2">
              <label className="form-label">Select Reason</label>
              <FormControl className="w-100">
                <Select
                  className="outlinedDropdown w-100"
                  name="template_no"
                  value={filledData.template_no}
                  onChange={handleChange}
                  displayEmpty
                  style={{ height: "48px", borderRadius: "0.4rem" }}
                >
                  <MenuItem value={filledData.template_no} disabled>
                    Select
                  </MenuItem>
                  <MenuItem value={1}>Skillset Does Not Match</MenuItem>
                  <MenuItem value={2}>High Salary Expectations</MenuItem>
                  <MenuItem value={4}>We haven't received a response</MenuItem>
                  <MenuItem value={5}>Positions filled</MenuItem>
                  <MenuItem value={6}>More experienced candidate</MenuItem>
                  <MenuItem value={7}>Eligibility after six months</MenuItem>
                  <MenuItem value={8}>Geographical constraint</MenuItem>
                  <MenuItem value={9}>Expertise is not aligned</MenuItem>
                  <MenuItem value={3}>Other</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        )}

        <div className="d-flex flex-md-row flex-column text-start mb-3">
          {filledData.resume_source === "Referral" && rejected && (
            <div
              className={
                otherReason ? "col-12 col-md-6 me-0 me-md-2" : "col-12"
              }
            >
              <label className="form-label">Referral Update for Employee</label>
              <textarea
                type="text"
                className="form-control formControlInput"
                name="employee_update"
                value={filledData.employee_update}
                onChange={handleChange}
              />
            </div>
          )}
          {otherReason && (
            <div
              className={
                filledData.resume_source === "Referral"
                  ? "col-12 col-md-6"
                  : "col-12"
              }
            >
              <label className="form-label">Add Reason</label>
              <textarea
                type="text"
                className="form-control formControlInput"
                name="other_reason"
                value={filledData.other_reason}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12 col-md-6  me-0  me-md-2">
            <label className="form-label">Offered Salary in LPA</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="offered_salary"
              value={filledData.offered_salary}
              onChange={handleChange}
              disabled={
                !hired ||
                (hired &&
                  filledData.offered_salary !== "" &&
                  filledData.offered_salary === data.offered_salary)
              }
            />
            {formErrors.offered_salary && (
              <div className="w-100 text-start">
                <span className="text-danger mx-1" style={{ fontSize: "12px" }}>
                  {formErrors.offered_salary}
                </span>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Offered Bonus if Any</label>
            <input
              type="text"
              className="form-control formControlInput"
              name="offered_bonus"
              value={filledData.offered_bonus}
              onChange={handleChange}
              disabled={
                !hired ||
                (hired &&
                  filledData.offered_bonus !== "" &&
                  filledData.offered_bonus === data.offered_bonus)
              }
            />
          </div>
        </div>
        <div className="d-flex flex-md-row flex-column text-start mb-3">
          <div className="col-12">
            <label className="form-label">Final Remarks</label>
            <textarea
              type="text"
              className="form-control formControlInput"
              name="final_remarks"
              value={filledData.final_remarks}
              onChange={handleChange}
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
