import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import { Loader } from "../../../../Assets/Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const EditDepartment = ({ open, handleClose, id }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [values, setValues] = useState([]);
  const [formErrors, setFormErrors] = useState({
    value: "",
  });

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validation = (formValues) => {
    var errors = {};

    if (formValues.value?.trim().length === 0) {
      errors.value = "Please enter department.";
    }

    return errors;
  };

  const getDepartment = async () => {
    try {
      await axios
        .get(BASE_URL + `dropdown/getDropdownValueById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setValues(res.data.data);
        })
        .catch((err) => {
          console.log(err);

          if (err.response.status === 401) {
            setSnackbar(true);
            setErrorMsg(true);
            setMessage("Your session has been expired.");

            setTimeout(() => {
              navigate("/adms");
              localStorage.clear();
            }, 2000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartment();
    // eslint-disable-next-line
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(values);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .put(
            BASE_URL + "dropdown/updateDropdownValue",
            {
              id: values.id,
              name: values.value,
              value: values.value,
              drp_name: "department",
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
            setMessage("Department updated succesfully.");
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
        <Box className="muiModal" sx={{ width: 500 }}>
          <div className=" w-100 modalHeader d-flex justify-content-between  align-items-center border-bottom p-4">
            <div>
              <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
                Edit Department
              </h4>
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
          {Object.keys(values).length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="modalForm p-4">
                <div className="col-12">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control formControlInput"
                    name="value"
                    value={values?.value}
                    onChange={handleChange}
                  />
                  {formErrors.value && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.value}
                      </span>
                    </div>
                  )}
                </div>
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
                <Button className="headerButton ms-2" type="submit">
                  {loading ? <Loader /> : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <span className="fw-bold p-4 d-flex align-items-center  justify-content-center ">
                Something went wrong!
              </span>
            </>
          )}
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
