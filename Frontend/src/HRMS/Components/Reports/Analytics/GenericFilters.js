import React, { useState, useEffect, useContext } from "react";
import { AnalyticsContext } from "../../../../Context/CreateContext";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as BaseSelect } from "@mui/material";
import { Api } from "../../../../Config/API";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { InsertInvitation } from "@mui/icons-material";
import { Button } from "@mui/material";

export const GenericFilters = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { values, handleChange, handleDateChange } =
    useContext(AnalyticsContext);

  const [hrStatus, setHrStatus] = useState([]);
  const [finalStatus, setFinalStatus] = useState([]);
  const [interviewRounds, setInterviewRounds] = useState([]);
  const [assignedOwners, setAssignedOwners] = useState([]);
  const [resumeSource, setResumeSource] = useState([]);

  useEffect(() => {
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

  return (
    <div>
      <div className="analyticsHeader mt-3 w-100 p-3 card ">
        <div className="d-flex align-items-start align-items-md-center   justify-content-start flex-md-row flex-column ">
          <FormControl className="col">
            <BaseSelect
              className="outlinedDropdown"
              name="status_hr"
              value={values.status_hr}
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
          <FormControl className="ms-0 ms-md-2 mt-2 mt-md-0 col">
            <BaseSelect
              className="outlinedDropdown"
              name="interview_round"
              value={values.interview_round}
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
          <FormControl className="ms-0 ms-md-2 mt-2 mt-md-0 col">
            <BaseSelect
              className="outlinedDropdown"
              name="final_status"
              value={values.final_status}
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
          <FormControl className="ms-0 ms-md-2 mt-2 mt-md-0 col">
            <BaseSelect
              className="outlinedDropdown"
              name="owner_name"
              value={values.owner_name}
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
          <FormControl className="ms-0 ms-md-2 mt-2 mt-md-0 col">
            <BaseSelect
              className="outlinedDropdown"
              name="resume_source"
              value={values.resume_source}
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
              <MenuItem value="Referral">Referral</MenuItem>
            </BaseSelect>
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
                  className="headerButton ms-0 ms-md-2 mt-2 mt-md-0 col"
                  endIcon={<InsertInvitation sx={{ height: 15 }} />}
                >
                  Date Picker
                </Button>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
