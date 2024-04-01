import React, { useState } from "react";
import "./CandidateDetails.css";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import {
  CandidateContext,
  SidebarContext,
} from "../../../../Context/CreateContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RoundStepper } from "../../../Components/CandidateDetails/Stepper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { PersonalDetails } from "../../../Components/CandidateDetails/PersonalDetails";
import { InterviewDetails } from "../../../Components/CandidateDetails/InterviewDetails";
import { History } from "../../../Components/CandidateDetails/History";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { Api } from "../../../../Config/API";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { UpdateResume } from "../../../Components/CandidateDetails/UpdateResume";
import { RegExp } from "../../../../Helpers/RegExp";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Loader } from "../../../../Assets/Loader/Loader";
import AppLoader from "../../../../Assets/Loader/pageLoader.gif";

export const CandidateDetails = () => {
  const navigate = useNavigate();
  const params = useParams();

  const decimalRegexp = RegExp.REACT_APP_DECIMALREGEX;
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("name");
  const { recruiterNavVisible } = useContext(SidebarContext);
  const {
    data,
    setData,
    setHistory,
    setPhone,
    setFirstPhone,
    setSecondPhone,
    setRejected,
    setOtherReason,
    file,
    phone,
    firstPhone,
    secondPhone,
    sendRejectionEmail,
    setRelocate,
    setFormErrors,
    setCurrentRound,
    setFile,
    setHired,
    setOtherOffer,
    softSkills,
    setSoftSkills,
    filledData,
    setFilledData,
  } = useContext(CandidateContext);
  const [stage, setStage] = useState("1");
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openMenu = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setAnchorEl(event.target);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event, newValue) => {
    window.scrollTo(0, 0);
    setStage(newValue);
  };

  useEffect(() => {
    let api = new Api();

    api.getCandidateData(params.id, token).then((res) => {
      setData(res.data.currentRoundData[0]);
      setFilledData(res.data.currentRoundData[0]);
      setPhone(res.data.currentRoundData[0].contact);
      setFirstPhone(res.data.currentRoundData[0].reference1_contact);
      setSecondPhone(res.data.currentRoundData[0].reference2_contact);
      setCurrentRound(res.data.currentRoundData[0].interview_round);
      setHistory(res.data.historyData);
      const interviewSoftSkills = JSON.parse(
        res.data.currentRoundData[0].interview_softSkills
      );
      setSoftSkills(interviewSoftSkills);

      if (
        res.data.currentRoundData[0].final_status === "Rejected" ||
        res.data.currentRoundData[0].final_status === "Irrelevant Profile" ||
        res.data.currentRoundData[0].final_status === "Location Not Matched" ||
        res.data.currentRoundData[0].final_status ===
          "Salary Expectation High" ||
        res.data.currentRoundData[0].final_status === "Not Appeared" ||
        res.data.currentRoundData[0].final_status === "Declined Offer" ||
        res.data.currentRoundData[0].final_status === "Not Res.dataponded"
      ) {
        setRejected(true);
      }

      if (Number(res.data.currentRoundData[0].template_no) === 3) {
        setOtherReason(true);
      }

      if (
        res.data.currentRoundData[0].relocate_to_ahmedabad === 1 ||
        res.data.currentRoundData[0].relocate_to_ahmedabad === 2
      ) {
        setRelocate(true);
      }

      if (res.data.currentRoundData[0].other_offer_on_hand === 1) {
        setOtherOffer(true);
      }

      if (res.data.currentRoundData[0].final_status === "Hired") {
        setHired(true);
      }

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

  const validation = (formValues) => {
    var errors = {};

    if (
      formValues.current_ctc?.trim().length !== 0 &&
      !decimalRegexp.test(formValues.current_ctc)
    ) {
      errors.current_ctc = "Please enter valid numbers";
    }
    if (
      formValues.expected_ctc?.trim().length !== 0 &&
      !decimalRegexp.test(formValues.expected_ctc)
    ) {
      errors.expected_ctc = "Please enter valid numbers";
    }
    if (
      formValues.negotiated_ctc?.trim().length !== 0 &&
      !decimalRegexp.test(formValues.negotiated_ctc)
    ) {
      errors.negotiated_ctc = "Please enter valid numbers";
    }
    if (
      formValues.offered_salary?.trim().length !== 0 &&
      !decimalRegexp.test(formValues.offered_salary)
    ) {
      errors.offered_salary = "Please enter valid numbers";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(data);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      const bodyData = {
        uuid: filledData.uuid,
        email: filledData.email,
        candidate_name: filledData.candidate_name,
        contact: phone,
        resume_source: filledData.resume_source,
        referred_by: filledData.referred_by,
        referral_email: filledData.referral_email,
        current_location: filledData.current_location,
        permanent_place: filledData.permanent_place,
        designation: filledData.designation,
        relevant_it_experience: filledData.relevant_it_experience,
        current_organisation: filledData.current_organisation,
        current_ctc: filledData.current_ctc,
        expected_ctc: filledData.expected_ctc,
        negotiated_ctc: filledData.negotiated_ctc,
        notice_period: filledData.notice_period,
        reason_for_job_change: filledData.reason_for_job_change,
        reference1_name: filledData.reference1_name,
        reference1_contact: firstPhone,
        reference2_name: filledData.reference2_name,
        reference2_contact: secondPhone,
        candidate_linkedin: filledData.candidate_linkedin,
        status_hr: filledData.status_hr,
        interviewer_name: filledData.interviewer_name,
        interview_round: filledData.interview_round,
        interview_date: filledData.interview_date,
        interview_time: filledData.interview_time,
        eligible_for_next_round: filledData.eligible_for_next_round,
        interview_feedback: filledData.interview_feedback,
        interview_softSkills: JSON.stringify(softSkills),
        remarks_hr: filledData.remarks_hr,
        relocate_to_ahmedabad: filledData.relocate_to_ahmedabad,
        relocate_location: filledData.relocate_location,
        other_offer_on_hand: filledData.other_offer_on_hand,
        other_offer_amount: filledData.other_offer_amount,
        final_status: filledData.final_status,
        offered_date: filledData.offered_date,
        joinig_date: filledData.joinig_date,
        template_no: filledData.template_no,
        employee_update: filledData.employee_update,
        other_reason: filledData.other_reason,
        offered_salary: filledData.offered_salary,
        offered_bonus: filledData.offered_bonus,
        final_remarks: filledData.final_remarks,
        owner_name: filledData.owner_name,
        sendRejectionEmail: sendRejectionEmail,
        modified_by: user,
        applied_date: filledData.applied_date,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(bodyData));
      formData.append("candidate_resume", file !== null ? file : null);

      try {
        await axios
          .put(BASE_URL + "candidate/updateCandidateProfile", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setData(res.data.data.currentRoundData[0]);
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Candidate profile updated succesfully.");
            setFile(null);
            setTimeout(() => {
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
        {Object.keys(data).length > 0 ? (
          <div className="candidateDetails container w-100 p-4 mt-5 mt-lg-0">
            <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
              <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
                Candidate Details
              </h4>
              <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/recruiter-dashboard" className="link">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Candidate Details
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {data?.candidate_name}
                  </li>
                </ol>
              </div>
            </div>
            <div className="candidateDetailsCompo mt-2 d-flex flex-lg-row flex-column ">
              <RoundStepper />
              <div className="col-md-12 col-lg-10">
                <TabContext value={stage}>
                  <Box>
                    <TabList onChange={handleChange}>
                      <Tab label="Personal Details" value="1" />
                      <Tab label="Interview Details" value="2" />
                      <Tab label="History" value="3" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <PersonalDetails />
                    <div className="mt-2 d-flex justify-content-md-between flex-md-row flex-column   w-100">
                      <div className="d-flex">
                        {data.candidate_linkedin &&
                        data.candidate_linkedin.toString().length > 15 ? (
                          <a
                            href={data.candidate_linkedin}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button className="cancelBtn fw-bold me-2">
                              View LinkedIn Profile
                            </Button>
                          </a>
                        ) : (
                          <Button
                            className="cancelBtn noLinkBtn fw-bold me-2"
                            disabled
                          >
                            View LinkedIn Profile
                          </Button>
                        )}

                        <Button
                          className="cancelBtn fw-bold"
                          aria-controls={openMenu ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={openMenu ? "true" : undefined}
                          onClick={(e) => {
                            handleClick(e);
                          }}
                        >
                          View Resume / CV
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={openMenu}
                          onClose={handleMenuClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {data.candidate_resume === null ||
                          data.candidate_resume === "null" ||
                          data.candidate_resume === "" ? (
                            <MenuItem
                              onClick={handleMenuClose}
                              className="noLinkBtn"
                              disabled
                            >
                              View Resume
                            </MenuItem>
                          ) : (
                            <a
                              href={data.candidate_resume}
                              target="_blank"
                              rel="noreferrer"
                              className="link"
                            >
                              <MenuItem onClick={handleMenuClose}>
                                View Resume
                              </MenuItem>
                            </a>
                          )}
                          <MenuItem
                            onClick={() => {
                              handleOpen();
                              handleMenuClose();
                            }}
                          >
                            Update Resume
                          </MenuItem>
                        </Menu>
                      </div>
                      <div className="mt-2 mt-md-0">
                        <Button
                          className="cancelBtn fw-bold"
                          onClick={(e) => handleChange(e, "2")}
                        >
                          Next
                        </Button>
                        <Button
                          className="headerButton ms-2"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          {loading ? <Loader /> : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="2">
                    <InterviewDetails />
                    <div className="mt-2 d-flex justify-content-between  w-100">
                      <Button
                        className="cancelBtn fw-bold"
                        onClick={(e) => handleChange(e, "1")}
                      >
                        Previous
                      </Button>
                      <Button
                        className="headerButton ms-2"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        {loading ? <Loader /> : "Submit"}
                      </Button>
                    </div>
                  </TabPanel>
                  <TabPanel value="3">
                    <History />
                  </TabPanel>
                </TabContext>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-100 appLoader d-flex align-items-center justify-content-center ">
            <img src={AppLoader} alt="apploader" height={100} />
          </div>
        )}
      </div>
      <UpdateResume open={open} handleClose={handleClose} />
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
