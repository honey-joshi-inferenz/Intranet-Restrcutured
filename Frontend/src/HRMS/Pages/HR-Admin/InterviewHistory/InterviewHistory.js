import React from "react";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Link } from "react-router-dom";
import { InterviewHistory } from "../../Interviewer/InterviewHistory/InterviewHistory";

export const RecruiterInterviewHistory = () => {
  const { recruiterNavVisible } = useContext(SidebarContext);
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
        <div className="adminInterviewHistory container w-100 p-4 mt-5 mt-lg-0">
          <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Interview History
            </h4>
            <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/recruiter-dashboard" className="link">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Interview History
                </li>
              </ol>
            </div>
          </div>
          <div className="adminInterviewHistory mt-2">
            <InterviewHistory />
          </div>
        </div>
      </div>
    </div>
  );
};
