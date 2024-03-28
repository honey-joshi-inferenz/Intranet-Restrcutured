import React, { useContext, useEffect, useState } from "react";
import "./Categories.css";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { AdminHeader } from "../../../Components/AdminHeader/AdminHeader";
import { Link, useNavigate } from "react-router-dom";
import { CategoriesGrid } from "../../../Components/Categories/CategoriesGrid";
import { Button } from "@mui/material";
import { RiSearch2Line } from "react-icons/ri";
import { Replay } from "@mui/icons-material";
import { AddCategory } from "../../../Components/Categories/AddCategory/AddCategory";
import { Api } from "../../../../Config/API";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const Categories = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { intrasellNavVisible } = useContext(SidebarContext);
  const [filter, setFilter] = useState({ search: "", status: "" });
  const [open, setOpen] = useState(false);
  const [categories, setCategoies] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFilter({ ...filter, [name]: value });
  };

  const getData = () => {
    let api = new Api();
    api.getCategories(token).then((res) => {
      setCategoies(res.data.data);
      setFilteredData(res.data.data);
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
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    const escapedSearch = escapeRegExp(filter.search);

    const result = categories?.filter((item) => {
      return (
        filter.search === "" ||
        item.category_name.toLowerCase().match(new RegExp(escapedSearch, "i"))
      );
    });
    setFilteredData(result);
    // eslint-disable-next-line
  }, [filter]);

  return (
    <div className="maincontainer">
      <Sidebar />
      <AdminHeader />
      <div
        className={
          !intrasellNavVisible
            ? "page page-without-navbar"
            : "page page-with-navbar"
        }
      >
        <div className="d-flex align-items-center  justify-content-center flex-column  p-4 mt-5 mt-lg-0 w-100">
          <div className="toolbarHeader d-flex justify-content-start align-items-md-center align-items-start flex-column flex-md-row p-2 text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Categories
            </h4>
            <h5 className="mx-3 vr d-md-flex d-none">|</h5>
            <div aria-label="breadcrumb" className="mt-1 breadcrumbs">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/intrasell-dashboard" className="link">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Categories
                </li>
              </ol>
            </div>
          </div>
          <div className="d-flex align-items-center  justify-content-center w-100">
            {categories?.length > 0 ? (
              <div className="card p-3 w-100">
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
                      value={filter.search}
                      onChange={handleChange}
                      style={{ height: "38px" }}
                    />
                  </div>
                  <div className=" d-flex flex-md-row flex-column ">
                    <div className="d-flex ms-0 ms-md-3">
                      <Button
                        variant="contained"
                        className="headerButton "
                        onClick={handleOpen}
                      >
                        Add Category
                      </Button>
                      <Button
                        variant="contained"
                        className="headerButton ms-3"
                        sx={{ width: "38px" }}
                        onClick={() => {
                          getData();
                          setFilter({ search: "", status: "" });
                        }}
                      >
                        <Replay />
                      </Button>
                    </div>
                  </div>
                </div>
                <CategoriesGrid categories={filteredData} />
              </div>
            ) : (
              <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
                <span className="fw-bold">Data not found!</span>
                <span
                  className="fw-bold mt-3"
                  style={{ fontSize: "13px", color: "#4E5F77" }}
                >
                  There are no categories to show here right now!
                </span>
                <div>
                  <Button
                    variant="contained"
                    className="headerButton mt-3"
                    onClick={handleOpen}
                  >
                    Add Category
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddCategory open={open} handleClose={handleClose} />
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
