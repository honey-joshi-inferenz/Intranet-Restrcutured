import React, { useContext, useState, useEffect } from "react";
import "./AdminSelfPosts.css";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { AdminHeader } from "../../../Components/AdminHeader/AdminHeader";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import intraSell from "../../../../Assets/Logo/intrasell.png";
import { GrFormNextLink } from "react-icons/gr";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { RiSearch2Line } from "react-icons/ri";
import { MyPostsGrid } from "../../../Components/MyPosts/MyPostsGrid";
import { AddPost } from "../../../Components/MyPosts/AddPost/AddPost";
import { Link } from "react-router-dom";
import { Api } from "../../../../Config/API";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Replay } from "@mui/icons-material";

export const AdminSelfPosts = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const { intrasellNavVisible } = useContext(SidebarContext);
  const [filter, setFilter] = useState({ search: "", status: "" });
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [fullName, setFullName] = useState("");

  const handleSnackbar = () => setSnackbar(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFilter({ ...filter, [name]: value });
  };

  const getInitials = (name) => {
    if (!name) return "";

    const [firstName, lastName] = name.split(" ");
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName?.charAt(0);

    setFullName(firstInitial + lastInitial);
    // return firstInitial + lastInitial;
  };

  const getData = async () => {
    let api = new Api();

    await api.getMyPosts(userId, token).then((res) => {
      setData(res.data.data);
      setFilteredData(res.data.data);
      if (res?.error?.response.status === 401) {
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

  useEffect(() => {
    let api = new Api();

    api.getApprovedPosts(token).then((res) => {
      setPosts(res.data.data);
      if (res.data.data) {
        getInitials(res.data?.data[0]?.user?.name);
      }
      if (res?.error?.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(true);
        setMessage("Your session has been expired.");

        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    const escapedSearch = escapeRegExp(filter.search);

    const result = data?.filter((item) => {
      return (
        (filter.search === "" ||
          item.product_name
            .toLowerCase()
            .match(new RegExp(escapedSearch, "i"))) &&
        (filter?.status === "" ||
          (filter?.status === "Pending" &&
            item.is_approved === false &&
            item.action_date === null) ||
          (filter?.status === "Approved" && item.is_approved === true) ||
          (filter?.status === "Rejeted" &&
            item.is_approved === false &&
            item.action_date !== null))
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
        <div className="d-flex align-items-center  justify-content-center flex-column  container  p-4 mt-5 mt-lg-0 w-100">
          <div className="toolbarHeader d-flex justify-content-start align-items-md-center align-items-start flex-column flex-md-row p-2 text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              My Posts
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
                  My Posts
                </li>
              </ol>
            </div>
          </div>
          {posts?.length > 0 && (
            <>
              <div className="d-flex flex-md-row flex-column w-100">
                <div className="col-md-8 col-12 card p-3 myPosts-newPost d-flex flex-row align-items-center justify-content-center ">
                  <div className="myPostsBannerImg col-5">
                    <img
                      src={posts[0]?.thumbnail_image}
                      alt="img"
                      className="w-75"
                    />
                  </div>
                  <div className="ms-5 text-start col-7">
                    <h3 className="fw-bold mb-3 ">New Post</h3>
                    <span className="myPostnameTag p-2 fw-bold">
                      {fullName}
                    </span>
                    <span className="text-light fw-bold ms-2">
                      {posts[0]?.user?.name}
                    </span>
                    <p className="text-light mt-3 w-75">
                      {posts[0]?.product_description}
                    </p>
                    <Button
                      className="generalButton"
                      onClick={() => navigate("/intrasell-posts")}
                    >
                      <span>See Post</span>
                    </Button>
                  </div>
                </div>
                <div className="col-md-4 col-12 ms-0 ms-md-3 mt-3 mt-md-0 card">
                  <div className="p-3  position-relative d-flex  flex-row flex-xl-column intrasellNavigate">
                    <div className="position-absolute myPostImage">
                      <img alt="intraSell" src={intraSell} className="" />
                    </div>
                    <Button
                      className="generalButton homeButton d-flex justify-content-between"
                      onClick={() => navigate("/intrasell-posts")}
                    >
                      <span>Intrasell Now</span>
                      <div className="bg-light  rounded">
                        <GrFormNextLink />
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
              <h4
                className="fw-bold mt-4 text-start w-100"
                style={{ color: "#042049" }}
              >
                Your Post Status
              </h4>
            </>
          )}

          {data?.length > 0 ? (
            <div className="card p-3 mt-3 w-100">
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
                    <FormControl sx={{ minWidth: 120, border: "none" }}>
                      <Select
                        name="status"
                        value={filter.status}
                        onChange={handleChange}
                        displayEmpty
                        className="outlinedDropdown"
                        notched
                      >
                        <MenuItem value="" disabled>
                          Status
                        </MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejeted">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      className="headerButton ms-3"
                      onClick={handleOpen}
                    >
                      Create a Post
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
              <div className="mt-2">
                <MyPostsGrid data={filteredData} />
              </div>
            </div>
          ) : (
            <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
              <h2 className="fw-bold">Intrasell</h2>
              <p className="mt-2">
                There are no ongoing requests from you;
                <br /> Please add new request.
              </p>
              <Button className="headerButton" onClick={handleOpen}>
                Create a post
              </Button>
            </div>
          )}

          <AddPost open={open} handleClose={handleClose} getData={getData} />
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
      </div>
    </div>
  );
};
