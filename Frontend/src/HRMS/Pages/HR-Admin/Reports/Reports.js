import React, { useState } from "react";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { useContext } from "react";
import {
  AnalyticsContext,
  SidebarContext,
} from "../../../../Context/CreateContext";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Analytics } from "./Analytics";
import { GridReport } from "./GridReport";

export const Reports = () => {
  const { recruiterNavVisible } = useContext(SidebarContext);
  const { rangeDates, reportDates } = useContext(AnalyticsContext);
  const [stage, setStage] = useState("1");

  const handleChange = (event, newValue) => {
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
        <div className="reports container w-100 mt-5 mt-lg-0 p-4 pe-0 pe-md-4">
          <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Reports
            </h4>
            <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/recruiter-dashboard" className="link">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Reports
                </li>
              </ol>
            </div>
          </div>
          <div className="reportsCompo mt-2">
            <TabContext value={stage}>
              <Box className="d-flex justify-content-between ">
                <TabList onChange={handleChange}>
                  <Tab label="Analytics" value="1" />
                  <Tab label="Reports" value="2" />
                </TabList>
                {rangeDates?.length > 0 && stage === "1" && (
                  <div
                    className="d-flex flex-column text-end fw-bold"
                    style={{ color: "#7E8299", fontSize: "13px" }}
                  >
                    <span>Selected dates : </span>
                    <div>
                      {rangeDates.map((date, index) => (
                        <span key={index}>
                          {date.format("DD/MM/YYYY")}{" "}
                          {index !== rangeDates.length - 1 && " ~ "}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {reportDates?.length > 0 && stage === "2" && (
                  <div
                    className="d-flex flex-column text-end fw-bold"
                    style={{ color: "#7E8299", fontSize: "13px" }}
                  >
                    <span>Selected dates : </span>
                    <div>
                      {reportDates.map((date, index) => (
                        <span key={index}>
                          {date.format("DD/MM/YYYY")}{" "}
                          {index !== reportDates.length - 1 && " ~ "}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Box>
              <TabPanel value="1">
                <Analytics />
              </TabPanel>
              <TabPanel value="2">
                <GridReport />
              </TabPanel>
            </TabContext>
          </div>
        </div>
      </div>
    </div>
  );
};
