import React, { useState, useEffect } from "react";
import { HeaderCommon } from "../../../../Components/Header/Header";
import { Button } from "@mui/material";
import { RiSearch2Line } from "react-icons/ri";
import { RequestsGrid } from "../../../Components/Reimbursement/RequestsGrid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AddRequest } from "../../../Components/AddRequest/AddRequest";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Replay } from "@mui/icons-material";

export const ViewRequest = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [filter, setFilter] = useState({ search: "", status: "" });
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const [open, setOpen] = useState(false);
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
              if (role === "HR" || role === "Admin" || role === "Accounts") {
                navigate("/adms");
              } else {
                navigate("/");
              }
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
    <div className="viewRequest w-100 d-flex flex-column ">
      <HeaderCommon />

      <div className=" w-100 d-flex align-items-center justify-content-center container mt-5 pt-3">
        <div className=" viewRequestCompo w-100 align-items-center  d-flex justify-content-center">
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
            <div className="d-flex flex-column w-100">
              <h4
                className="fw-bold mt-4 text-start w-100"
                style={{ color: "#042049" }}
              >
                Your Reimbursement
              </h4>
              <div className="hasRequestCompo card p-3 mt-3">
                <div className="viewmodalHeader d-flex justify-content-md-between flex-md-row flex-column w-100">
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
                  <div className="d-flex ms-0 ms-md-3">
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
                        <MenuItem value="Initiated">Initiated</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
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
            </div>
          )}
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
