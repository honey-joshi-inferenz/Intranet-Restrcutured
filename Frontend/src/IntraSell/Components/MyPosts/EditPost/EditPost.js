import React, { useEffect } from "react";
import "./EditPost.css";
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
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiFileUploadLine } from "react-icons/ri";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { IoMdImages } from "react-icons/io";
import { HiPencil } from "react-icons/hi";
import { Api } from "../../../../Config/API";

export const EditPost = ({ open, handleClose, id }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const inputRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [values, setValues] = useState();
  const [formErrors, setFormErrors] = useState({
    brand_name: "",
    product_name: "",
    product_price: "",
    category_id: "",
    subcategory_id: "",
    product_description: "",
    product_images: "",
    thumbnail_image: "",
  });
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productImgPreview, setProductImgPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const handleSnackbar = () => setSnackbar(false);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleFile = (img) => {
    setFile(img);
    if (typeof img === "object" && img !== null) {
      setPreviewImage(URL.createObjectURL(img));
    } else {
      setPreviewImage(img);
    }
  };

  const handleImageChange = (fileList) => {
    if (!fileList) {
      return;
    }
    const imgArray = [];
    const imagesArray = Array.from(fileList)?.map((file) => {
      if (typeof file === "object") {
        return URL.createObjectURL(file);
      } else {
        return file;
      }
    });

    Array.from(fileList)?.forEach((file) => {
      imgArray.push(file);
    });

    setProductImgPreview(imagesArray);
    setProductImages(imgArray);
  };

  const handleImagesClick = (event) => {
    inputRef.current.click();
  };

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
    if (name === "category") {
      getSubCategories(value);
    }
  };

  useEffect(() => {
    let api = new Api();

    api.getCategories(token).then((res) => {
      setCategories(res.data.data);

      if (res.error?.response.status === 401) {
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

  useEffect(() => {
    let api = new Api();

    api.getPostById(id, token).then((res) => {
      setValues(res.data.data);
      handleFile(res.data.data?.thumbnail_image);
      handleImageChange(res.data.data?.product_images);
      getSubCategories(res.data.data?.category_id);
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

  const getSubCategories = async (id) => {
    try {
      let api = new Api(id);
      api.getSubCategories(id, token).then((res) => {
        setSubCategories(res.data.data);
        if (res.error?.response.status === 401) {
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

  const validation = (formValues, file, thumbnail) => {
    var errors = {};
    if (file?.length === 0) {
      errors.product_images = "Please upload product images.";
    } else if (file?.length > 5) {
      errors.product_images = "Upload upto 5 images.";
    }

    if (thumbnail === null) {
      errors.thumbnail_image = "Please select thumbnail image.";
    }

    if (formValues.brand_name === "") {
      errors.brand_name = "Please add Brand/Company of the product.";
    }

    if (formValues.product_name === "") {
      errors.product_name = "Please add title of post.";
    }
    if (formValues.product_price === "") {
      errors.product_price = "Please add price of product.";
    }
    if (formValues.cacategory_id === "") {
      errors.category_id = "Please select the category of product.";
    }
    if (formValues.subcategory_id === "") {
      errors.subcategory_id = "Please select the subcategory of product.";
    }
    if (formValues.product_description === "") {
      errors.product_description = "Description of product is required.";
    } else if (formValues.product_description?.length > 400) {
      errors.product_description =
        "Please add your description in 400 characters or less.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(values, productImages, file);
    setFormErrors(errors);

    const formData = new FormData();
    formData.append("product_id", id);
    formData.append("category_id", values.category_id);
    formData.append("subcategory_id", values.subcategory_id);
    formData.append("product_name", values.product_name);
    formData.append("product_description", values.product_description);
    formData.append("product_price", values.product_price);
    formData.append("price_currency", "INR");
    formData.append("brand_name", values.brand_name);
    formData.append("years_of_usage", values.years_of_usage);
    formData.append("owners_count", values.owners_count);
    formData.append("thumbnail_image", file);
    for (let i = 0; i < productImages.length; i++) {
      formData.append("product_images", productImages[i]);
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .put(BASE_URL + "intraSell/productDetails/updateProduct", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setSnackbar(true);
            setErrorMsg(false);
            setMessage("Post updated succesfully.");
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
      brand_name: "",
      product_name: "",
      product_price: "",
      category_id: "",
      subcategory_id: "",
      product_description: "",
      product_images: "",
      thumbnail_image: "",
    });
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
                Edit Post
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
            <div className="modalForm p-4 d-flex flex-md-row flex-column  ">
              {values ? (
                <>
                  <div className="col-md-5 col-12 p-3">
                    <div className="d-flex flex-column mb-4">
                      <label className="form-label">Thumbnail Image</label>
                      <div className="d-flex justify-content-center flex-column align-items-center mt-4">
                        <div className="card w-75 thumbnailImg">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            name="categoryThumbnail"
                            style={{ display: "none" }}
                            ref={hiddenFileInput}
                            onChange={(e) => handleFile(e.target.files[0])}
                          />
                          {previewImage === null ? (
                            <IoMdImages size={80} color="#A1A5B7" />
                          ) : (
                            ""
                          )}
                          <div
                            className="imagePencil card rounded-circle"
                            onClick={handleClick}
                          >
                            <HiPencil className="pencil" />
                          </div>
                          {previewImage && (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="previewImg"
                            />
                          )}
                        </div>
                        {formErrors.thumbnail_image && (
                          <div className="w-100 text-center">
                            <span
                              className="text-danger mx-1"
                              style={{ fontSize: "12px" }}
                            >
                              {formErrors.thumbnail_image}
                            </span>
                          </div>
                        )}
                        <span
                          className="text-start mt-2"
                          style={{ fontSize: "12px", color: "#A1A5B7" }}
                        >
                          Set the post thumbnail image. Only *.png, *.jpg and
                          *.jpeg image files are accepted.
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-column mb-3">
                      <label className="form-label">Category</label>
                      <FormControl>
                        <Select
                          className="outlinedDropdown"
                          name="category_id"
                          value={values.category_id}
                          onChange={handleChange}
                          displayEmpty
                          style={{ height: "48px", borderRadius: "0.4rem" }}
                        >
                          <MenuItem value="" disabled>
                            Select
                          </MenuItem>
                          {categories?.map((i, index) => {
                            return (
                              <MenuItem key={index} value={i.category_id}>
                                {i.category_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {formErrors.category_id && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.category_id}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column">
                      <label className="form-label">Subcategory</label>
                      <FormControl>
                        <Select
                          className="outlinedDropdown"
                          name="subcategory_id"
                          value={values.subcategory_id}
                          onChange={handleChange}
                          displayEmpty
                          style={{ height: "48px", borderRadius: "0.4rem" }}
                        >
                          <MenuItem value="" disabled>
                            Select
                          </MenuItem>
                          {subCategories?.map((i, index) => {
                            return (
                              <MenuItem key={index} value={i.subcategory_id}>
                                {i.subcategory_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {formErrors.subcategory_id && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.subcategory_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-7 col-12 p-3">
                    <div className="mb-3 d-flex flex-column">
                      <label className="form-label">Brand / Company</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="brand_name"
                        value={values.brand_name}
                        onChange={handleChange}
                      />
                      {formErrors.brand_name && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.brand_name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mb-3 d-flex flex-column">
                      <label className="form-label">
                        Years of usage (If Applicable)
                      </label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="years_of_usage"
                        value={values.years_of_usage}
                        onChange={handleChange}
                      />
                      {formErrors.years_of_usage && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.years_of_usage}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column mb-3">
                      <label className="form-label">
                        No. of Owners (If Applicable)
                      </label>
                      <input
                        type="number"
                        className="form-control formControlInput"
                        name="owners_count"
                        value={values.owners_count}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                      />
                      {formErrors.owners_count && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.owners_count}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column mb-3">
                      <label className="form-label">Set a Price</label>
                      <input
                        type="number"
                        className="form-control formControlInput"
                        name="product_price"
                        value={values.product_price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                      />
                      {formErrors.product_price && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.product_price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control formControlInput"
                        name="product_name"
                        value={values.product_name}
                        onChange={handleChange}
                      />
                      <span
                        className="text-start mt-2"
                        style={{ fontSize: "13px", color: "#A1A5B7" }}
                      >
                        Mention the key features of your item.
                      </span>
                      {formErrors.product_name && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.product_name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        type="textarea"
                        className="form-control formControlInput"
                        name="product_description"
                        value={values.product_description}
                        onChange={handleChange}
                        maxLength={400}
                      />
                      <span
                        className="text-start mt-2"
                        style={{ fontSize: "13px", color: "#A1A5B7" }}
                      >
                        Please give detailed description.Include condition,
                        features.
                      </span>
                      {formErrors.product_description && (
                        <div className="w-100 text-start">
                          <span
                            className="text-danger mx-1"
                            style={{ fontSize: "12px" }}
                          >
                            {formErrors.product_description}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-column mb-3">
                      <label className="form-label">Upload Photos</label>
                      <input
                        multiple
                        ref={inputRef}
                        style={{ display: "none" }}
                        accept="image/png,image/jpg,image/jpeg"
                        type="file"
                        className="form-control formControlInput"
                        name="invoice"
                        onChange={(e) => handleImageChange(e.target.files)}
                      />
                      <div
                        className="multiImagesDiv d-flex p-3"
                        onClick={handleImagesClick}
                      >
                        {productImgPreview.length === 0 ? (
                          <>
                            <RiFileUploadLine size={60} color="#009ef7" />
                            <div className="d-flex flex-column ms-4 mt-3">
                              <span
                                style={{
                                  fontSize: "16px",
                                  color: "#181C32",
                                  fontWeight: 600,
                                }}
                              >
                                Click to upload product images.
                              </span>
                              <span
                                style={{ fontSize: "13px", color: "#B5B5C3" }}
                              >
                                Upload upto 5 files.
                              </span>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        <div>
                          {productImgPreview.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${index}`}
                              className="mx-2 mt-2"
                            />
                          ))}
                        </div>
                      </div>
                      <span
                        className="text-start mt-2"
                        style={{ fontSize: "13px", color: "#A1A5B7" }}
                      >
                        Only *.png, *.jpg and *.jpeg image files are accepted.
                      </span>
                      {formErrors.product_images && (
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.product_images}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                "Something went wrong!"
              )}
            </div>
            <div className="modalFooter p-4 border-top">
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
                  {loading ? <Loader /> : "Save Changes"}
                </Button>
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
