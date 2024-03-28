import React, { useState } from "react";
import { Header } from "../../../Components/Header/Header";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { RiSearch2Line } from "react-icons/ri";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { UsersGrid } from "../../../Components/Users/UsersGrid";
import { AddUser } from "../../../Components/Users/AddUser/AddUser";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { useEffect } from "react";
import { Api } from "../../../../Config/API";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const Users = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { recruiterNavVisible } = useContext(SidebarContext);
  const [filter, setFilter] = useState({
    search: "",
    role: "",
  });
  const [users, SetUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleValue = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFilter({ ...filter, [name]: value });
  };

  const getUsers = async () => {
    try {
      await axios
        .get(BASE_URL + "userAccounts/getActiveUserAccounts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          SetUsers(res.data.data);
          setFilteredData(res.data.data);
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    const escapedSearch = escapeRegExp(filter.search);
    const result = users?.filter((item) => {
      return (
        (filter.search === "" ||
          item.name.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
          item.email.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
          item.email.toLowerCase().match(new RegExp(escapedSearch, "i"))) &&
        (filter.role === "" || item.role === filter.role)
      );
    });

    setFilteredData(result);
    // eslint-disable-next-line
  }, [filter]);

  useEffect(() => {
    let api = new Api();
    api.getRoles(token).then((res) => {
      setRoles(res.data.data);
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
        <div className="users container w-100 p-4  mt-5 mt-lg-0">
          <div className="toolbarHeader d-flex justify-content-start align-items-start flex-column text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Users
            </h4>
            <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/recruiter-dashboard" className="link">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Users
                </li>
              </ol>
            </div>
          </div>
          <div className="usersCompo mt-2 d-flex justify-content-center align-items-center">
            {users?.length > 0 ? (
              <div className="card p-3 w-100 mt-3">
                <div className="usersHeader d-flex justify-content-md-between flex-md-row  flex-column  ">
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
                          roles.map((i, index) => {
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
                        getUsers();
                        setFilter({ search: "", role: "" });
                      }}
                    >
                      <Replay />
                    </Button>
                    <Button
                      variant="contained"
                      className="headerButton ms-3"
                      onClick={handleOpen}
                    >
                      Add User
                    </Button>
                  </div>
                </div>
                <UsersGrid users={filteredData} />
              </div>
            ) : (
              <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
                <span className="fw-bold">Data not found!</span>
                <span
                  className="fw-bold mt-3"
                  style={{ fontSize: "13px", color: "#4E5F77" }}
                >
                  There are no users to show here right now!
                </span>
                <div>
                  <Button
                    variant="contained"
                    className="headerButton mt-3"
                    onClick={handleOpen}
                  >
                    Add User
                  </Button>
                </div>
              </div>
            )}
          </div>
          <AddUser open={open} handleClose={handleClose} getUsers={getUsers} />
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
