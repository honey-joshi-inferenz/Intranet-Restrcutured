import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Button } from "@mui/material";
import { Cards } from "../../../Components/Dashboard/Cards/Cards";
import { Applications } from "../../../Components/Dashboard/Applications/Applications";
import { RecruiterDashboardContext } from "../../../../Context/CreateContext";
import { MyInterviews } from "../../../Components/Dashboard/MyInterviews/MyInterviews";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { recruiterNavVisible } = useContext(SidebarContext);
  const {
    myInterviews,
    setMyInterviews,
    setStatistics,
    setTitle,
    setData,
    setFilteredData,
  } = useContext(RecruiterDashboardContext);
  const name = localStorage.getItem("name");

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const getStatistics = async () => {
    try {
      await axios
        .get(BASE_URL + "dashboard/getApplicationStatistics", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setStatistics(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 401) {
            setSnackbar(true);
            setErrorMsg(true);
            setMessage("Your session has been expired.");

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
    getStatistics();
    // eslint-disable-next-line
  }, []);

  const fetchData = async (url, customTitle) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTitle(customTitle);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setTitle(customTitle);
        setData([]);
        setFilteredData([]);
      }
      if (error.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(true);
        setMessage("Your session has been expired.");

        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
      console.log(error);
    }
  };

  const getTableData = async (card) => {
    setMyInterviews(false);
    localStorage.setItem("selectedCard", card);

    switch (card) {
      case 1:
        await fetchData(
          BASE_URL + "dashboard/getActiveApplications",
          "Latest Applications"
        );
        break;
      case 2:
        await fetchData(
          BASE_URL + "dashboard/getTodayApplications",
          "Today's Applications"
        );
        break;
      case 3:
        await fetchData(
          BASE_URL + "dashboard/getCurrentMonthApplications",
          "Current Month Applications"
        );
        break;
      case 4:
        await fetchData(
          BASE_URL + "dashboard/getConfirmedApplications",
          "Confirmed Applications"
        );
        break;
      case 5:
        await fetchData(
          BASE_URL + "dashboard/getInProgressApplications",
          "In Progress Applications"
        );
        break;
      case 6:
        await fetchData(
          BASE_URL + "dashboard/getJoinedApplications",
          "Joined Applications"
        );
        break;
      case 7:
        await fetchData(
          BASE_URL + "dashboard/getPendingApplications",
          "Pending Applications"
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getTableData(
      parseInt(localStorage.getItem("selectedCard"))
        ? parseInt(localStorage.getItem("selectedCard"))
        : 1
    );
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
        <div className="recruiterDashboard container w-100 p-4">
          <div className="d-flex justify-content-md-between flex-md-row flex-column dashboardHeader mb-5">
            <span className="text-start d-flex align-items-center ">
              <h3 style={{ color: "#042049" }}>Welcome</h3>&nbsp; &nbsp; {name}!
            </span>
            <Button
              className="headerButton"
              onClick={() => setMyInterviews(true)}
            >
              View My Interviews
            </Button>
          </div>
          <Cards getTableData={getTableData} />
          {myInterviews ? (
            <MyInterviews />
          ) : (
            <Applications getTableData={getTableData} />
          )}
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
