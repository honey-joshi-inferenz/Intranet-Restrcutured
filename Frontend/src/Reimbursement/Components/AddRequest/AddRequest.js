import React, { useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { useState } from "react";
import { Loader } from "../../../Assets/Loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect } from "react";
import { Api } from "../../../Config/API";
import { useNavigate } from "react-router-dom";

export const AddRequest = ({ open, handleClose, getData }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [values, setValues] = useState({
    from: "",
    amount: "",
    method: "",
    description: "",
    category: "",
  });
  const [formErrors, setFormErrors] = useState({
    from: "",
    amount: "",
    method: "",
    description: "",
    category: "",
    file: "",
  });
  const [file, setFile] = useState(null);
  const [fileSuccessMsg, setFileSuccessMsg] = useState("");
  const [mode, setMode] = useState([]);
  const [category, setCategory] = useState([]);

  const handleSnackbar = () => setSnackbar(false);

  const handleFile = (file) => {
    setFile(file);
  };

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const validation = (formValues, file) => {
    var errors = {};
    if (file === null) {
      errors.file = "Please select invoice.";
    } else if (
      (file?.type === "image/png" ||
        file?.type === "image/jpeg" ||
        file?.type === "image/jpg" ||
        file?.type === "application/pdf") &&
      file?.size < 5000000
    ) {
      setFileSuccessMsg("File uploded Successfully.");
    } else if (file?.size > 5000000) {
      errors.file = "File is too large ! Maximum file size is 5 MB.";
    } else {
      errors.file = "Failed to upload file; the format is not supported.";
    }

    if (formValues.from?.trim().length === 0) {
      errors.from = "Please select expense date.";
    }
    if (formValues.amount?.trim().length === 0) {
      errors.amount = "Please enter the amount.";
    }
    if (formValues.method === "") {
      errors.method = "Please select payment method.";
    }
    if (formValues.category?.trim().length === 0) {
      errors.category = "Please select category of expenditure.";
    }
    if (formValues.description?.trim().length === 0) {
      errors.description = "Purpose of expenditure is required.";
    } else if (formValues.description.length > 400) {
      errors.description = "Please add your purpose in 400 characters or less.";
    }
    return errors;
  };

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
        account_id: userId,
        mode_id: values.method,
        paid_amount: values.amount,
        purpose_of_expenditure: values.description,
        expenditure_category: values.category,
        date_of_expense: values.from,
      };

      const formData = new FormData();
      // formData.append("account_id", userId);
      // formData.append("mode_id", values.method);
      // formData.append("paid_amount", parseFloat(values.amount));
      // formData.append("purpose_of_expenditure", values.description);
      // formData.append("expenditure_category", values.category);
      // formData.append("date_of_expense", values.from);
      formData.append("data", JSON.stringify(bodyData));
      formData.append("invoice", file);

      try {
        await axios
          .post(BASE_URL + "reimbursement/request/addNewRequest", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Your request has been added succesfully.");
            setTimeout(() => {
              setLoading(false);
              handleClose();
              handleClear();
              getData();
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
    setValues({
      id: "",
      department: "",
      raName: "",
      from: "",
      amount: "",
      method: "",
      description: "",
      category: "",
    });
    setFormErrors({
      id: "",
      department: "",
      raName: "",
      from: "",
      amount: "",
      method: "",
      description: "",
      category: "",
      file: "",
    });
    setFileSuccessMsg("");
    inputRef.current.value = null;
    setFile(null);
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
                Add Request
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
                    name="from"
                    value={values.from}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {formErrors.from && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.from}
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6 mt-2 mt-md-0 ">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control formControlInput"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="100000"
                  />
                  {formErrors.amount && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.amount}
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
                      name="method"
                      value={values.method}
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
                  {formErrors.method && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.method}
                      </span>
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6 d-flex flex-column mt-2 mt-md-0 ">
                  <label className="form-label">Category</label>
                  <FormControl>
                    <Select
                      className="outlinedDropdown"
                      name="category"
                      value={values.category}
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
                  {formErrors.category && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.category}
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
                  name="description"
                  value={values.description}
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
                {formErrors.description && (
                  <div className="w-100 text-start">
                    <span
                      className="text-danger mx-1"
                      style={{ fontSize: "12px" }}
                    >
                      {formErrors.description}
                    </span>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Invoice</label>
                <input
                  ref={inputRef}
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
                {(formErrors.file || fileSuccessMsg) && (
                  <div className="w-100 text-start">
                    <span
                      className={
                        formErrors.file
                          ? "text-danger mx-1"
                          : "text-success  mx-1"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {formErrors.file
                        ? formErrors.file
                        : fileSuccessMsg
                        ? fileSuccessMsg
                        : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="modalFooter p-4 pb-0 border-top">
              <div className="d-flex justify-content-center">
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
                  {loading ? <Loader /> : "Submit"}
                </Button>
              </div>
              <div
                className="mt-1"
                style={{ fontSize: "13px", color: "#A1A5B7" }}
              >
                Note : <br />
                <ul>
                  <li>
                    Make sure to provide accurate details. Otherwise your
                    reimbursement request could be affected.
                  </li>
                </ul>
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
