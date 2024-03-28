import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardArrowDown } from "@mui/icons-material";
import { EditPost } from "./EditPost/EditPost";
import { PostDetails } from "../Requests/PostDetails/PostDetails";
import { Loader } from "../../../Assets/Loader/Loader";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const MyPostsGrid = ({ data }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState();
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDetailsOpen = () => setOpenDetails(true);
  const handleDetailsClose = () => setOpenDetails(false);

  const handleWithdrawOpen = () => setOpenWithdraw(true);
  const handleWithdrawClose = () => setOpenWithdraw(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setAnchorEl(event.target);
    setPost(row.row);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    handleOpen();
  };

  const handleView = () => {
    handleMenuClose();
    handleDetailsOpen();
  };

  const handleDelete = () => {
    handleMenuClose();
    handleWithdrawOpen();
  };

  const deletePost = async () => {
    setLoading(true);
    try {
      await axios
        .delete(
          BASE_URL +
            `intraSell/productDetails/deleteProduct?product_id=${post.product_id}`,
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
          setMessage("Post Deleted Successfully.");
          setTimeout(() => {
            handleWithdrawClose();
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
            handleWithdrawClose();
          }, 2000);
        });
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        handleWithdrawClose();
      }, 2000);
    }
  };

  const columns = [
    {
      field: "product_name",
      headerName: "Post Title",
      width: 200,
    },
    {
      field: "product_description",
      headerName: "Description",
      width: 400,
    },
    {
      field: "created_date",
      headerName: "Published Date",
      width: 200,
      renderCell: (row) => {
        return (
          <span>
            {moment(new Date(row.row.created_date)).format("DD-MM-YYYY")}
          </span>
        );
      },
    },
    {
      field: "is_approved",
      headerName: "Status",
      width: 200,
      renderCell: (row) => {
        return (
          <span
            className={
              row.row.is_approved === false && row.row.action_date === null
                ? "pending d-flex align-items-center justify-content-center rounded"
                : row.row.is_approved === true
                ? "success d-flex align-items-center justify-content-center rounded"
                : row.row.is_approved === false && row.row.action_date !== null
                ? "cancelled d-flex align-items-center justify-content-center rounded"
                : ""
            }
          >
            {row.row.is_approved === true
              ? "Approved"
              : row.row.is_approved === false && row.row.action_date === null
              ? "Pending"
              : row.row.is_approved === false && row.row.action_date !== null
              ? "Rejected"
              : ""}
          </span>
        );
      },
    },

    {
      field: "actions",
      headerName: "actions",
      width: 150,
      sortable: false,

      // renderCell: (row) => {
      //   return (
      //     <div className="actionSpan">
      //       <Button onClick={handleOpen}>Edit</Button>
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
              <MenuItem onClick={handleView}>View</MenuItem>
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.product_id}
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
      <EditPost open={open} handleClose={handleClose} id={post?.product_id} />
      <PostDetails
        open={openDetails}
        handleClose={handleDetailsClose}
        id={post?.product_id}
      />
      <Modal
        open={openWithdraw}
        onClose={handleWithdrawClose}
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
            Are you sure you want to delete {post?.product_name}?
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            className="mt-5 d-flex justify-content-center"
          >
            <Button variant="contained" color="error" onClick={deletePost}>
              {loading ? <Loader /> : "Yes, delete!"}
            </Button>
            <Button sx={{ color: "black" }} onClick={handleWithdrawClose}>
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
