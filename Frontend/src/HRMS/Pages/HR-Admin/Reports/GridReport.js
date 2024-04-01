import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Replay } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as BaseSelect } from "@mui/material";
import { MdOutlineFileUpload } from "react-icons/md";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { InsertInvitation } from "@mui/icons-material";
import Select from "react-select";
import { ReportsGrid } from "../../../Components/Reports/GridReports/ReportsGrid";
import axios from "axios";
import { BASE_URL } from "../../../../Config/BaseUrl";
import { Api } from "../../../../Config/API";
import { CSVLink } from "react-csv";
import moment from "moment";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { AnalyticsContext } from "../../../../Context/CreateContext";

export const GridReport = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {
    filter,
    setFilter,
    reportDates,
    setReportDates,
    handleReportsDateChange,
    handleChange,
  } = useContext(AnalyticsContext);

  const today = new Date().toISOString().split("T")[0];
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [hrStatus, setHrStatus] = useState([]);
  const [finalStatus, setFinalStatus] = useState([]);
  const [interviewRounds, setInterviewRounds] = useState([]);
  const [assignedOwners, setAssignedOwners] = useState([]);
  const [resumeSource, setResumeSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleSnackbar = () => setSnackbar(false);

  const handleSelectChange = (selectedOptions) => {
    setSelectedColumns(selectedOptions.map((option) => option.value));
  };

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "dashboard/getActiveApplications", {
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
            setErrorMsg(false);
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

    let api = new Api();

    api.getAssignedOwner(token).then((res) => {
      setAssignedOwners(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });

    api.getColumns(token).then((res) => {
      const options = res.data.data?.map((column) => ({
        value: column.key,
        label: column.alias,
      }));
      setColumns(options);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });

    api.getFinalStatus(token).then((res) => {
      setFinalStatus(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });

    api.getHrStatus(token).then((res) => {
      setHrStatus(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });

    api.getInterviewRound(token).then((res) => {
      setInterviewRounds(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });

    api.getSources(token).then((res) => {
      setResumeSource(res.data.data);
      if (res.error?.response.status === 401) {
        setTimeout(() => {
          navigate("/adms");
          localStorage.clear();
        }, 2000);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fromDate = reportDates[0] ? new Date(reportDates[0]) : null;
    const toDate = reportDates[1] ? new Date(reportDates[1]) : null;
    fromDate?.setHours(0, 0, 0, 0);

    const result = data?.filter((item) => {
      const appliedDate = new Date(item.applied_date);

      return (
        (fromDate === null || appliedDate >= fromDate) &&
        (toDate === null || appliedDate <= toDate) &&
        (filter.hrStatus === "" || item.status_hr === filter.hrStatus) &&
        (filter.finalStatus === "" ||
          item.final_status === filter.finalStatus) &&
        (filter.interviewRound === "" ||
          item.interview_round === filter.interviewRound) &&
        (filter.assignedOwner === "" ||
          item.owner_name === filter.assignedOwner) &&
        (filter.resumeSource === "" ||
          item.resume_source === filter.resumeSource ||
          (filter.resumeSource === "Others" &&
            item.resume_source !== "Career Page" &&
            item.resume_source !== "Naukri" &&
            item.resume_source !== "LinkedIn" &&
            item.resume_source !== "Referral" &&
            item.resume_source !== "Not Mentioned"))
      );
    });
    setFilterData(result);
    // eslint-disable-next-line
  }, [reportDates, filter]);

  const headers = [
    { label: "Name", key: "candidate_name" },
    { label: "Email", key: "email" },
    { label: "Contact", key: "contact" },
    { label: "Applied Date", key: "applied_date" },
    { label: "Source of Resume", key: "resume_source" },
    { label: "Designation", key: "designation" },
    { label: "Relevant IT Experience", key: "relevant_it_experience" },
    { label: "Current Location", key: "current_location" },
    { label: "Permanent Location", key: "permanent_place" },
    { label: "Current Organization", key: "current_organisation" },
    { label: "Notice Period", key: "notice_period" },
    { label: "Reason for Job Change", key: "reason_for_job_change" },
    { label: "Relocate to Ahmedabad ?", key: "relocate_to_ahmedabad" },
    { label: "Relocate Location", key: "relocate_location" },
    { label: "Has Other Offer on Hand ?", key: "other_offer_on_hand" },
    { label: "LinkedIn Profile", key: "candidate_linkedin" },
    { label: "Resume", key: "candidate_resume" },
    { label: "1st Reference Name", key: "reference1_name" },
    { label: "1st Reference Contact", key: "reference1_contact" },
    { label: "2nd Reference Name", key: "reference2_name" },
    { label: "2nd Reference Contact", key: "reference2_contact" },
    { label: "HR Status", key: "status_hr" },
    { label: "Interview Round", key: "interview_round" },
    { label: "Final Status", key: "final_status" },
    { label: "Other Rejected Reason", key: "other_reason" },
    { label: "Interviewer", key: "interviewer_name" },
    { label: "Interview Date", key: "interview_date" },
    { label: "Interview Time", key: "interview_time" },
    { label: "Interview Feedback", key: "interview_feedback" },
    { label: "Eligible for Next Round ?", key: "eligible_for_next_round" },
    { label: "Joining Date", key: "joinig_date" },
    { label: "Assigned Owner", key: "owner_name" },
    { label: "HR Remarks", key: "remarks_hr" },
    { label: "Referred By", key: "referred_by" },
    { label: "Referral Email", key: "referral_email" },
    { label: "Last Updated By", key: "modified_by" },
    { label: "Last Updated Date", key: "modified_date" },
  ];

  const formatData = filterData?.map((row) => ({
    ...row,
    applied_date: moment(new Date(row.applied_date)).format("DD/MM/YYYY"),
    contact: `=""${row.contact}""`,
    reference1_contact: `=""${row.reference1_contact}""`,
    reference2_contact: `=""${row.reference2_contact}""`,
    joinig_date: moment(new Date(row.joinig_date)).format("DD/MM/YYYY"),
    modified_date: moment(new Date(row.modified_date)).format("DD/MM/YYYY"),
    relocate_to_ahmedabad:
      row.relocate_to_ahmedabad === true
        ? "Yes"
        : row.relocate_to_ahmedabad === false
        ? "No"
        : "",
    other_offer_on_hand:
      row.other_offer_on_hand === true
        ? "Yes"
        : row.other_offer_on_hand === false
        ? "No"
        : "",
    eligible_for_next_round:
      row.eligible_for_next_round === true
        ? "Yes"
        : row.eligible_for_next_round === false
        ? "No"
        : "",
  }));
  return (
    <div className="d-flex justify-content-center  align-items-center ">
      {data.length > 0 ? (
        <div className="card p-3 w-100 mt-3">
          <div className="reportsHeader d-flex justify-content-xxl-between flex-xxl-row  flex-column">
            <div className="d-flex col-12 col-xxl-8 flex-lg-row flex-column">
              <div className="d-flex">
                <Select
                  isMulti
                  className="outlinedDropdown multiSelectDp"
                  options={columns}
                  value={columns.filter((col) =>
                    selectedColumns.includes(col.value)
                  )}
                  onChange={handleSelectChange}
                  styles={{ width: "120px" }}
                />
                <FormControl className="ms-2" sx={{ maxWidth: 100 }}>
                  <BaseSelect
                    className="outlinedDropdown"
                    name="hrStatus"
                    value={filter.hrStatus}
                    onChange={handleChange}
                    displayEmpty
                    style={{ borderRadius: "0.4rem" }}
                  >
                    <MenuItem value="" disabled>
                      HR Status
                    </MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    {hrStatus?.length > 0 &&
                      hrStatus.map((i, index) => {
                        return (
                          <MenuItem value={i.value} key={index}>
                            {i.name}
                          </MenuItem>
                        );
                      })}
                  </BaseSelect>
                </FormControl>
                <FormControl className="ms-2" sx={{ maxWidth: 120 }}>
                  <BaseSelect
                    className="outlinedDropdown"
                    name="interviewRound"
                    value={filter.interviewRound}
                    onChange={handleChange}
                    displayEmpty
                    style={{ borderRadius: "0.4rem" }}
                  >
                    <MenuItem value="" disabled>
                      Interview Round
                    </MenuItem>
                    <MenuItem value="Applied">Applied</MenuItem>
                    <MenuItem value="Manual Applied">Manual Applied</MenuItem>
                    {interviewRounds?.length > 0 &&
                      interviewRounds.map((i, index) => {
                        return (
                          <MenuItem value={i.value} key={index}>
                            {i.name}
                          </MenuItem>
                        );
                      })}
                  </BaseSelect>
                </FormControl>
              </div>
              <div className="d-flex ms-0 ms-lg-2 mt-2 mt-lg-0">
                <FormControl sx={{ maxWidth: 120 }}>
                  <BaseSelect
                    className="outlinedDropdown"
                    name="finalStatus"
                    value={filter.finalStatus}
                    onChange={handleChange}
                    displayEmpty
                    style={{ borderRadius: "0.4rem" }}
                  >
                    <MenuItem value="" disabled>
                      Final Status
                    </MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    {finalStatus?.length > 0 &&
                      finalStatus.map((i, index) => {
                        return (
                          <MenuItem value={i.value} key={index}>
                            {i.name}
                          </MenuItem>
                        );
                      })}
                  </BaseSelect>
                </FormControl>

                <FormControl className="ms-2" sx={{ maxWidth: 120 }}>
                  <BaseSelect
                    className="outlinedDropdown"
                    name="assignedOwner"
                    value={filter.assignedOwner}
                    onChange={handleChange}
                    displayEmpty
                    style={{ borderRadius: "0.4rem" }}
                  >
                    <MenuItem value="" disabled>
                      Assigned Owner
                    </MenuItem>
                    {assignedOwners?.length > 0 &&
                      assignedOwners.map((i, index) => {
                        return (
                          <MenuItem value={i.email} key={index}>
                            {i.name}
                          </MenuItem>
                        );
                      })}
                  </BaseSelect>
                </FormControl>
                <FormControl className="ms-2" sx={{ maxWidth: 120 }}>
                  <BaseSelect
                    className="outlinedDropdown"
                    name="resumeSource"
                    value={filter.resumeSource}
                    onChange={handleChange}
                    displayEmpty
                    style={{ borderRadius: "0.4rem" }}
                  >
                    <MenuItem value="" disabled>
                      Source of Resume
                    </MenuItem>
                    {resumeSource?.length > 0 &&
                      resumeSource.map((i, index) => {
                        return (
                          <MenuItem value={i.value} key={index}>
                            {i.name}
                          </MenuItem>
                        );
                      })}
                  </BaseSelect>
                </FormControl>
              </div>
            </div>
            <div className="d-flex col-12 col-xxl-4 d-flex justify-content-xxl-end mt-2 mt-xxl-0">
              <DatePicker
                range
                rangeHover
                plugins={[<DatePanel />]}
                value={reportDates}
                onChange={handleReportsDateChange}
                render={(value, openCalendar) => {
                  return (
                    <Button
                      onClick={openCalendar}
                      variant="outlined"
                      className="headerButton "
                      endIcon={<InsertInvitation sx={{ height: 15 }} />}
                    >
                      Date Picker
                    </Button>
                  );
                }}
              />
              <CSVLink
                data={formatData}
                filename={"Intranet Applications - " + today}
                className="link"
                headers={headers.filter(
                  (header) =>
                    selectedColumns.length === 0 ||
                    selectedColumns.includes(header.key)
                )}
              >
                <Button
                  variant="contained"
                  className="headerButton ms-2"
                  endIcon={<MdOutlineFileUpload />}
                >
                  Export
                </Button>
              </CSVLink>
              <Button
                variant="contained"
                className="headerButton ms-2"
                sx={{ width: "38px" }}
                onClick={() => {
                  getData();
                  setFilter({
                    hrStatus: "",
                    finalStatus: "",
                    interviewRound: "",
                    assignedOwner: "",
                    resumeSource: "",
                  });
                  setSelectedColumns([]);
                  setReportDates([]);
                }}
              >
                <Replay />
              </Button>
            </div>
          </div>
          <ReportsGrid data={filterData} />
        </div>
      ) : (
        <div className="card w-50 p-5 mt-5 norequestCompo d-flex  align-items-center  justify-content-center flex-column">
          <span className="fw-bold">Data not found!</span>
          <span
            className="fw-bold mt-3"
            style={{ fontSize: "13px", color: "#4E5F77" }}
          >
            There are no applications to show here right now!
          </span>
        </div>
      )}
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
