import React, { useEffect, useState } from "react";
import "./MyInterviews.css";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Api } from "../../../../Config/API";
import moment from "moment";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const MyInterviews = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [details, setDetials] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);
  const openMenu = Boolean(anchorEl);

  const uuid = localStorage.getItem("userId");

  const handleClick = (event, row) => {
    setAnchorEl(event.target);
    setDetials(row.row);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate("/recruiter-interview-details/" + details.uuid);
  };

  useEffect(() => {
    let api = new Api();

    api.getMyInterviews(uuid, token).then((res) => {
      setInterviews(res.data.data);
      if (res.error?.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(false);
        setMessage("Your session has been expired.");
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

  const columns = [
    { field: "serialNumber", headerName: "Sr.no", width: 90 },
    {
      field: "candidate_name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      width: 200,
    },

    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 200,
    },
    {
      field: "interview_round",
      headerName: "Interview Round",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
    },
    {
      field: "interview_date",
      headerName: "Interview Date",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.interview_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "interview_time",
      headerName: "Interview Time",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
    },
    {
      field: "actions",
      headerName: "actions",
      width: 120,
      sortable: false,

      // renderCell: (row) => {
      //   return (
      //     <div className="actionSpan">
      //       <Button onClick={() => navigate("/recruiter-editInterview")}>
      //         View Details
      //       </Button>
      //     </div>
      //   );
      // },

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
              <MenuItem onClick={handleEdit}>View Details</MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="dashboardInterviews   w-100 mt-5 text-start ">
      <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
        My Interviews
      </h4>
      <div className="dashboardInterviewsCard card p-3 mt-3">
        <div className="applicationsGrid mt-3">
          {interviews?.length > 0 ? (
            <div style={{ height: "650px", width: "100%" }}>
              <DataGrid
                rows={interviews}
                columns={columns}
                getRowId={(row) => row.uuid}
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
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center ">
              <span className="fw-bold">Data not found!</span>
              <span
                className="fw-bold mt-3"
                style={{ fontSize: "13px", color: "#4E5F77" }}
              >
                There are no upcoming interviews to show here right now!
              </span>
            </div>
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
