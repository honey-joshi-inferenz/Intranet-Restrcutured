import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment/moment";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const DeletedApplications = ({ applications }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [application, setApplication] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleClick = (event, row) => {
    setApplication(row.row);
    setAnchorEl(event.target);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    restoreApplication();
    handleMenuClose();
  };

  const restoreApplication = async () => {
    try {
      await axios
        .put(
          BASE_URL +
            `candidate/reActivateCandidateProfile?uuid=${application.uuid}`,
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
          setMessage("Candidate details restored Successfully.");
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg(true);

          if (err.message) {
            setMessage(err.message);
          }
          if (err.response.data) {
            setMessage(err.response.data.message);
          }
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

  const columns = [
    {
      field: "candidate_name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      width: 130,
    },

    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 130,
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
              <MenuItem onClick={handleEdit}>Restore</MenuItem>
            </Menu>
          </div>
        );
      },
    },
    {
      field: "referedBy",
      headerName: "referred By",
      headerAlign: "left",
      align: "left",
      sortable: false,
    },
  ];

  return (
    <div className="mt-3">
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={applications}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          disableDensitySelector
          disableColumnSelector
          disableColumnMenu
        />
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
