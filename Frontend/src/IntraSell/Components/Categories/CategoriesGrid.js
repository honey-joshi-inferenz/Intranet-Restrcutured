import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Loader } from "../../../Assets/Loader/Loader";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { EditCategory } from "./EditCategory/EditCategory";

export const CategoriesGrid = ({ categories }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const [subCatModal, setSubCatModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubcatOpen = () => setSubCatModal(true);
  const handleSubcatClose = () => setSubCatModal(false);
  const handleEditOpen = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);
  const handleSnackbar = () => setSnackbar(false);

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      await axios
        .put(
          BASE_URL +
            `intraSell/category/updateCategoryAndSubCategoryStatus?category_id=${
              category.category_id
            }&is_active=${false}`,
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
          setMessage("Category deleted succesfully.");
          setTimeout(() => {
            setLoading(false);
            handleClose();
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
              if (role === "HR" || role === "Admin" || role === "Accounts") {
                navigate("/adms");
              } else {
                navigate("/");
              }
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

  const deleteSubCategory = async () => {
    setLoading(true);
    try {
      await axios
        .delete(
          BASE_URL +
            `intraSell/subCategory/deleteProductSubCategory?subcategory_id=${subcategory.subcategory_id}`,
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
          setMessage("Subcategory deleted succesfully.");
          setTimeout(() => {
            setLoading(false);
            handleSubcatClose();
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
              if (role === "HR" || role === "Admin" || role === "Accounts") {
                navigate("/adms");
              } else {
                navigate("/");
              }
              localStorage.clear();
            }, 2000);
          }
          setTimeout(() => {
            setLoading(false);
            handleSubcatClose();
          }, 2000);
        });
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        handleSubcatClose();
      }, 2000);
    }
  };

  const Row = (props) => {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event, row) => {
      setAnchorEl(event.target);
      setCategory(row);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
    const handleEdit = () => {
      handleEditOpen();
      handleMenuClose();
    };
    const handleDelete = () => {
      handleOpen();
      handleMenuClose();
    };

    return (
      <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell width="20px">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.category_name}</TableCell>
          <TableCell>
            {moment(new Date(row.created_date)).format("DD-MM-YYYY")}
          </TableCell>
          <TableCell>{row.created_by}</TableCell>
          <TableCell>
            <div>
              <Button
                aria-controls={openMenu ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                onClick={(e) => {
                  handleClick(e, row);
                }}
                className="actionDiv"
                endIcon={<KeyboardArrowDownIcon />}
              >
                Actions
              </Button>
              <Menu
                anchorEl={anchorEl}
                keepMounted
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
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography gutterBottom className="ms-3 fw-bold">
                  Subcategories
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Added Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.subCategories?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span>{row.subcategory_name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="materialUiGridSpan">
                            {row.created_date.slice(0, 10)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              handleSubcatOpen();
                              setSubCategory(row);
                            }}
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <div className="mt-2">
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Category</TableCell>
              <TableCell>Added Date</TableCell>
              <TableCell>Added By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map((row, index) => (
              <Row key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
          <Typography sx={{ mt: 2, color: "#3F4254" }} className="text-center">
            Are you sure you want to delete {category?.category_name} ?
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            className="mt-5 d-flex justify-content-center"
          >
            <Button variant="contained" color="error" onClick={deleteCategory}>
              {loading ? <Loader /> : "Yes, delete!"}
            </Button>
            <Button sx={{ color: "black" }} onClick={handleClose}>
              No, cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={subCatModal}
        onClose={handleSubcatClose}
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
          <Typography sx={{ mt: 2, color: "#3F4254" }} className="text-center">
            Are you sure you want to delete {subcategory?.subcategory_name} ?
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            className="mt-5 d-flex justify-content-center"
          >
            <Button
              variant="contained"
              color="error"
              onClick={deleteSubCategory}
            >
              {loading ? <Loader /> : "Yes, delete!"}
            </Button>
            <Button sx={{ color: "black" }} onClick={handleSubcatClose}>
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
      <EditCategory
        open={editModal}
        handleClose={handleEditClose}
        id={category.category_id}
      />
    </div>
  );
};
