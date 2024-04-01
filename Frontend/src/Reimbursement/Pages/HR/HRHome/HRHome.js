import React, { useEffect, useState } from "react";
import { Header } from "../../../Components/Header/Header";
import { Button } from "@mui/material";
import { Replay } from "@mui/icons-material";
import { RiSearch2Line } from "react-icons/ri";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { HRRequestsGrid } from "../../../Components/HR-Reimbursement/HRRequestsGrid";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { InsertInvitation } from "@mui/icons-material";
import { MdOutlineFileUpload } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { CSVLink } from "react-csv";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const HRHome = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");

  const [filter, setFilter] = useState({ search: "", status: "" });
  const [rangeDates, setRangeDates] = useState([]);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFilter({ ...filter, [name]: value });
  };

  const handleDateChange = (dates) => {
    setRangeDates(dates);
  };

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "reimbursement/request/getAllRequests", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setData(res.data.data);
          setFilterData(res.data.data);
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
    getData();
    // eslint-disable-next-line
  }, []);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  useEffect(() => {
    const fromDate = rangeDates[0] ? new Date(rangeDates[0]) : null;
    const toDate = rangeDates[1] ? new Date(rangeDates[1]) : null;
    fromDate?.setHours(0, 0, 0, 0);

    const escapedSearch = escapeRegExp(filter.search);

    const result = data?.filter((item) => {
      const appliedDate = new Date(item.initiate_date);

      return (
        (fromDate === null || appliedDate >= fromDate) &&
        (toDate === null || appliedDate <= toDate) &&
        (filter.status === "" || item.status === filter.status) &&
        (filter.search === "" ||
          item.name.toLowerCase().match(new RegExp(escapedSearch, "i")) ||
          item.paymentMode
            .toLowerCase()
            .match(new RegExp(escapedSearch, "i")) ||
          item.emp_code.toLowerCase().match(new RegExp(escapedSearch, "i")))
      );
    });
    setFilterData(result);
    // eslint-disable-next-line
  }, [filter, rangeDates]);

  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Employee Code", key: "emp_code" },
    { label: "Department", key: "dept_name" },
    { label: "Paid Amount", key: "paid_amount" },
    { label: "Payment Mode", key: "paymentMode" },
    { label: "Purpose of Expenditure", key: "purpose_of_expenditure" },
    { label: "Expenditure Category", key: "expenditure_category" },
    { label: "Date of Expense", key: "date_of_expense" },
    { label: "Initiated Date", key: "initiate_date" },
    { label: "Employee Status", key: "employee_status" },
    { label: "HR Status", key: "status" },
    { label: "Final Status", key: "final_status" },
    { label: "On Hold Reason of HR", key: "hr_reason_onhold" },
    { label: "Reject Reason of HR", key: "hr_reason_reject" },
    { label: "On Hold Reason of Admin", key: "admin_reason_onhold" },
    { label: "Reject Reason of Admin", key: "admin_reason_reject" },
    { label: "HR Approved By", key: "hr_approved_by" },
    { label: "HR Approved Date", key: "hr_approved_date" },
    { label: "Admin Approved By", key: "admin_approved_by" },
    { label: "Admin Approved Date", key: "admin_approved_date" },
    { label: "Invoice", key: "invoice" },
  ];

  const formatData = filterData?.map((row) => ({
    ...row,
    initiate_date: moment(new Date(row.initiate_date)).format("DD/MM/YYYY"),
    admin_approved_date:
      row.admin_approved_date === "Pending"
        ? "Pending"
        : moment(new Date(row.admin_approved_date)).format("DD/MM/YYYY"),
    hr_approved_date:
      row.hr_approved_date === "Pending"
        ? "Pending"
        : moment(new Date(row.hr_approved_date)).format("DD/MM/YYYY"),
    date_of_expense: moment(new Date(row.date_of_expense)).format("DD/MM/YYYY"),
    paid_amount:
      "₹ " +
      Number(row.paid_amount).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
  }));

  return (
    <div className="hrHome w-100 d-flex flex-column">
      <Header />
      <div className="pt-3 w-100 mt-5  d-flex align-items-center justify-content-center container flex-column ">
        <h4
          className="fw-bold text-start w-100 mt-4"
          style={{ color: "#042049" }}
        >
          Latest Requests
        </h4>
        <div className="d-flex justify-content-center  align-items-center flex-column w-100">
          {data?.length > 0 ? (
            <div className="hrHomeCompo w-100 card p-3 mt-3">
              <div className="d-flex justify-content-xl-between flex-xl-row flex-column w-100">
                <div className="input-group mb-3" style={{ width: "15rem" }}>
                  <span className="input-group-text searchIcon">
                    <RiSearch2Line />
                  </span>
                  <input
                    type="text"
                    className="form-control formControlInput"
                    placeholder="Search"
                    name="search"
                    value={filter.search}
                    onChange={handleChange}
                    style={{ height: "38px" }}
                  />
                </div>
                <div className="ms-0 ms-md-3 d-flex ">
                  <FormControl sx={{ minWidth: 120, border: "none" }}>
                    <Select
                      name="status"
                      value={filter.status}
                      onChange={handleChange}
                      displayEmpty
                      className="outlinedDropdown"
                      notched
                    >
                      <MenuItem value="" disabled>
                        Status
                      </MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="On Hold">On Hold</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  <DatePicker
                    range
                    rangeHover
                    plugins={[<DatePanel />]}
                    onChange={handleDateChange}
                    render={(value, openCalendar) => {
                      return (
                        <Button
                          onClick={openCalendar}
                          variant="outlined"
                          className="headerButton ms-3"
                          endIcon={<InsertInvitation sx={{ height: 15 }} />}
                        >
                          Date Picker
                        </Button>
                      );
                    }}
                  />
                  <CSVLink
                    data={formatData}
                    filename={"Intranet Reimbursement - " + today}
                    className="link"
                    headers={headers}
                  >
                    <Button
                      variant="contained"
                      className="headerButton ms-3"
                      endIcon={<MdOutlineFileUpload />}
                    >
                      Export
                    </Button>
                  </CSVLink>
                  <Button
                    variant="contained"
                    className="headerButton ms-3"
                    sx={{ width: "38px" }}
                    onClick={() => {
                      getData();
                      setFilter({ search: "", status: "" });
                      setRangeDates([]);
                    }}
                  >
                    <Replay />
                  </Button>
                </div>
              </div>
              <div className="viewRequestTable mt-4">
                <HRRequestsGrid data={filterData} />
              </div>
            </div>
          ) : (
            <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
              <span className="fw-bold">Data not found!</span>
              <span
                className="fw-bold mt-3"
                style={{ fontSize: "13px", color: "#4E5F77" }}
              >
                There are no requests for reimbursement to show here right now!
              </span>
            </div>
          )}
        </div>
      </div>
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
