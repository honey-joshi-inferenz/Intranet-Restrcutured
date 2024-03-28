import React, { useState, useEffect, useContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { AnalyticsContext } from "../../../../Context/CreateContext";
import FormControl from "@mui/material/FormControl";
import { MenuItem, Select } from "@mui/material";
import { Api } from "../../../../Config/API";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const EveryMonthApplication = ({ chartData }) => {
  const { durations, handleDuration } = useContext(AnalyticsContext);
  const [years, setYears] = useState([]);

  useEffect(() => {
    let api = new Api();
    api.getAppliedYear().then((res) => {
      setYears(res.data.data);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        // title: {
        //   display: true,
        //   text: "Every Month Application",
        // },
      },
    },
  };

  const data = {
    labels: chartData?.map((item) => item.applied_month),
    datasets: [
      {
        label: "Application",
        data: chartData?.map((item) => item.count),
        borderColor: "#09449E",
        backgroundColor: "#09449E",
      },
    ],
  };

  return (
    <div className="card p-3 col-lg-8 col-12 d-flex justify-content-start  align-items-center">
      <div className="d-flex justify-content-md-between flex-md-row flex-column  align-items-center  w-100 mb-3">
        <span className="fw-bold text-muted " style={{ fontSize: "13px" }}>
          Headcounts by Month
        </span>
        <FormControl variant="standard">
          <Select
            name="monthly"
            value={durations.monthly}
            onChange={handleDuration}
          >
            <MenuItem value={0} selected>
              All
            </MenuItem>
            {years.length > 0 &&
              years.map((i, index) => {
                return (
                  <MenuItem value={i.year} key={index}>
                    {i.year}
                  </MenuItem>
                );
              })}
            x
          </Select>
        </FormControl>
      </div>
      <Line options={options} data={data} />
    </div>
  );
};
