import React, { useState } from "react";
import { RecruiterDashboardContext } from "../CreateContext";

export const RecruiterDashboardProvider = ({ children }) => {
  const [myInterviews, setMyInterviews] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [card, setCard] = useState(
    parseInt(localStorage.getItem("selectedCard"))
      ? parseInt(localStorage.getItem("selectedCard"))
      : 1
  );
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  return (
    <RecruiterDashboardContext.Provider
      value={{
        myInterviews,
        setMyInterviews,
        statistics,
        setStatistics,
        card,
        setCard,
        title,
        setTitle,
        data,
        setData,
        filteredData,
        setFilteredData,
      }}
    >
      {children}
    </RecruiterDashboardContext.Provider>
  );
};
