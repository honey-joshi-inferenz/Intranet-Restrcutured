import React, { useContext, useState, useEffect } from "react";
import "./AdminIntraSell.css";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { AdminHeader } from "../../../Components/AdminHeader/AdminHeader";
import intraSell from "../../../../Assets/Logo/intrasell.png";
import { Button } from "@mui/material";
import { GrFormNextLink } from "react-icons/gr";
import Avatar from "@mui/material/Avatar";
import { Call } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AddPost } from "../../../Components/MyPosts/AddPost/AddPost";
import { Api } from "../../../../Config/API";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const AdminIntraSell = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { intrasellNavVisible } = useContext(SidebarContext);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbar = () => setSnackbar(false);

  useEffect(() => {
    let api = new Api();

    api.getApprovedPosts(token).then((res) => {
      setData(res.data.data);
      if (res.error?.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(true);
        setMessage("Your session has been expired.");

        setTimeout(() => {
          navigate("/");
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

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
        <div className="d-flex align-items-center  justify-content-center flex-column  p-4 mt-5 mt-lg-0 w-100 container">
          <div className="toolbarHeader d-flex justify-content-start align-items-md-center align-items-start flex-column flex-md-row p-2 text-start">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Intrasell
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
                  Intrasell
                </li>
              </ol>
            </div>
          </div>

          <div className="intraSellBanner w-100 ps-3 pe-3 d-flex justify-content-between align-items-center">
            <div>
              <h4 className="w-75 text-start">
                Do you want to sell your Car, Bike, Home anything just post it
                and sell it
              </h4>
              <Button
                className="generalButton createAPostBtn d-flex justify-content-between mt-3"
                onClick={handleOpen}
              >
                <span>Create a Post</span>
                <div className="bg-light  rounded w-25">
                  <GrFormNextLink />
                </div>
              </Button>
            </div>
            <div className="createAPostImg d-flex  align-items-center justify-content-center ">
              <img alt="intraSell" src={intraSell} className="w-75" />
            </div>
          </div>
          <div className="intraSellAllPosts mt-3 w-100">
            {data?.length > 0 && (
              <>
                <div className="card p-3 w-100 d-flex flex-md-row flex-column ">
                  <div className="col-md-6 col-12 d-flex flex-column allpostImgDiv">
                    <img
                      src={data[0].thumbnail_image}
                      alt="demo1"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "200px",
                      }}
                    />
                    <div className="row g-2 mt-2">
                      {data[0].product_images?.map((i, index) => {
                        return (
                          <img
                            src={i}
                            alt="demo2"
                            style={{
                              width: "20%",
                              height: "auto",
                              maxHeight: "100px",
                            }}
                            key={index}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-md-6 col-12 mt-3 mt-md-0 allpostContent d-flex flex-column text-start ms-3">
                    <div className="intraSellAuthorDiv d-flex align-items-center  justify-content-start">
                      <Avatar>{data[0].user?.name.charAt(0)}</Avatar>
                      <div className="ms-2 intraSellAuthorDetails fw-bold">
                        <span>Post By</span>
                        <h5>{data[0].user?.name}</h5>
                      </div>
                    </div>
                    <div className="intraSellPostDetails p-2 mt-4">
                      <h5>{data[0].product_name}</h5>
                      <header className="mt-3">Product Description</header>
                      <p className="mt-2 ">{data[0].product_description}</p>
                      <div className="mt-5 d-flex justify-content-md-between flex-md-row flex-column ">
                        <h3>₹ {data[0].product_price}</h3>
                        <Button endIcon={<Call />} className="allPostCallBtn">
                          Call for More details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-md-row flex-column  mt-4">
                  {data.splice(1).map((i, index) => {
                    return (
                      <div
                        className="card col-md-6 col-12 p-3 me-0 me-md-2 mt-2 mt-md-0"
                        key={index}
                      >
                        <div className="d-flex flex-column allpostImgDiv w-100">
                          <img
                            src={i.thumbnail_image}
                            alt="demo1"
                            style={{
                              width: "100%",
                              height: "auto",
                              maxHeight: "200px",
                            }}
                          />
                          <div className="row g-2 mt-2">
                            {i.product_images?.map((i, index) => {
                              return (
                                <img
                                  src={i}
                                  alt="demo2"
                                  style={{
                                    width: "20%",
                                    height: "auto",
                                    maxHeight: "100px",
                                  }}
                                  key={index}
                                />
                              );
                            })}
                          </div>
                        </div>
                        <div className="allpostContent d-flex flex-column text-start mt-3">
                          <div className="intraSellAuthorDiv d-flex align-items-center  justify-content-start">
                            <Avatar>{i.user?.name.charAt(0)}</Avatar>
                            <div className="ms-2 intraSellAuthorDetails fw-bold">
                              <span>Post By</span>
                              <h5>{i.user?.name}</h5>
                            </div>
                          </div>
                          <div className="intraSellPostDetails p-2 mt-4">
                            <h5>{i.product_name}</h5>
                            <header className="mt-3">
                              Product Description
                            </header>
                            <p className="mt-2 ">{i.product_description}</p>
                            <div className="mt-5 d-flex justify-content-md-between flex-md-row flex-column ">
                              <h3>₹ {i.product_price}</h3>
                              <Button
                                endIcon={<Call />}
                                className="allPostCallBtn"
                              >
                                Call for More details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <AddPost open={open} handleClose={handleClose} />
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
