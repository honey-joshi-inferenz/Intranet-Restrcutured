import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { SidebarContext } from "../../../../Context/CreateContext";
import { AdminHeader } from "../../../Components/AdminHeader/AdminHeader";
import total from "../../../../Assets/Logo/Group 34.png";
import approved from "../../../../Assets/Logo/Group 35.png";
import pending from "../../../../Assets/Logo/Group 36.png";
import rejected from "../../../../Assets/Logo/Group 37.png";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const ReimburseDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { reimbursenavVisible } = useContext(SidebarContext);
  const [totalData, setTotalData] = useState([]);
  const [approvedData, setApprovedData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "reimbursement/dashboard/getTotalReimburse", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setTotalData(res.data.data);
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

      await axios
        .get(BASE_URL + "reimbursement/dashboard/getApprovedReimburse", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setApprovedData(res.data.data);
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
        .get(BASE_URL + "reimbursement/dashboard/getPendingReimburse", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setPendingData(res.data.data);
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
        .get(BASE_URL + "reimbursement/dashboard/getRejectedReimburse", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setRejectedData(res.data.data);
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
    getData();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="maincontainer">
      <Sidebar />
      <AdminHeader />
      <div
        className={
          !reimbursenavVisible
            ? "page page-without-navbar"
            : "page page-with-navbar"
        }
      >
        <div className="dashboard d-flex align-items-center  justify-content-center p-4 mt-5 w-100">
          <div className="container mt-5">
            <div className="row g-2">
              <div className="col-12 col-xl-3 col-md-6 d-flex align-items-center justify-content-center mb-2 mb-md-5">
                <div className="totalCard p-2  position-relative reimburseCards w-100 d-flex  flex-row flex-xl-column">
                  <div className="position-absolute reimburseImages">
                    <img alt="recruiter" src={total} height={130} />
                  </div>
                  <div className="reimburseStatistics d-flex align-items-center justify-content-center flex-column w-100">
                    <span>{totalData?.count} Bills Received Total</span>
                    <h4>
                      ₹
                      {totalData?.total_amount?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-3 col-md-6 d-flex align-items-center justify-content-center mb-2 mb-md-5">
                <div className="pendingCard p-2  position-relative reimburseCards w-100 d-flex  flex-row flex-xl-column">
                  <div className="position-absolute reimburseImages">
                    <img alt="recruiter" src={approved} height={130} />
                  </div>
                  <div className="reimburseStatistics d-flex align-items-center justify-content-center flex-column w-100">
                    <span>{approvedData?.count} Bills Pending For</span>
                    <h4>
                      ₹
                      {approvedData?.total_amount?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-3 col-md-6 d-flex align-items-center justify-content-center mb-2 mb-md-5">
                <div className="approvedCard p-2  position-relative reimburseCards w-100 d-flex  flex-row flex-xl-column">
                  <div className="position-absolute reimburseImages">
                    <img alt="recruiter" src={pending} height={130} />
                  </div>
                  <div className="reimburseStatistics d-flex align-items-center justify-content-center flex-column w-100">
                    <span>{pendingData?.count} Bills Approved For</span>
                    <h4>
                      ₹
                      {pendingData?.total_amount?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-3 col-md-6 d-flex align-items-center justify-content-center mb-2 mb-md-5">
                <div className="rejectedCard p-2  position-relative reimburseCards w-100 d-flex  flex-row flex-xl-column">
                  <div className="position-absolute reimburseImages">
                    <img alt="recruiter" src={rejected} height={130} />
                  </div>
                  <div className="reimburseStatistics d-flex align-items-center justify-content-center flex-column w-100">
                    <span>{rejectedData?.count} Bills Rejected For</span>
                    <h4>
                      ₹
                      {rejectedData?.total_amount?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
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
