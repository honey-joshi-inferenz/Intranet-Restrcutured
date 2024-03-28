import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import { MenuItem, Select } from "@mui/material";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { AnalyticsContext } from "../../../../Context/CreateContext";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const HeadCountsBySource = ({ chartData }) => {
  const { durations, handleDuration } = useContext(AnalyticsContext);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },

      // title: {
      //   display: true,
      //   text: "Headcount by Resume Source",
      // },
    },
  };

  const data = {
    labels: chartData?.map((item) => item.resume_source),
    datasets: [
      {
        label: "Application",
        data: chartData?.map((item) => item.count),
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="card p-3 col-lg-4 col-12 d-flex justify-content-start  align-items-center ms-0 ms-lg-2 mt-3 mt-lg-0">
      <div className="d-flex justify-content-md-between flex-md-row flex-column  align-items-center w-100 mb-3">
        <span className="fw-bold text-muted " style={{ fontSize: "13px" }}>
          Headcounts by Resume Source
        </span>
        <FormControl variant="standard">
          <Select
            name="resumeSource"
            value={durations.resumeSource}
            onChange={handleDuration}
          >
            <MenuItem value={0} selected>
              All
            </MenuItem>
            <MenuItem value={7}>7 days</MenuItem>
            <MenuItem value={30}>30 days</MenuItem>
            <MenuItem value={60}>60 days</MenuItem>
            <MenuItem value={90}>90 days</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Radar data={data} options={options} />
    </div>
  );
};
