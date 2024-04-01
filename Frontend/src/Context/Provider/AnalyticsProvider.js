import React, { useState } from "react";
import { AnalyticsContext } from "../CreateContext";

export const AnalyticsProvider = ({ children }) => {
  const [values, setValues] = useState({
    status_hr: "",
    interview_round: "",
    final_status: "",
    owner_name: "",
    resume_source: "",
  });
  const [rangeDates, setRangeDates] = useState([]);
  const [durations, setDurations] = useState({
    monthly: 0,
  });
  const [filter, setFilter] = useState({
    hrStatus: "",
    finalStatus: "",
    interviewRound: "",
    assignedOwner: "",
    resumeSource: "",
  });
  const [reportDates, setReportDates] = useState([]);

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
    setFilter({ ...filter, [name]: value });
  };

  const handleDuration = (e) => {
    const { name, value } = e.target;
    setDurations({ ...durations, [name]: value });
  };

  const handleDateChange = (dates) => {
    setRangeDates(dates);
  };

  const handleReportsDateChange = (dates) => {
    setReportDates(dates);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        values,
        setValues,
        handleChange,
        rangeDates,
        setRangeDates,
        handleDateChange,
        durations,
        setDurations,
        handleDuration,
        filter,
        setFilter,
        reportDates,
        setReportDates,
        handleReportsDateChange,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
