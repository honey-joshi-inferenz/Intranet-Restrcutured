import React, { useEffect } from "react";
import "./AddPost.css";
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

export const AddPost = ({ open, handleClose, getData }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const inputRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [values, setValues] = useState({
    brand: "",
    yearOfUsage: "",
    noOfOwner: "",
    title: "",
    price: "",
    category: "",
    subCategory: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    brand: "",
    title: "",
    price: "",
    category: "",
    subCategory: "",
    description: "",
    images: "",
    thumbnail: "",
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
    if (img) {
      setPreviewImage(URL.createObjectURL(img));
    }
  };

  const handleImageChange = (event) => {
    const imgArray = [];
    const fileList = event.target.files;
    const imagesArray = Array.from(fileList).map((file) =>
      URL.createObjectURL(file)
    );

    Array.from(fileList).forEach((file) => {
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
      if (res?.error?.response.status === 401) {
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

  const getSubCategories = async (id) => {
    try {
      let api = new Api(id);
      api.getSubCategories(id, token).then((res) => {
        setSubCategories(res.data.data);
        if (res?.error?.response.status === 401) {
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
      errors.images = "Please upload product images.";
    } else if (file?.length > 5) {
      errors.images = "Upload upto 5 images.";
    }

    if (thumbnail === null) {
      errors.thumbnail = "Please select thumbnail image.";
    } else if (!thumbnail.name.match(/\.(jpg|jpeg|png)$/)) {
      errors.thumbnail = "Please select valid image";
    }

    if (formValues.brand?.trim().length === 0) {
      errors.brand = "Please add Brand/Company of the product.";
    }

    if (formValues.title?.trim().length === 0) {
      errors.title = "Please add title of post.";
    }
    if (formValues.price?.trim().length === 0) {
      errors.price = "Please add price of product.";
    }
    if (formValues.category === "") {
      errors.category = "Please select the category of product.";
    }
    if (formValues.subCategory === "") {
      errors.subCategory = "Please select the subcategory of product.";
    }
    if (formValues.description?.trim().length === 0) {
      errors.description = "Description of product is required.";
    } else if (formValues.description.length > 400) {
      errors.description =
        "Please add your description in 400 characters or less.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(values, productImages, file);
    setFormErrors(errors);

    const formData = new FormData();
    formData.append("category_id", values.category);
    formData.append("subcategory_id", values.subCategory);
    formData.append("account_id", userId);
    formData.append("product_name", values.title);
    formData.append("product_description", values.description);
    formData.append("product_price", values.price);
    formData.append("price_currency", "INR");
    formData.append("brand_name", values.brand);
    formData.append("years_of_usage", values.yearOfUsage);
    formData.append("owners_count", values.noOfOwner);
    formData.append("thumbnail_image", file);
    for (let i = 0; i < productImages.length; i++) {
      formData.append("product_images", productImages[i]);
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await axios
          .post(BASE_URL + "intraSell/productDetails/addNewProduct", formData, {
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
      brand: "",
      yearOfUsage: "",
      noOfOwner: "",
      title: "",
      price: "",
      category: "",
      subCategory: "",
      description: "",
    });
    setFormErrors({
      brand: "",
      title: "",
      price: "",
      category: "",
      subCategory: "",
      description: "",
      images: "",
    });
    setProductImgPreview([]);
    setProductImages([]);
    setPreviewImage(null);
    hiddenFileInput.current.value = null;
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
                className="fw-bold  text-start w-100"
                style={{ color: "#042049" }}
              >
                Add Post
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
                    {formErrors.thumbnail && (
                      <div className="w-100 text-center">
                        <span
                          className="text-danger mx-1"
                          style={{ fontSize: "12px" }}
                        >
                          {formErrors.thumbnail}
                        </span>
                      </div>
                    )}
                    <span
                      className="text-start mt-2"
                      style={{ fontSize: "12px", color: "#A1A5B7" }}
                    >
                      Set the post thumbnail image. Only *.png, *.jpg and *.jpeg
                      image files are accepted.
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column mb-3">
                  <label className="form-label">Category</label>
                  <FormControl>
                    <Select
                      className="outlinedDropdown"
                      name="category"
                      value={values.category}
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
                <div className="d-flex flex-column">
                  <label className="form-label">Subcategory</label>
                  <FormControl>
                    <Select
                      className="outlinedDropdown"
                      name="subCategory"
                      value={values.subCategory}
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
                  {formErrors.subCategory && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.subCategory}
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
                    name="brand"
                    value={values.brand}
                    onChange={handleChange}
                  />
                  {formErrors.brand && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.brand}
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
                    name="yearOfUsage"
                    value={values.yearOfUsage}
                    onChange={handleChange}
                  />
                  {formErrors.yearOfUsage && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.yearOfUsage}
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
                    name="noOfOwner"
                    value={values.noOfOwner}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                  />
                  {formErrors.noOfOwner && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.noOfOwner}
                      </span>
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column mb-3">
                  <label className="form-label">Set a Price</label>
                  <input
                    type="number"
                    className="form-control formControlInput"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                  />
                  {formErrors.price && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.price}
                      </span>
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control formControlInput"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                  />
                  <span
                    className="text-start mt-2"
                    style={{ fontSize: "13px", color: "#A1A5B7" }}
                  >
                    Mention the key features of your item.
                  </span>
                  {formErrors.title && (
                    <div className="w-100 text-start">
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "12px" }}
                      >
                        {formErrors.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    type="textarea"
                    className="form-control formControlInput"
                    name="description"
                    value={values.description}
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
                <div className="d-flex flex-column mb-3">
                  <label className="form-label">Upload Photos</label>
                  <input
                    multiple
                    ref={inputRef}
                    style={{ display: "none" }}
                    accept="image/png,image/jpg"
                    type="file"
                    className="form-control formControlInput"
                    name="invoice"
                    onChange={handleImageChange}
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
                          <span style={{ fontSize: "13px", color: "#B5B5C3" }}>
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
                    .png, .jpg file only. Maximum file size is 5 MB.
                  </span>
                  {formErrors.images && (
                    <span
                      className="text-danger mx-1"
                      style={{ fontSize: "12px" }}
                    >
                      {formErrors.images}
                    </span>
                  )}
                </div>
              </div>
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
                  {loading ? <Loader /> : "Submit"}
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
