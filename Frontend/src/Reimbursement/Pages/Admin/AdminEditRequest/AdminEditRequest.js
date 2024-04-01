import React, { useContext, useState, useEffect } from "react";
import "./AdminEditRequest.css";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { SidebarContext } from "../../../../Context/CreateContext";
import { AdminHeader } from "../../../Components/AdminHeader/AdminHeader";
import { Link, useParams } from "react-router-dom";
import logo from "../../../../Assets/Images/i.png";
import { FaClipboardUser } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button } from "@mui/material";
import { AdminEditModal } from "../../../Components/Admin-Reimbursement/AdminEditModal";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import moment from "moment";
import AppLoader from "../../../../Assets/Loader/pageLoader.gif";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const AdminEditRequest = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const params = useParams();
  const { reimbursenavVisible } = useContext(SidebarContext);

  const [stage, setStage] = useState("1");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleChange = (event, newValue) => {
    setStage(newValue);
  };

  const getData = async () => {
    try {
      await axios
        .get(
          BASE_URL +
            `reimbursement/request/getRequestById?transaction_id=${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setData(res.data.data);
          setCurrentStatus(res.data.data.final_status);
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
        {Object.keys(data)?.length > 0 ? (
          <div className="myRequests w-100">
            <div className="adminEditRequestCompo w-100 container">
              <div className="toolbarHeader d-flex justify-content-start align-items-md-center align-items-start flex-column flex-md-row p-2 text-start">
                <h4
                  className="fw-bold text-start "
                  style={{ color: "#042049" }}
                >
                  Update Request
                </h4>
                <h5 className="mx-3 vr d-md-flex d-none">|</h5>
                <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/reimbursement-dashboard" className="link">
                        Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/reimbursement-requests" className="link">
                        Requests
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Update Request
                    </li>
                  </ol>
                </div>
              </div>
              <div className="adminEditRequestEmpData w-100 card p-3 mt-3 pb-0">
                <div className="d-flex empData align-items-center ">
                  <img src={logo} alt="logo" height={150} />

                  <div className=" text-start  d-flex flex-column">
                    <div>
                      <span
                        className="fs-5 fw-bold text-start"
                        style={{ color: "#042049" }}
                      >
                        {data?.name}
                      </span>
                    </div>
                    <div className="w-100 d-flex mt-3 flex-md-row flex-column">
                      <div className="d-flex flex-lg-row flex-column align-items-center empDetails">
                        <div className="d-flex flex-row align-items-center me-0 me-lg-3">
                          <FaClipboardUser className="empDetailsIcon" />
                          <span className="text-end ms-2">
                            {data?.emp_code}
                          </span>
                        </div>
                        <div className="d-flex flex-row align-items-center me-3">
                          <MdEmail className="empDetailsIcon" />
                          <span className="text-end ms-2">{data?.email}</span>
                        </div>
                        <div className="d-flex flex-row align-items-center ">
                          <FaUsers className="empDetailsIcon" />
                          <span className="text-end ms-2">
                            {data?.dept_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <TabContext value={stage}>
                <Box className="w-100 card adminEditTabpanel">
                  <TabList onChange={handleChange}>
                    <Tab label="Overview" value="1" />
                    <Tab label="Status" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="w-100">
                  <div className="mt-3 card ">
                    <div className="p-3 text-start border-bottom d-flex align-items-center ">
                      <h6 className="fw-bold">Expense Details</h6>
                    </div>
                    <div className="p-4 empExpenseOverview">
                      <div className="row text-start mb-4">
                        <span className="col-md-4 expenseTitle">
                          Initiated Date
                        </span>
                        <span className="col-md-8">
                          {moment(new Date(data.initiate_date)).format(
                            "DD-MM-YYYY"
                          )}
                        </span>
                      </div>
                      <div className="row text-start mb-4">
                        <span className="col-md-4 expenseTitle">
                          Expense Date
                        </span>
                        <span className="col-md-8">
                          {moment(new Date(data.date_of_expense)).format(
                            "DD-MM-YYYY"
                          )}
                        </span>
                      </div>
                      <div className="row text-start mb-4">
                        <span className="col-md-4 expenseTitle">
                          Paid Amount
                        </span>
                        <span className="col-md-8">
                          ₹ &nbsp;
                          {Number(data.paid_amount).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="row text-start mb-4">
                        <span className="col-md-4 expenseTitle">
                          Payment Mode
                        </span>
                        <span className="col-md-8">{data.paymentMode}</span>
                      </div>
                      <div className="row text-start mb-4">
                        <span className="col-md-4 expenseTitle">
                          Purpose Of Expenditure
                        </span>
                        <span className="col-md-8">
                          {data.purpose_of_expenditure}
                        </span>
                      </div>
                      <div className="row text-start mb-4">
                        <span className="col-md-4 expenseTitle">
                          Expenditure Category
                        </span>
                        <span className="col-md-8">
                          {data.expenditure_category}
                        </span>
                      </div>
                      <div className="row text-start mb-4">
                        <span className="col-md-4 expenseTitle">Invoice</span>
                        <a
                          className="col-md-8 text-start"
                          href={data.invoice}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button>Click to view Invoice</Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="2" className="w-100">
                  <div className=" mt-3 card">
                    <div className="p-3 d-flex justify-content-between align-items-center border-bottom ">
                      <h6 className="fw-bold">Update Status</h6>
                      <div>
                        <Button className="headerButton" onClick={handleOpen}>
                          Update
                        </Button>
                        {/* <Button
                          className="ms-3 paymentDoneBtn"
                          variant="outlined"
                          disabled={
                            data.final_status === "Approved" ? false : true
                          }
                          onClick={() => {
                            paymentDone("Payment Done");
                          }}
                        >
                          {loading ? <Loader /> : "Payment Done"}
                        </Button> */}
                      </div>
                    </div>
                    <div className="p-4  d-flex flex-column flex-lg-row">
                      <div className="col-12 col-lg-6 p-3 me-0 me-lg-3 text-start d-flex flex-column empStatusOverview">
                        <div className="d-flex justify-content-between ">
                          <h6>HR Staus</h6>
                          <span
                            className={
                              "d-flex align-items-center  justify-content-center  rounded " +
                              (data.status === "Pending"
                                ? " pending "
                                : data.status === "On Hold"
                                ? " processing "
                                : data.status === "Rejected"
                                ? " cancelled "
                                : data.status === "Approved"
                                ? " success "
                                : " ")
                            }
                          >
                            {data.status}
                          </span>
                        </div>

                        {(data.status === "Rejected" ||
                          data.status === "On Hold") && (
                          <div className="row mt-4 lastUpdate">
                            <div className="col">
                              <h6>Reason</h6>
                              <span>
                                {data.status === "On Hold" &&
                                data.hr_reason_onhold
                                  ? data.hr_reason_onhold
                                  : data.status === "Rejected" &&
                                    data.hr_reason_reject
                                  ? data.hr_reason_reject
                                  : ""}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="row mt-4 lastUpdate">
                          <div className="col">
                            <h6>Last Updated By</h6>
                            <span>{data.hr_approved_by}</span>
                          </div>
                          <div className="col text-end">
                            <h6>Last Updated Date</h6>
                            <span>
                              {data.hr_approved_date === "Pending"
                                ? "Pending"
                                : moment(
                                    new Date(data.hr_approved_date)
                                  ).format("DD-MM-YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6 p-3 me-0 me-lg-3 mt-3 mt-lg-0 text-start d-flex flex-column empStatusOverview">
                        <div className="d-flex justify-content-between ">
                          <h6>Final Staus</h6>
                          <span
                            className={
                              "d-flex align-items-center  justify-content-center  rounded " +
                              (data.final_status === "Pending"
                                ? " pending "
                                : data.final_status === "On Hold"
                                ? " processing "
                                : data.final_status === "Rejected"
                                ? " cancelled "
                                : data.final_status === "Approved" ||
                                  data.final_status === "Payment Done"
                                ? " success "
                                : " ")
                            }
                          >
                            {data.final_status}
                          </span>
                        </div>

                        {(data.final_status === "Rejected" ||
                          data.final_status === "On Hold") && (
                          <div className="row mt-4 lastUpdate">
                            <div className="col">
                              <h6>Reason</h6>
                              <span>
                                {data.admin_reason_onhold
                                  ? data.admin_reason_onhold
                                  : data.admin_reason_reject}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="row mt-4 lastUpdate">
                          <div className="col">
                            <h6>Last Updated By</h6>
                            <span>{data.admin_approved_by}</span>
                          </div>
                          <div className="col text-end">
                            <h6>Last Updated Date</h6>
                            <span>
                              {data.admin_approved_date === "Pending"
                                ? "Pending"
                                : moment(
                                    new Date(data.admin_approved_date)
                                  ).format("DD-MM-YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
              <AdminEditModal
                open={open}
                handleClose={handleClose}
                data={data}
                setData={setData}
                currentStatus={currentStatus}
              />
            </div>
          </div>
        ) : (
          <div className="w-100 appLoader d-flex align-items-center justify-content-center ">
            <img src={AppLoader} alt="apploader" height={100} />
          </div>
        )}
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
