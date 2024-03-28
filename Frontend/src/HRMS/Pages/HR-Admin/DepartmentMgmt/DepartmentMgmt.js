import React, { useState, useEffect } from "react";
import "./DepartmentMgmt.css";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { RiSearch2Line } from "react-icons/ri";
import { DepartmentGrid } from "../../../Components/DepartmentMgmt/Department/DepartmentGrid";
import { PositionGrid } from "../../../Components/DepartmentMgmt/Position/PositionGrid";
import { AddPosition } from "../../../Components/DepartmentMgmt/Position/AddPosition";
import { AddDepartment } from "../../../Components/DepartmentMgmt/Department/AddDepartment";
import { Api } from "../../../../Config/API";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const DepartmentMgmt = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let api = new Api();

  const { recruiterNavVisible } = useContext(SidebarContext);
  const [stage, setStage] = useState("1");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [positionOpen, setPositionOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [filterPosition, setFilterPosition] = useState([]);
  const [department, setDepartment] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handlePositionOpen = () => setPositionOpen(true);
  const handleDepartmentOpen = () => setDepartmentOpen(true);

  const handlePositionClose = () => setPositionOpen(false);
  const handleDepartmentClose = () => setDepartmentOpen(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleChange = (event, newValue) => {
    setStage(newValue);
  };

  const getDepartment = async () => {
    try {
      await api.getDepartments(token).then((res) => {
        setDepartment(res.data.data);
        setFilterDepartment(res.data.data);

        if (res.error?.response.status === 401) {
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

  const getPosition = async () => {
    try {
      await api.getPositions(token).then((res) => {
        setPositions(res.data.data);
        setFilterPosition(res.data.data);

        if (res.error?.response.status === 401) {
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
    getDepartment();
    getPosition();
    // eslint-disable-next-line
  }, []);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    const escapedSearchP = escapeRegExp(searchPosition);
    const escapedSearchD = escapeRegExp(searchDepartment);
    const resultPositions = positions?.filter((item) => {
      return (
        searchPosition === "" ||
        item.name.toLowerCase().match(new RegExp(escapedSearchP, "i")) ||
        item.value.toLowerCase().match(new RegExp(escapedSearchP, "i"))
      );
    });

    setFilterPosition(resultPositions);

    const resultDepartments = department?.filter((item) => {
      return (
        searchDepartment === "" ||
        item.name.toLowerCase().match(new RegExp(escapedSearchD, "i")) ||
        item.value.toLowerCase().match(new RegExp(escapedSearchD, "i"))
      );
    });

    setFilterDepartment(resultDepartments);
    // eslint-disable-next-line
  }, [searchPosition, searchDepartment]);

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
        <div className="department container w-100 p-4 mt-5 mt-lg-0">
          <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Department Management
            </h4>
            <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/recruiter-dashboard" className="link">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Department Management
                </li>
              </ol>
            </div>
          </div>
          <div className="departmentCompo mt-2">
            <TabContext value={stage}>
              <Box>
                <TabList onChange={handleChange}>
                  <Tab label="Department" value="1" />
                  <Tab label="Positions" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className="d-flex justify-content-center  align-items-center ">
                  {department?.length > 0 ? (
                    <div className="card p-3 w-100 mt-3">
                      <div className="d-flex justify-content-between ">
                        <div
                          className="input-group mb-3"
                          style={{ width: "15rem" }}
                        >
                          <span className="input-group-text searchIcon">
                            <RiSearch2Line />
                          </span>
                          <input
                            type="text"
                            className="form-control formControlInput"
                            placeholder="Search"
                            name="searchDepartment"
                            value={searchDepartment}
                            onChange={(e) =>
                              setSearchDepartment(e.target.value)
                            }
                            style={{ height: "38px" }}
                          />
                        </div>
                        <div>
                          <Button
                            variant="contained"
                            className="headerButton ms-3"
                            sx={{ width: "38px" }}
                            onClick={() => {
                              getDepartment();
                              setSearchDepartment("");
                            }}
                          >
                            <Replay />
                          </Button>
                          <Button
                            variant="contained"
                            className="headerButton ms-3"
                            onClick={handleDepartmentOpen}
                          >
                            Add Department
                          </Button>
                        </div>
                      </div>
                      <DepartmentGrid department={filterDepartment} />
                    </div>
                  ) : (
                    <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
                      <span className="fw-bold">Data not found!</span>
                      <span
                        className="fw-bold mt-3"
                        style={{ fontSize: "13px", color: "#4E5F77" }}
                      >
                        There are no department to show here right now!
                      </span>
                      <div>
                        <Button
                          variant="contained"
                          className="headerButton mt-3"
                          onClick={handleDepartmentOpen}
                        >
                          Add Department
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="d-flex justify-content-center  align-items-center ">
                  {positions?.length > 0 ? (
                    <div className="card p-3 w-100 mt-3">
                      <div className="d-flex justify-content-between  ">
                        <div
                          className="input-group mb-3"
                          style={{ width: "15rem" }}
                        >
                          <span className="input-group-text searchIcon">
                            <RiSearch2Line />
                          </span>
                          <input
                            type="text"
                            className="form-control formControlInput"
                            placeholder="Search"
                            name="searchPosition"
                            value={searchPosition}
                            onChange={(e) => setSearchPosition(e.target.value)}
                            style={{ height: "38px" }}
                          />
                        </div>
                        <div>
                          <Button
                            variant="contained"
                            className="headerButton ms-3"
                            sx={{ width: "38px" }}
                            onClick={() => {
                              getPosition();
                              setSearchPosition("");
                            }}
                          >
                            <Replay />
                          </Button>
                          <Button
                            variant="contained"
                            className="headerButton ms-3"
                            onClick={handlePositionOpen}
                          >
                            Add Position
                          </Button>
                        </div>
                      </div>
                      <PositionGrid positions={filterPosition} />
                    </div>
                  ) : (
                    <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
                      <span className="fw-bold">Data not found!</span>
                      <span
                        className="fw-bold mt-3"
                        style={{ fontSize: "13px", color: "#4E5F77" }}
                      >
                        There are no position to show here right now!
                      </span>
                      <div>
                        <Button
                          variant="contained"
                          className="headerButton mt-3"
                          onClick={handlePositionOpen}
                        >
                          Add Position
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabContext>
            <AddPosition
              open={positionOpen}
              handleClose={handlePositionClose}
              getPosition={getPosition}
            />
            <AddDepartment
              open={departmentOpen}
              handleClose={handleDepartmentClose}
              getDepartment={getDepartment}
            />
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
