import React, { useContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import FormControl from "@mui/material/FormControl";
import { MenuItem, Select } from "@mui/material";
import { AnalyticsContext } from "../../../../Context/CreateContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const HeadCountsByPosition = ({ chartData }) => {
  const { durations, handleDuration } = useContext(AnalyticsContext);

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      // title: {
      //   display: true,
      //   text: "Headcount by Position",
      // },
    },
  };

  const data = {
    labels: chartData?.map((item) => item.designation),
    datasets: [
      {
        data: chartData?.map((item) => item.count),
        backgroundColor: "#2B6EB4",
        borderColor: "#2B6EB4",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card p-3 col-lg-8 col-12 d-flex justify-content-start  align-items-center ms-0 ms-lg-2 mt-3 mt-lg-0">
      <div className="d-flex justify-content-md-between flex-md-row flex-column  align-items-center w-100 mb-3">
        <span className="fw-bold text-muted " style={{ fontSize: "13px" }}>
          Headcounts by Position
        </span>
        <FormControl variant="standard">
          <Select
            name="position"
            value={durations.position}
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
      <Bar options={options} data={data} />
    </div>
  );
};
