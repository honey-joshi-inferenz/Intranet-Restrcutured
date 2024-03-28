import React, { useState } from "react";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { RiSearch2Line } from "react-icons/ri";
import { DeletedApplications } from "../../../Components/DeletedUsers/DeletedApplications";
import { DeletedUsersGrid } from "../../../Components/DeletedUsers/DeletedUsersGrid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { useEffect } from "react";
import { Api } from "../../../../Config/API";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const DeletedUsers = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { recruiterNavVisible } = useContext(SidebarContext);
  const [stage, setStage] = useState("1");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    search: "",
    role: "",
  });
  const [applications, setApplications] = useState([]);
  const [filterApplications, setFilterApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleValue = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFilter({ ...filter, [name]: value });
  };

  const handleChange = (event, newValue) => {
    setStage(newValue);
  };

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "userAccounts/getInActiveUserAccounts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setUsers(res.data.data);
          setFilterUsers(res.data.data);
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
        .get(BASE_URL + "candidate/getInActiveCandidates", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setApplications(res.data.data);
          setFilterApplications(res.data.data);
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
    const escapedSearchA = escapeRegExp(search);
    const escapedSearchU = escapeRegExp(filter.search);

    const resultApplications = applications?.filter((item) => {
      return (
        search === "" ||
        item.candidate_name
          .toLowerCase()
          .match(new RegExp(escapedSearchA, "i")) ||
        item.designation.toLowerCase().match(new RegExp(escapedSearchA, "i")) ||
        (item.resume_source &&
          item.resume_source
            .toLowerCase()
            .match(new RegExp(escapedSearchA, "i"))) ||
        item.status_hr.toLowerCase().match(new RegExp(escapedSearchA, "i")) ||
        item.interview_round
          .toLowerCase()
          .match(new RegExp(escapedSearchA, "i")) ||
        item.final_status
          .toLowerCase()
          .match(new RegExp(escapedSearchA, "i")) ||
        (item.owner_name &&
          item.owner_name.toLowerCase().match(new RegExp(escapedSearchA, "i")))
      );
    });
    setFilterApplications(resultApplications);

    const resultUsers = users?.filter((item) => {
      return (
        (filter.search === "" ||
          item.name.toLowerCase().match(new RegExp(escapedSearchU, "i")) ||
          item.dept_name
            .toLowerCase()
            .match(new RegExp(escapedSearchU, "i"))) &&
        (filter.role === "" || item.role === filter.role)
      );
    });
    setFilterUsers(resultUsers);
    // eslint-disable-next-line
  }, [search, filter]);

  useEffect(() => {
    let api = new Api();

    api.getRoles(token).then((res) => {
      setRoles(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
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
        <div className="deletedUsers container w-100 p-4  mt-5 mt-lg-0">
          <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Deleted Users
            </h4>
            <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/recruiter-dashboard" className="link">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Deleted Users
                </li>
              </ol>
            </div>
          </div>
          <div className="deltedUsersCompo mt-2">
            <TabContext value={stage}>
              <Box>
                <TabList onChange={handleChange}>
                  <Tab label="Applications" value="1" />
                  <Tab label="Users" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className="d-flex flex-column align-items-center justify-content-center w-100">
                  {applications?.length > 0 ? (
                    <div className="card p-3 w-100 mt-3">
                      <div className="deletedAppHeader d-flex justify-content-between ">
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
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ height: "38px" }}
                          />
                        </div>
                        <Button
                          variant="contained"
                          className="headerButton ms-3"
                          sx={{ width: "38px" }}
                          onClick={() => {
                            getData();
                            setSearch("");
                          }}
                        >
                          <Replay />
                        </Button>
                      </div>
                      <DeletedApplications applications={filterApplications} />
                    </div>
                  ) : (
                    <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
                      <span className="fw-bold">Data not found!</span>
                      <span
                        className="fw-bold mt-3"
                        style={{ fontSize: "13px", color: "#4E5F77" }}
                      >
                        There are no deleted application to show here right now!
                      </span>
                    </div>
                  )}
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div className="d-flex flex-column align-items-center justify-content-center w-100">
                  {users?.length > 0 ? (
                    <div className="card p-3 w-100 mt-3">
                      <div className="deletedUsersHeader d-flex justify-content-md-between flex-md-row flex-column  ">
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
                            name="search"
                            value={filter.search}
                            onChange={handleValue}
                            style={{ height: "38px" }}
                          />
                        </div>
                        <div>
                          <FormControl className="ms-3" sx={{ minWidth: 120 }}>
                            <Select
                              className="outlinedDropdown"
                              name="role"
                              displayEmpty
                              value={filter.role}
                              onChange={handleValue}
                              style={{ borderRadius: "0.4rem" }}
                            >
                              <MenuItem value="" disabled>
                                Select Role
                              </MenuItem>
                              {roles?.length > 0 &&
                                roles?.map((i, index) => {
                                  return (
                                    <MenuItem value={i.value} key={index}>
                                      {i.name}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          </FormControl>
                          <Button
                            variant="contained"
                            className="headerButton ms-3"
                            sx={{ width: "38px" }}
                            onClick={() => {
                              getData();
                              setFilter({
                                search: "",
                                role: "",
                              });
                            }}
                          >
                            <Replay />
                          </Button>
                        </div>
                      </div>
                      <DeletedUsersGrid users={filterUsers} />
                    </div>
                  ) : (
                    <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
                      <span className="fw-bold">Data not found!</span>
                      <span
                        className="fw-bold mt-3"
                        style={{ fontSize: "13px", color: "#4E5F77" }}
                      >
                        There are no deleted user to show here right now!
                      </span>
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabContext>
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
