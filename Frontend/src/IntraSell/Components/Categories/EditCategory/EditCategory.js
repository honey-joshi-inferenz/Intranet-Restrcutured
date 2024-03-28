import React from "react";
import "./EditCategory.css";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const EditCategory = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("name");

  const [values, setValues] = useState();
  const [subcategory, setSubCategory] = useState([]);
  const [formErrors, setFormErrors] = useState({
    category_name: "",
    subcategory_name: "",
  });
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handlesubCategory = (index, event) => {
    let data = [...subcategory];
    data[index][event.target.name] = event.target.value;
    setSubCategory(data);
  };

  const AddsubCategory = () => {
    let newfield = { subcategory_id: null, subcategory_name: "" };

    setSubCategory([...subcategory, newfield]);
  };

  const RemovesubCategory = async (index, id) => {
    try {
      if (id === null) {
        let data = [...subcategory];
        data.splice(index, 1);
        setSubCategory(data);
      } else {
        await axios
          .delete(
            BASE_URL +
              `intraSell/subCategory/deleteProductSubCategory?subcategory_id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            let data = [...subcategory];
            data.splice(index, 1);
            setSubCategory(data);
          })
          .catch((err) => {
            setSnackbar(true);
            setErrorMsg(true);
            setMessage(err.message);

            if (err.message) {
              setMessage(err.message);
            }
            if (err.response.data) {
              setMessage(err.response.data.message);
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  let name, value;
  const handleChange = (event) => {
    name = event.target.name;
    value = event.target.value;
    setValues({ ...values, [name]: value });
  };
  const getCategory = async () => {
    try {
      await axios
        .get(
          BASE_URL +
            `intraSell/category/getProductCategoryById?category_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setValues(res.data.data);
          setSubCategory(res.data.data.subCategories);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
    // eslint-disable-next-line
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(values, subcategory);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      try {
        await axios
          .put(
            BASE_URL + "intraSell/category/updateCategoryAndSubCategory",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
            {
              category_id: id,
              category_name: values.category_name,
              subCategories: subcategory,
              updated_by: username,
            }
          )
          .then((res) => {
            setErrorMsg(false);
            setSnackbar(true);
            setMessage("Category Updated Successfully.");
            setTimeout(() => {
              setLoading(false);
              handleClose();
              setSubCategory(res.data.data.productSubCategories);
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

  const validate = (formValues, subCat) => {
    const errors = {};

    if (formValues.category_name?.trim().length === 0) {
      errors.category_name = "Category name is required.";
    }

    if (subCat[0]?.subcategory_name?.trim().length === 0) {
      errors.subcategory_name = "Subcategory is reuqired.";
    }

    return errors;
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
              <h4 className="fw-bold text-start" style={{ color: "#042049" }}>
                Edit Category
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
          {values ? (
            <form onSubmit={handleSubmit}>
              <div className="modalForm p-4 pt-1 pb-0">
                <div className="mb-5 mt-2">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control formControlInput"
                    name="category_name"
                    value={values.category_name}
                    onChange={handleChange}
                  />
                  {formErrors.category_name && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.category_name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="">
                  <span className="fs-5 fw-bold mb-5">Subcategory</span>
                  <div className="mb-5">
                    <label className="form-label">Add Subcategory</label>
                    {subcategory?.map((item, index) => {
                      return (
                        <div className="d-flex flex-row mt-2" key={index}>
                          <input
                            type="text"
                            name="subcategory_name"
                            value={item.subcategory_name}
                            onChange={(event) =>
                              handlesubCategory(index, event)
                            }
                            className="form-control formControlInput me-5"
                          />
                          <Button
                            className="subCategoryCancelButton fw-bold"
                            onClick={() =>
                              RemovesubCategory(index, item.subcategory_id)
                            }
                          >
                            X
                          </Button>
                        </div>
                      );
                    })}
                    {formErrors.subcategory_name && (
                      <div className="w-100 text-start">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.subcategory_name}
                        </span>
                      </div>
                    )}
                    <div className="d-flex justify-content-start mt-3">
                      <Button
                        className="subcategoryBtn"
                        onClick={AddsubCategory}
                      >
                        + Add another subcategory
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modalFooter p-4 border-top">
                <div className="d-flex justify-content-center">
                  <Button
                    className="cancelBtn fw-bold"
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button className="headerButton ms-2" type="submit">
                    {loading ? <Loader /> : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <span>Something went wrong!</span>
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
