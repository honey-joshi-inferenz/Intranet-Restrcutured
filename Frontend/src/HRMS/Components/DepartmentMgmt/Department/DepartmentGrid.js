import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Button } from "@mui/material";
import { EditDepartment } from "./EditDepartment";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Loader } from "../../../../Assets/Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const DepartmentGrid = ({ department }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [open, setOpen] = useState(false);

  const [dprt, setDprt] = useState([]);
  const [id, setId] = useState("");

  const handleSnackbar = () => setSnackbar(false);

  const handleOpen = () => setOpen(true);
  const handleOpenDelete = () => setOpenDelete(true);

  const handleClose = () => setOpen(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const openMenu = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setId(row.row.id);
    setDprt(row.row);
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

  const deleteDepartment = async () => {
    try {
      setLoading(true);
      await axios
        .delete(BASE_URL + `dropdown/deleteDropdownValue?id=${dprt.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setSnackbar(true);
          setErrorMsg(false);
          setMessage("Department Deleted Successfully.");
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
      width: 100,
    },

    {
      field: "name",
      headerName: "Department",
      headerAlign: "left",
      width: 600,
      sortable: false,
    },

    {
      field: "actions",
      headerName: "actions",
      sortable: false,
      headerAlign: "right",
      align: "right",
      width: 300,

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
          rows={department}
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
            Are you sure you want to delete {dprt.name}?
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            className="mt-5 d-flex justify-content-center"
          >
            <Button
              variant="contained"
              color="error"
              onClick={deleteDepartment}
            >
              {loading ? <Loader /> : "Yes, delete!"}
            </Button>
            <Button sx={{ color: "black" }} onClick={handleCloseDelete}>
              No, cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      <EditDepartment open={open} handleClose={handleClose} id={id} />
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
