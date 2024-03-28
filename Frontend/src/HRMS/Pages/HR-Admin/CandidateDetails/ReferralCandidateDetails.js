import React, { useState } from "react";
import "./CandidateDetails.css";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Link, useNavigate } from "react-router-dom";
import { RoundStepper } from "../../../Components/CandidateDetails/Stepper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { PersonalDetails } from "../../../Components/ReferralCandidateDetails/PersonalDetails";
import { InterviewDetails } from "../../../Components/ReferralCandidateDetails/InterviewDetails";
import { History } from "../../../Components/ReferralCandidateDetails/History";
import { Button } from "@mui/material";

export const ReferralCandidateDetails = () => {
  const { recruiterNavVisible } = useContext(SidebarContext);
  const [stage, setStage] = useState("1");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    window.scrollTo(0, 0);
    setStage(newValue);
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
        <div className="referralCandidateDetails container w-100 p-4 mt-5 mt-lg-0">
          <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
            <h5 className="fw-bold">Candidate Details</h5>
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
                  Honey Joshi
                </li>
              </ol>
            </div>
          </div>
          <div className="referralCandidateDetailsCompo mt-2 d-flex flex-lg-row flex-column ">
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
                  <div className="mt-2 d-flex justify-content-end  w-100">
                    <Button
                      className="cancelBtn fw-bold"
                      onClick={() => navigate("/recruiter-dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="headerButton ms-2"
                      type="submit"
                      onClick={(e) => handleChange(e, "2")}
                    >
                      Next
                    </Button>
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
                    <Button className="headerButton ms-2" type="submit">
                      Submit
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
      </div>
    </div>
  );
};
