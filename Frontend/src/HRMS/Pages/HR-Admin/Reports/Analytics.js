import React, { useContext, useEffect, useState } from "react";
import { HeadCountsByOwner } from "../../../Components/Reports/Analytics/HeadCountsByOwner";
import { HeadCountsByPosition } from "../../../Components/Reports/Analytics/HeadCountsByPosition";
import { UpcomingJoiners } from "../../../Components/Reports/Analytics/UpcomingJoiners";
import { HeadCountsBySource } from "../../../Components/Reports/Analytics/HeadCountsBySource";
import { EveryMonthApplication } from "../../../Components/Reports/Analytics/EveryMonthApplication";
import { HeadCountsByHrStatus } from "../../../Components/Reports/Analytics/HeadCountsByHrStatus";
import { HeadCountsByInterviewRounds } from "../../../Components/Reports/Analytics/HeadCountsByInterviewRounds";
import { HeadCountsByFinalStatus } from "../../../Components/Reports/Analytics/HeadCountsByFinalStatus";
import { GenericFilters } from "../../../Components/Reports/Analytics/GenericFilters";
import { AnalyticsContext } from "../../../../Context/CreateContext";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const Analytics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { values, rangeDates, durations } = useContext(AnalyticsContext);
  const [monthlyData, setMonthlyData] = useState([]);
  const [finalStatusData, setFinalStatusData] = useState([]);
  const [hrStatusData, setHrStatusData] = useState([]);
  const [interviewRoundData, setInterviewRoundData] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [positionsData, setPositionsData] = useState([]);
  const [resumeSourceData, setResumeSourceData] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const fetchData = async () => {
    const queryParams = {
      values: JSON.stringify(values),
      dateRange: JSON.stringify(rangeDates),
    };
    try {
      await axios
        .get(
          BASE_URL +
            `hrmetrics/getHeadcountsByMonth?duration=${durations.monthly}&values=${queryParams.values}&dateRange=${queryParams.dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setMonthlyData(res.data.data);
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

      await axios
        .get(
          BASE_URL +
            `hrmetrics/getHeadcountsByFinalStatus?values=${queryParams.values}&dateRange=${queryParams.dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setFinalStatusData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });

      await axios
        .get(
          BASE_URL +
            `hrmetrics/getHeadcountsByHrStatus?values=${queryParams.values}&dateRange=${queryParams.dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setHrStatusData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });

      await axios
        .get(
          BASE_URL +
            `hrmetrics/getHeadcountsByInterviewRounds?values=${queryParams.values}&dateRange=${queryParams.dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setInterviewRoundData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });

      await axios
        .get(
          BASE_URL +
            `hrmetrics/getHeadcountsByOwner?values=${queryParams.values}&dateRange=${queryParams.dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setOwnerData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });

      await axios
        .get(
          BASE_URL +
            `hrmetrics/getHeadcountsByPosition?values=${queryParams.values}&dateRange=${queryParams.dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setPositionsData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });

      await axios
        .get(
          BASE_URL +
            `hrmetrics/getHeadcountsByResumeSource?values=${queryParams.values}&dateRange=${queryParams.dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setResumeSourceData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [durations, values, rangeDates]);

  return (
    <div>
      <GenericFilters />
      <div className="analyticsCharts w-100 mt-3">
        <div className="d-flex flex-lg-row flex-column  w-100">
          <HeadCountsByOwner chartData={ownerData} />
          <HeadCountsByPosition chartData={positionsData} />
        </div>
        <div className="d-flex flex-lg-row flex-column mt-3 w-100">
          <EveryMonthApplication chartData={monthlyData} />
          <HeadCountsBySource chartData={resumeSourceData} />
        </div>
        <div className="d-flex flex-lg-row flex-column mt-3 w-100">
          <HeadCountsByHrStatus chartData={hrStatusData} />
          <HeadCountsByInterviewRounds chartData={interviewRoundData} />
        </div>
        <div className="d-flex flex-lg-row flex-column mt-3 w-100">
          <UpcomingJoiners />
          <HeadCountsByFinalStatus chartData={finalStatusData} />
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
