import React, { useEffect, useState } from "react";
import "./PostDetails.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Call, CheckCircle, Cancel, Close } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Api } from "../../../../Config/API";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";

export const PostDetails = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [postDetails, setPostDetails] = useState();
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  useEffect(() => {
    let api = new Api();
    api.getPostById(id, token).then((res) => {
      setPostDetails(res.data.data);
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
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await axios
        .put(
          BASE_URL + "intraSell/productDetails/verifyProduct",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
          {
            product_id: id,
            approved_by: name,
            is_approved: status,
          }
        )
        .then((res) => {
          setSnackbar(true);
          setErrorMsg(false);
          setMessage("Status updated succesfully.");
          setTimeout(() => {
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
            handleClose();
          }, 2000);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 600 }} role="presentation">
          <div className="p-3 requestPostDetails">
            <div className="d-flex justify-content-between ">
              <h4
                className="fw-bold text-start w-100"
                style={{ color: "#042049" }}
              >
                Post Details
              </h4>
              <Tooltip title="Close">
                <IconButton aria-label="close" onClick={handleClose}>
                  <Close fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
            {postDetails && (
              <div className="mt-4">
                <div className="d-flex flex-column requestpostImgDiv w-100">
                  <img
                    src={postDetails?.thumbnail_image}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "200px",
                    }}
                  />
                  <div className="row g-2 mt-2">
                    {postDetails?.product_images?.map((i, index) => {
                      return (
                        <img
                          src={i}
                          key={index}
                          alt="images"
                          style={{
                            width: "20%",
                            height: "auto",
                            maxHeight: "100px",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="requestpostContent d-flex flex-column text-start mt-3">
                  <div className=" d-flex align-items-center  justify-content-between">
                    <div className="requestAuthorDiv  d-flex align-items-center">
                      <Avatar>{postDetails?.user?.name.charAt(0)}</Avatar>
                      <div className="ms-2 requestAuthorDetails fw-bold">
                        <span>Post By</span>
                        <h5>{postDetails?.user?.name}</h5>
                      </div>
                    </div>
                    {name === postDetails?.user?.name &&
                    (role === "Accounts" ||
                      role === "Interviewer" ||
                      role === "Employee") ? (
                      ""
                    ) : (
                      <div className="requestActions">
                        <Tooltip title="Approve">
                          <IconButton
                            aria-label="approve"
                            onClick={() => updateStatus(true)}
                            disabled={postDetails.is_approved === true}
                          >
                            <CheckCircle style={{ color: "#5AE4A7" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            aria-label="reject"
                            onClick={() => updateStatus(false)}
                            disabled={postDetails.is_approved === false}
                          >
                            <Cancel style={{ color: "#FF1628" }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  <div className="requestPostDetails p-2 mt-4">
                    <h5>{postDetails?.product_name}</h5>
                    <header className="mt-3">Product Description</header>
                    <p className="mt-2 ">{postDetails?.product_description}</p>
                    <div className="mt-5 d-flex justify-content-md-between flex-md-row flex-column ">
                      <h3>₹ {postDetails?.product_price}</h3>
                      {name === postDetails?.user?.name &&
                      (role === "Accounts" ||
                        role === "Interviewer" ||
                        role === "Employee") ? (
                        ""
                      ) : (
                        <Button
                          endIcon={<Call />}
                          className="requestPostCallBtn"
                        >
                          Call for More details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Box>
      </Drawer>
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
