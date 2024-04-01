import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { Loader } from "../../../../Assets/Loader/Loader";
import { Api } from "../../../../Config/API";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";

export const EditRequest = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [values, setValues] = useState([]);
  const [formErrors, setFormErrors] = useState({
    mode_id: "",
    paid_amount: "",
    purpose_of_expenditure: "",
    expenditure_category: "",
    date_of_expense: "",
  });
  const [file, setFile] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [mode, setMode] = useState([]);
  const [category, setCategory] = useState([]);

  const handleSnackbar = () => setSnackbar(false);

  const handleFile = (file) => {
    setErrMsg("");
    setSuccessMsg("");
    setFile(file);
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "application/pdf" ||
      file.type === "application/x-zip-compressed"
    ) {
      setSuccessMsg("File uploded Successfully.");
    } else {
      setErrMsg("Failed to upload file; the format is not supported.");
    }
    if (file.size > 5000000) {
      setErrMsg("File is too large ! Maximum file size is 5 MB.");
    }
  };

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validation = (formValues, file) => {
    var errors = {};

    if (formValues.date_of_expense?.trim().length === 0) {
      errors.date_of_expense = "Please select expense date.";
    }
    if (formValues.paid_amount?.trim().length === 0) {
      errors.paid_amount = "Please enter the amount.";
    }
    if (formValues.mode_id === "") {
      errors.mode_id = "Please select payment method.";
    }
    if (formValues.expenditure_category?.trim().length === 0) {
      errors.expenditure_category = "Please select category of expenditure.";
    }
    if (formValues.purpose_of_expenditure?.trim().length === 0) {
      errors.purpose_of_expenditure = "Purpose of expenditure is required.";
    } else if (formValues.purpose_of_expenditure.length > 400) {
      errors.purpose_of_expenditure =
        "Please add your purpose in 400 characters or less.";
    }

    return errors;
  };

  const getReimburseById = async () => {
    try {
      await axios
        .get(
          BASE_URL +
            `reimbursement/request/getRequestById?transaction_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
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
              if (role === "HR" || role === "Admin" || role === "Accounts") {
                navigate("/adms");
              } else {
                navigate("/");
              }
              localStorage.clear();
            }, 2000);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReimburseById();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    let api = new Api();

    api.getReimburseMode(token).then((res) => {
      setMode(res.data.data);
      if (res.error?.response.status === 401) {
        setSnackbar(true);
        setErrorMsg(false);
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
    });

    api.getReimburseCategories(token).then((res) => {
      setCategory(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          if (role === "HR" || role === "Admin" || role === "Accounts") {
            navigate("/adms");
          } else {
            navigate("/");
          }
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(values, file);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      const bodyData = {
        transaction_id: id,
        mode_id: values.mode_id,
        paid_amount: values.paid_amount,
        purpose_of_expenditure: values.purpose_of_expenditure,
        expenditure_category: values.expenditure_category,
        date_of_expense: values.date_of_expense,
      };

      const formData = new FormData();
      // formData.append("transaction_id", id);
      // formData.append("mode_id", values.mode_id);
      // formData.append("paid_amount", parseFloat(values.paid_amount));
      // formData.append("purpose_of_expenditure", values.purpose_of_expenditure);
      // formData.append("expenditure_category", values.expenditure_category);
      // formData.append("date_of_expense", values.date_of_expense);
      formData.append("data", JSON.stringify(bodyData));
      formData.append("invoice", file !== null ? file : values.invoice);

      try {
        await axios
          .put(BASE_URL + "reimbursement/request/updateRequest", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Your request has been updated succesfully.");
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
    }
  };

  const handleClear = () => {
    setFormErrors({
      from: "",
      amount: "",
      method: "",
      description: "",
      category: "",
      file: "",
    });
    setFile(null);
    setErrMsg("");
    setSuccessMsg("");
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="muiModal w-50">
          <div className=" w-100 modalHeader d-flex justify-content-between  align-items-center border-bottom p-4">
            <div>
              <h4
                className="fw-bold text-start w-100"
                style={{ color: "#042049" }}
              >
                Edit Request
              </h4>
            </div>
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
          <form onSubmit={handleSubmit}>
            <div className="modalForm p-4 pt-1 pb-0">
              <div className="mb-3 d-flex flex-column flex-md-row  w-100">
                <div className="col-12 col-md-6  me-0 me-md-2">
                  <label className="form-label">Expense Date</label>
                  <input
                    type="date"
                    className="form-control formControlInput"
                    name="date_of_expense"
                    value={values.date_of_expense}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {formErrors.date_of_expense && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.date_of_expense}
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6 mt-2 mt-md-0 ">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control formControlInput"
                    name="paid_amount"
                    value={values.paid_amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="100000"
                  />
                  {formErrors.paid_amount && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.paid_amount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3 d-flex flex-column  flex-md-row w-100">
                <div className="col-12 col-md-6 me-0 me-md-2 d-flex flex-column ">
                  <label className="form-label">Payment Method</label>
                  <FormControl>
                    <Select
                      className="outlinedDropdown"
                      name="mode_id"
                      value={values.mode_id}
                      onChange={handleChange}
                      displayEmpty
                      style={{ height: "90%", borderRadius: "0.4rem" }}
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      {mode?.length > 0 &&
                        mode?.map((i, index) => {
                          return (
                            <MenuItem value={i.id} key={index}>
                              {i.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  {formErrors.mode_id && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.mode_id}
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-2 mt-md-0 ">
                  <label className="form-label">Category</label>
                  <FormControl>
                    <Select
                      className="outlinedDropdown"
                      name="expenditure_category"
                      value={values.expenditure_category}
                      onChange={handleChange}
                      displayEmpty
                      style={{ height: "90%", borderRadius: "0.4rem" }}
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>
                      {category?.length > 0 &&
                        category?.map((i, index) => {
                          return (
                            <MenuItem value={i.value} key={index}>
                              {i.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  {formErrors.expenditure_category && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.expenditure_category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Purpose of Expenditure(s) / Description
                </label>
                <textarea
                  type="textarea"
                  className="form-control formControlInput"
                  name="purpose_of_expenditure"
                  value={values.purpose_of_expenditure}
                  onChange={handleChange}
                  maxLength={400}
                />
                <span
                  className="text-center mt-3 w-75"
                  style={{ fontSize: "13px", color: "#A1A5B7" }}
                >
                  Please give detailed reasons for all expenditures. Maximum 400
                  characters.
                </span>
                {formErrors.purpose_of_expenditure && (
                  <div className="w-100 text-start">
                    <span
                      className="text-danger mx-1"
                      style={{ fontSize: "12px" }}
                    >
                      {formErrors.purpose_of_expenditure}
                    </span>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <div className="d-flex flex-column  flex-md-row justify-content-md-between align-items-center ">
                  <label className="form-label">Update Invoice</label>
                  <a href={values.invoice} target="_blank" rel="noreferrer">
                    <Button
                      sx={{ color: "#114FFF" }}
                      className=" text-decoration-underline "
                    >
                      View Current Invoice
                    </Button>
                  </a>
                </div>
                <input
                  accept="application/pdf,image/png,image/jpg"
                  type="file"
                  className="form-control formControlInput"
                  name="invoice"
                  onChange={(e) => {
                    handleFile(e.target.files[0]);
                  }}
                />
                <span
                  className="text-center mt-3 w-75"
                  style={{ fontSize: "13px", color: "#A1A5B7" }}
                >
                  .png, .jpg, .pdf file only. Maximum file size is 5 MB.
                </span>

                {(errMsg || successMsg) && (
                  <div className="w-100 text-start">
                    <span
                      className={
                        errMsg ? "text-danger mx-1" : "text-success  mx-1"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {errMsg ? errMsg : successMsg ? successMsg : ""}
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
                  handleClear();
                }}
              >
                Cancel
              </Button>
              <Button className="headerButton ms-2" type="submit">
                {loading ? <Loader /> : "Save Changes"}
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
