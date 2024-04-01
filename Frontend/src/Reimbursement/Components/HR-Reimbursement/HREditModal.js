import React, { useState } from "react";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import { Loader } from "../../../Assets/Loader/Loader";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const HREditModal = ({
  open,
  handleClose,
  data,
  setData,
  currentStatus,
}) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [formErrors, setFormErrors] = useState({
    status: "",
    hr_reason_reject: "",
    hr_reason_onhold: "",
  });
  const [rejected, setRejected] = useState(false);
  const [onHold, setOnHold] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setData({ ...data, [name]: value });
    if (name === "status" && value === "Rejected") {
      setRejected(true);
      setOnHold(false);
    } else if (name === "status" && value === "On Hold") {
      setOnHold(true);
      setRejected(false);
    }
  };

  const validate = (formValues) => {
    var errors = {};
    if (formValues.status?.trim().length === 0) {
      errors.status = "Please select status to update.";
    }
    if (formValues.hr_reason_reject?.trim().length === 0 && rejected) {
      errors.hr_reason_reject = "Please enter reason to reject.";
    }
    if (formValues.hr_reason_onhold?.trim().length === 0 && onHold) {
      errors.hr_reason_onhold = "Please enter reason to on hold.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(data);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      try {
        await axios
          .put(
            BASE_URL + "reimbursement/request/updateStatusByHR",
            {
              transaction_id: data.transaction_id,
              status: data.status,
              hr_reason_onhold: data.hr_reason_onhold,
              hr_reason_reject: data.hr_reason_reject,
              hr_approved_by: userName,
            },
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
            setMessage("Status updated succesfully.");
            setTimeout(() => {
              setLoading(false);
              handleClose();
              navigate("/reimbursement-home");
            }, 2000);
          })
          .catch((err) => {
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
            }, 2000);
          });
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
          handleClose();
        }, 2000);
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="muiModal">
          <div className=" w-100 modalHeader d-flex justify-content-between  align-items-center border-bottom p-4">
            <div>
              <h5 className="fw-bold">Update Status</h5>
            </div>
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                handleClose();
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modalForm p-4 w-100">
              <FormControl className="w-100 mb-3">
                <Select
                  className="outlinedDropdown w-100"
                  name="status"
                  value={data.status}
                  onChange={handleChange}
                  displayEmpty
                  style={{ height: "90%", borderRadius: "0.4rem" }}
                >
                  <MenuItem value={data.status} disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="Approved">Approve</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Rejected">Reject</MenuItem>
                </Select>
                {formErrors.status && (
                  <div className="w-100 text-start">
                    <span
                      className="text-danger mx-1"
                      style={{ fontSize: "12px" }}
                    >
                      {formErrors.status}
                    </span>
                  </div>
                )}
              </FormControl>

              {data.status === "Rejected" ? (
                <div className="mb-3 w-100">
                  <textarea
                    className="form-control formControlInput"
                    placeholder="Reason for Reject"
                    name="hr_reason_reject"
                    value={data.hr_reason_reject}
                    onChange={handleChange}
                  />
                  {formErrors.hr_reason_reject && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.hr_reason_reject}
                      </span>
                    </div>
                  )}
                </div>
              ) : data.status === "On Hold" ? (
                <div className="w-100 mb-3">
                  <textarea
                    className="form-control formControlInput"
                    placeholder="Reason for On Hold"
                    name="hr_reason_onhold"
                    value={data.hr_reason_onhold}
                    onChange={handleChange}
                  />
                  {formErrors.hr_reason_onhold && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.hr_reason_onhold}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="modalFooter p-4 border-top d-flex justify-content-center ">
              <Button
                className="cancelBtn fw-bold"
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className="headerButton ms-2"
                type="submit"
                disabled={data.status === currentStatus ? true : false}
              >
                {loading ? <Loader /> : "Submit"}
              </Button>
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
