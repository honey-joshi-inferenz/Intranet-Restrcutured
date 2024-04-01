import React from "react";
import "./EditInterview.css";
import { InterviewerHeader } from "../../../Components/InterviewerHeader/InterviewerHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import { Button } from "@mui/material";
import { InterviewFeedback } from "../../../Components/EditInterview/IntviewFeedback";
import { InterviewFeedbackHistory } from "../../../Components/EditInterview/InterviewFeedbackHistory";
import { useEffect } from "react";
import { Api } from "../../../../Config/API";
import moment from "moment/moment";
import AppLoader from "../../../../Assets/Loader/pageLoader.gif";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const EditInterview = () => {
  const params = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [stage, setStage] = useState("1");
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);
  const handleChange = (event, newValue) => {
    setStage(newValue);
  };

  useEffect(() => {
    let api = new Api();

    api.getCandidateData(params.id, token).then((res) => {
      setData(res.data.currentRoundData[0]);
      setHistory(res.data.historyData.interviewer_history);

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
    <div className="editInterview w-100 d-flex flex-column">
      <InterviewerHeader />
      {Object.keys(data).length > 0 ? (
        <div className="pt-3 w-100 mt-5  d-flex align-items-center justify-content-center container">
          <div className="editInterviewCompo w-100 mt-3 pe-3">
            <div>
              <h4
                className="fw-bold mt-4 text-start w-100"
                style={{ color: "#042049" }}
              >
                Interview Details
              </h4>
              <div aria-label="breadcrumb" className="breadcrumbs">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/recruiter-interviews" className="link">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Interview Details
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {data?.candidate_name}
                  </li>
                </ol>
              </div>
            </div>
            <TabContext value={stage}>
              <Box className="w-100 hrEditTabpanel">
                <TabList onChange={handleChange}>
                  <Tab label="Interview Details" value="1" />
                  <Tab label="Interview Feedback History" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1" className="w-100">
                <div className="d-flex flex-lg-row flex-column mt-4">
                  <div className="col-lg-5 me-0 me-lg-2 col-12 p-3 card editInterviewLeftCard">
                    <span className="fs-5 fw-bold mb-4 text-start">
                      Candidate Details
                    </span>
                    {data && (
                      <div className="candidateOverview">
                        <div className="row text-start mb-4">
                          <span className="col-md-5 candidateTitle">Name</span>
                          <span className="col-md-7">
                            {data.candidate_name}
                          </span>
                        </div>
                        <div className="row text-start mb-4">
                          <span className="col-md-5 candidateTitle">
                            Designation
                          </span>
                          <span className="col-md-7">{data.designation}</span>
                        </div>
                        <div className="row text-start mb-4">
                          <span className="col-md-5 candidateTitle">
                            Relavent Experience
                          </span>
                          <span className="col-md-7">
                            {data.relevant_it_experience}
                          </span>
                        </div>
                        <div className="row text-start mb-4">
                          <span className="col-md-5 candidateTitle">
                            Interview Round
                          </span>
                          <span className="col-md-7">
                            {data.interview_round}
                          </span>
                        </div>
                        <div className="row text-start mb-4">
                          <span className="col-md-5 candidateTitle">
                            Interview Date
                          </span>
                          <span className="col-md-7">
                            {moment(new Date(data.interview_date)).format(
                              "DD-MM-YYYY"
                            )}
                          </span>
                        </div>
                        <div className="row text-start mb-4">
                          <span className="col-md-5 candidateTitle">
                            Interview Time
                          </span>
                          <span className="col-md-7">
                            {data.interview_time}
                          </span>
                        </div>
                        <div className="row text-start">
                          <span className="col-md-5 candidateTitle">
                            Resume / CV
                          </span>
                          {data.candidate_resume === null ||
                          data.candidate_resume === "null" ||
                          data.candidate_resume === "" ? (
                            <Button disabled>Click to view</Button>
                          ) : (
                            <a
                              href={data.candidate_resume}
                              target="_blank"
                              rel="noreferrer"
                              className="col-md-7"
                            >
                              <Button>Click to view</Button>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-7 col-12 mt-2 mt-lg-0">
                    <InterviewFeedback data={data} />
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2" className="w-100 mt-4">
                <InterviewFeedbackHistory data={history} />
              </TabPanel>
            </TabContext>
          </div>
        </div>
      ) : (
        <div className="w-100 appLoader d-flex align-items-center justify-content-center ">
          <img src={AppLoader} alt="apploader" height={100} />
        </div>
      )}
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
