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
    owner: 0,
    position: 0,
    monthly: 0,
    resumeSource: 0,
    hrStatus: 0,
    interviewRound: 0,
    finalStatus: 0,
  });

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const handleDuration = (e) => {
    const { name, value } = e.target;
    setDurations({ ...durations, [name]: value });
  };

  const handleDateChange = (dates) => {
    setRangeDates(dates);
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
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
