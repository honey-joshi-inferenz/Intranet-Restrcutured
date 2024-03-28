import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { EditUser } from "./EditUser/EditUser";
import { Loader } from "../../../Assets/Loader/Loader";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { BASE_URL } from "../../../Config/BaseUrl";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const UsersGrid = ({ users }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [user, setUser] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleOpen = () => setOpen(true);
  const handleOpenDelete = () => setOpenDelete(true);

  const handleClose = () => setOpen(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleClick = (event, row) => {
    setId(row.row.uuid);
    setUser(row.row);
    setAnchorEl(event.target);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleOpen();
    handleMenuClose();
  };
  const handleDelete = () => {
    handleOpenDelete();
    handleMenuClose();
  };

  const deleteUser = async () => {
    try {
      setLoading(true);
      await axios
        .delete(BASE_URL + `userAccounts/deleteUserAccount?uuid=${user.uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setSnackbar(true);
          setErrorMsg(false);
          setMessage("User Deleted Successfully.");
          setTimeout(() => {
            handleCloseDelete();
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
            handleCloseDelete();
          }, 2000);
        });
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        handleCloseDelete();
      }, 2000);
    }
  };

  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr.No",
      headerAlign: "left",
      align: "left",
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "left",
      align: "left",
      width: 180,
    },
    {
      field: "contact",
      headerName: "Contact",
      headerAlign: "left",
      align: "left",
      width: 150,
      renderCell: (row) => {
        return <span>+{row.row.contact}</span>;
      },
    },
    {
      field: "dept_name",
      headerName: "Department",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 180,
    },

    {
      field: "emp_code",
      headerName: "Employee Id",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 130,
    },
    {
      field: "role",
      headerName: "Role",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 130,
    },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 120,
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
  ];
  return (
    <div className="mt-3">
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={users}
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
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
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
            Are you sure you want to delete {user?.name} ?
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            className="mt-5 d-flex justify-content-center"
          >
            <Button variant="contained" color="error" onClick={deleteUser}>
              {loading ? <Loader /> : "Yes, delete!"}
            </Button>
            <Button sx={{ color: "black" }} onClick={handleCloseDelete}>
              No, cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      <EditUser open={open} handleClose={handleClose} id={id} />
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
