import React, { useRef } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import { useContext } from "react";
import { CandidateContext } from "../../../Context/CreateContext";

export const UpdateResume = ({ open, handleClose }) => {
  const hiddenFileInput = useRef(null);

  const { file, setFile, handleFile } = useContext(CandidateContext);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleClear = () => {
    hiddenFileInput.current.value = null;
    setFile(null);
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
            <span sx={{ color: "#3F4254" }} className="fw-bold fs-5">
              Update Resume
            </span>
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
          <form>
            <div className="p-4 ms-4 mb-4 d-flex flex-column">
              <input
                type="file"
                accept=".doc,.docx,.pdf"
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
                      onClick={handleClose}
                    >
                      Upload File
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
                  >
                    Attach File
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
