import React, { useContext, useState, useEffect } from "react";
import "./MyRequests.css";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { SidebarContext } from "../../../../Context/CreateContext";
import { AdminHeader } from "../../../Components/AdminHeader/AdminHeader";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { RiSearch2Line } from "react-icons/ri";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { RequestsGrid } from "../../../Components/Reimbursement/RequestsGrid";
import { AddRequest } from "../../../Components/AddRequest/AddRequest";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Replay } from "@mui/icons-material";

export const MyRequests = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const { reimbursenavVisible } = useContext(SidebarContext);

  const [filter, setFilter] = useState({ search: "", status: "" });
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFilter({ ...filter, [name]: value });
  };

  const getData = async () => {
    try {
      await axios
        .get(
          BASE_URL +
            `reimbursement/request/getMyReimbursements?account_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setData(res.data.data);
          setFilterData(res.data.data);
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

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    const escapedSearch = escapeRegExp(filter.search);

    const result = data.filter((item) => {
      return (
        (filter.search === "" ||
          item.name.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
          item.dept_name.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
          item.paymentMode
            .toLowerCase()
            .match(new RegExp(escapedSearch, "i"))) &&
        (filter.status === "" || item.employee_status === filter.status)
      );
    });
    setFilterData(result);
    // eslint-disable-next-line
  }, [filter]);

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
        <div className="myRequests w-100">
          <div className="myRequestsCompo w-100 container d-flex align-items-center  justify-content-center flex-column">
            <div className="toolbarHeader d-flex justify-content-start align-items-md-center align-items-start flex-column flex-md-row p-2 text-start">
              <h4 className="fw-bold text-start " style={{ color: "#042049" }}>
                My Reimbursement
              </h4>
              <h5 className="mx-3 vr d-md-flex d-none">|</h5>
              <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/reimbursement-dashboard" className="link">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    My Reimbursement
                  </li>
                </ol>
              </div>
            </div>
            {data?.length === 0 ? (
              <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
                <h2 className="fw-bold">Request for Reimbursement</h2>
                <p className="mt-2">
                  There are no ongoing requests from you;
                  <br /> Please add new request.
                </p>
                <Button className="headerButton" onClick={handleOpen}>
                  Add request
                </Button>
              </div>
            ) : (
              <div className="w-100 card p-3 mt-3 d-flex flex-column">
                <div className="requestnav d-flex flex-md-row flex-column  justify-content-md-between ">
                  <div className="input-group mb-3" style={{ width: "15rem" }}>
                    <span className="input-group-text searchIcon">
                      <RiSearch2Line />
                    </span>
                    <input
                      type="text"
                      className="form-control formControlInput"
                      placeholder="Search"
                      name="search"
                      value={filter.search}
                      onChange={handleChange}
                      style={{ height: "38px" }}
                    />
                  </div>
                  <div className="d-flex">
                    <FormControl sx={{ minWidth: 120, border: "none" }}>
                      <Select
                        name="status"
                        value={filter.status}
                        onChange={handleChange}
                        displayEmpty
                        className="outlinedDropdown"
                        notched
                      >
                        <MenuItem value="" disabled>
                          Status
                        </MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Payment Done">Payment Done</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Rejeted">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      className="headerButton ms-3"
                      onClick={handleOpen}
                    >
                      Add request
                    </Button>
                    <Button
                      variant="contained"
                      className="headerButton ms-3"
                      sx={{ width: "38px" }}
                      onClick={() => {
                        getData();
                        setFilter({ search: "", status: "" });
                      }}
                    >
                      <Replay />
                    </Button>
                  </div>
                </div>
                <div className="viewRequestTable mt-2">
                  <RequestsGrid data={filterData} />
                </div>
              </div>
            )}
          </div>
          <AddRequest open={open} handleClose={handleClose} getData={getData} />
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
