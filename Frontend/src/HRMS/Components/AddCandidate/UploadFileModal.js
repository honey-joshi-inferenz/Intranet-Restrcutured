import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { Loader } from "../../../Assets/Loader/Loader";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const UploadFileModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleFile = (file) => {
    setFile(file);
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleClear = () => {
    hiddenFileInput.current.value = null;
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("candidates", file);
    try {
      setLoading(true);

      await axios
        .post(BASE_URL + "candidate/uploadBulkCandidates", formData)
        .then((res) => {
          setSnackbar(true);
          setErrorMsg(false);
          setMessage("File uploaded succesfully.");
          setTimeout(() => {
            setLoading(false);
            handleClose();
            handleClear();
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
            handleClose();
            handleClear();
          }, 2000);
        });
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        handleClose();
        handleClear();
      }, 2000);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
          hiddenFileInput.current.value = null;
          setFile(null);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="muiModal" sx={{ width: 500 }}>
          <div className="d-flex justify-content-between p-4 pb-2">
            <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
              Upload File
            </h4>
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                handleClose();
                handleClear();
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          </div>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="p-4 ms-4 mb-4 d-flex flex-column">
              <input
                type="file"
                accept=".zip"
                style={{ display: "none" }}
                ref={hiddenFileInput}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div>
                {file && (
                  <div className="hasFile mb-3 p-4 d-flex justify-content-between">
                    <span>{file.name}</span>

                    <IconButton
                      aria-label="close"
                      size="small"
                      onClick={handleClear}
                      className="deleteFile ms-4"
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  </div>
                )}
                {file ? (
                  <>
                    <Button
                      variant="contained"
                      className="headerButton"
                      type="submit"
                    >
                      {loading ? <Loader /> : "Upload File"}
                    </Button>
                    <Button
                      className="cancelBtn fw-bold ms-3"
                      onClick={() => {
                        handleClose();
                        handleClear();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    className="headerButton"
                    onClick={handleClick}
                    disabled={loading ? true : false}
                  >
                    Attach File
                  </Button>
                )}
              </div>
            </div>
          </form>
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
