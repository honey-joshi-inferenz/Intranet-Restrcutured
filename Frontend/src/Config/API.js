import { BASE_URL } from "./BaseUrl";
import axios from "axios";

export class Api {
  //get all departments
  getDepartments = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getDepartments", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get all positions
  getPositions = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getPositions", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get roles
  getRoles = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get resume source
  getSources = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getResumeSources", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get HR Status
  getHrStatus = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getHRStatus", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get Final Status
  getFinalStatus = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getFinalStatus", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get Interview Round
  getInterviewRound = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getInterviewRounds", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get assged ower
  getAssignedOwner = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getHRDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get table columns
  getColumns = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getFilteredColumns", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get list of Interviewer
  getListOfInterviewers = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getInterviewers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get logged in user Interviews
  getMyInterviews = async (id, token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + `dashboard/getAssignedCandidates?uuid=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get logged in user Interviews' history
  getMyInterviewHistory = async (id, token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + `dashboard/getCompletedApplications?uuid=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get Candidate data by id
  getCandidateData = async (id, token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + `candidate/getCandidateById?uuid=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get my reimbursements
  getMyReimburse = async (id, token) => {
    let data = [];
    let error = null;
    await axios
      .get(
        BASE_URL + `reimbursement/request/getMyReimbursements?account_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get Reimburse modes
  getReimburseMode = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getPaymentModes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get Reimburse categories
  getReimburseCategories = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getReimburseCategories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get applied year
  getAppliedYear = async () => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "dropdown/getAppliedYear")
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get intrasell categories
  getCategories = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "intraSell/category/getActiveProductCategories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get intrasell subcategories by category id
  getSubCategories = async (id, token) => {
    let data = [];
    let error = null;
    await axios
      .get(
        BASE_URL +
          `intraSell/subCategory/getProductSubCategoriesByCategoryId?category_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get user post
  getMyPosts = async (id, token) => {
    let data = [];
    let error = null;
    await axios
      .get(
        BASE_URL + `intraSell/productDetails/getMyProducts?account_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get all user's approved post
  getApprovedPosts = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "intraSell/productDetails/getApprovedProducts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get postby id
  getPostById = async (id, token) => {
    let data = [];
    let error = null;
    await axios
      .get(
        BASE_URL + `intraSell/productDetails/getProductById?product_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };

  //get all post
  getAllPosts = async (token) => {
    let data = [];
    let error = null;
    await axios
      .get(BASE_URL + "intraSell/productDetails/getAllProducts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        error = err;
        console.log(err);
      });
    return { data, error };
  };
}
