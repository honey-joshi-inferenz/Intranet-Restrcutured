import React, { useState, useEffect } from "react";
import "./Applications.css";
import { Button } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { RiSearch2Line } from "react-icons/ri";
import { MdOutlineFileUpload } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Loader } from "../../../../Assets/Loader/Loader";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useContext } from "react";
import { RecruiterDashboardContext } from "../../../../Context/CreateContext";
import moment from "moment/moment";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { CSVLink } from "react-csv";

export const Applications = ({ getTableData }) => {
  const token = localStorage.getItem("token");

  const today = new Date().toISOString().split("T")[0];
  const { title, data, filteredData, card, setFilteredData } = useContext(
    RecruiterDashboardContext
  );
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: localStorage.getItem("currentPage") || 0,
  });

  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage.page }));
    localStorage.setItem("currentPage", newPage.page);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbar = () => setSnackbar(false);

  const openMenu = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setAnchorEl(event.target);
    setDetails(row.row);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate("/recruiter-candidateDetails/" + details.uuid);
    handleMenuClose();
  };
  const handleDelete = () => {
    handleOpen();
    handleMenuClose();
  };

  const deleteCanidate = async () => {
    setLoading(true);
    try {
      await axios
        .delete(
          BASE_URL +
            `candidate/deActivateCandidateProfile?uuid=${details.uuid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setSnackbar(true);
          setErrorMsg(false);
          setMessage("Candidate Deleted Successfully.");
          setTimeout(() => {
            handleClose();
            setLoading(false);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setSnackbar(true);
          setErrorMsg(true);

          if (err.message) {
            setMessage(err.message);
          }
          if (err.response.data) {
            setMessage(err.response.data.message);
          }
          if (err.response.status === 401) {
            setMessage("Your session has been expired.");

            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
          setTimeout(() => {
            setLoading(false);
            handleClose();
          }, 2000);
        });
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        handleClose();
      }, 2000);
    }
  };

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    const escapedSearch = escapeRegExp(search);

    const result = data?.filter((item) => {
      return (
        search === "" ||
        item.candidate_name
          .toLowerCase()
          .match(new RegExp(escapedSearch, "i")) ||
        item.designation.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
        (item.resume_source &&
          item.resume_source
            .toLowerCase()
            .match(new RegExp(escapedSearch, "i"))) ||
        item.status_hr.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
        item.interview_round
          .toLowerCase()
          .match(new RegExp(escapedSearch, "i")) ||
        item.final_status.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
        (item.interviewer_name &&
          item.interviewer_name
            .toLowerCase()
            .match(new RegExp(escapedSearch, "i"))) ||
        (item.referred_by &&
          item.referred_by
            .toLowerCase()
            .match(new RegExp(escapedSearch, "i"))) ||
        (item.owner_name &&
          item.owner_name.toLowerCase().match(new RegExp(escapedSearch, "i")))
      );
    });
    setFilteredData(result);
    // eslint-disable-next-line
  }, [search]);

  const headers = [
    { label: "Name", key: "candidate_name" },
    { label: "Email", key: "email" },
    { label: "Contact", key: "contact" },
    { label: "Designation", key: "designation" },
    { label: "Applied Date", key: "applied_date" },
    { label: "Source of Resume", key: "resume_source" },
    { label: "HR Status", key: "status_hr" },
    { label: "Interview Round", key: "interview_round" },
    { label: "Final Status", key: "final_status" },
    { label: "Interviewer", key: "interviewer_name" },
    { label: "Assigned Owner", key: "owner_name" },
    { label: "Referred By", key: "referred_by" },
  ];

  const formatData = filteredData?.map((row) => ({
    ...row,
    applied_date: moment(new Date(row.applied_date)).format("DD/MM/YYYY"),
    contact: `=""${row.contact}""`,
  }));

  const columns = [
    {
      field: "candidate_name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      width: 150,
    },

    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 150,
    },
    {
      field: "applied_date",
      headerName: "Applied Date",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 120,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.applied_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "resume_source",
      headerName: "Source of Resume",
      headerAlign: "left",
      align: "left",
      sortable: false,
    },
    {
      field: "status_hr",
      headerName: "HR Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.status_hr === "Pending"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.status_hr === "In Progress" ||
                  row.row.status_hr === "On Hold"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.status_hr === "Completed"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.status_hr === "Skipped"
                ? "refunded d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.status_hr}
          </span>
        );
      },
      width: 110,
    },
    {
      field: "interview_round",
      headerName: "Interview Round",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 130,
    },
    {
      field: "final_status",
      headerName: "Final Status",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.final_status === "Pending"
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "In Progress" ||
                  row.row.final_status === "On Hold" ||
                  row.row.final_status === "Email Sent"
                ? "processing d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Hired"
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Joined"
                ? "refunded d-flex align-items-center justify-content-center rounded"
                : row.row.final_status === "Rejected" ||
                  row.row.final_status === "Irrelevant Profile" ||
                  row.row.final_status === "Location Not Matched" ||
                  row.row.final_status === "Salary Expectation High" ||
                  row.row.final_status === "Not Appeared" ||
                  row.row.final_status === "Declined Offer" ||
                  row.row.final_status === "Not Responded"
                ? "cancelled d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.final_status}
          </span>
        );
      },
      width: 110,
    },
    {
      field: "interviewer_name",
      headerName: "Interviewer",
      headerAlign: "left",
      align: "left",
      sortable: false,
    },
    {
      field: "owner_name",
      headerName: "Assigned Owner",
      headerAlign: "left",
      align: "left",
      sortable: false,
    },
    {
      field: "actions",
      headerName: "actions",
      sortable: false,

      renderCell: (row) => {
        return (
          <div className="actionSpan">
            {" "}
            <Button
              aria-controls={openMenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
              onClick={(e) => {
                handleClick(e, row);
              }}
              className="actionDiv"
              endIcon={<KeyboardArrowDown />}
            >
              Actions
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </div>
        );
      },
    },
    {
      field: "referred_by",
      headerName: "Referred By",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 150,
    },
  ];

  return (
    <div>
      <div className="dashboardApplications   w-100 mt-3 text-start ">
        <h4 className="fw-bold text-start w-100" style={{ color: "#042049" }}>
          {title}
        </h4>
        <div className="d-flex justify-content-center flex-column w-100">
          {Object.keys(data).length > 0 ? (
            <div className=" card p-3 mt-3">
              <div className="d-flex justify-content-md-between flex-md-row flex-column w-100">
                <div className="input-group mb-3" style={{ width: "15rem" }}>
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
                <div className="d-flex">
                  <CSVLink
                    data={formatData}
                    filename={"Intranet Applications - " + today}
                    className="link"
                    headers={headers}
                  >
                    <Button
                      variant="contained"
                      className="headerButton ms-3"
                      endIcon={<MdOutlineFileUpload />}
                    >
                      Export
                    </Button>
                  </CSVLink>
                  <Button
                    variant="contained"
                    className="headerButton ms-3"
                    sx={{ width: "38px" }}
                    onClick={() => {
                      getTableData(card);
                      setSearch("");
                    }}
                  >
                    <Replay />
                  </Button>
                </div>
              </div>
              <div className="applicationsGrid mt-3">
                <div style={{ height: "650px", width: "100%" }}>
                  <DataGrid
                    rows={filteredData}
                    columns={columns}
                    getRowId={(row) => row.id}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newPage) =>
                      handlePageChange(newPage)
                    }
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    disableDensitySelector
                    disableColumnSelector
                    disableColumnMenu
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
              <span className="fw-bold">Data not found!</span>
              <span
                className="fw-bold mt-3"
                style={{ fontSize: "13px", color: "#4E5F77" }}
              >
                There are no applications to show here right now!
              </span>
            </div>
          )}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="muiModal p-4" sx={{ width: 400 }}>
          <div className="d-flex justify-content-center">
            <div
              className="border border-warning rounded-circle d-flex justify-content-center align-items-center"
              style={{ height: "70px", width: "70px" }}
            >
              <h1 className="mt-2" style={{ color: "#FFC700" }}>
                !
              </h1>
            </div>
          </div>
          <Typography
            sx={{ mt: 2, color: "#3F4254" }}
            className="text-center text-wrap"
          >
            Are you sure you want to delete {details.candidate_name}?
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            className="mt-5 d-flex justify-content-center"
          >
            <Button variant="contained" color="error" onClick={deleteCanidate}>
              {loading ? <Loader /> : "Yes, delete!"}
            </Button>
            <Button sx={{ color: "black" }} onClick={handleClose}>
              No, cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
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
