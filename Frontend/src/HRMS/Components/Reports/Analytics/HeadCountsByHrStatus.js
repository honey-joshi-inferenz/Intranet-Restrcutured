import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import { MenuItem, Select } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { AnalyticsContext } from "../../../../Context/CreateContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export const HeadCountsByHrStatus = ({ chartData }) => {
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
    labels: chartData?.map((item) => item.status_hr),
    datasets: [
      {
        data: chartData?.map((item) => item.count),
        backgroundColor: [
          "#117AE0",
          "#FF4774",
          "#09449E",
          "#FFC400",
          "#042049",
          "#114FFF",
          "#4E5F77",
          "#5AE4A7",
        ],
        borderColor: [
          "#117AE0",
          "#FF4774",
          "#09449E",
          "#FFC400",
          "#042049",
          "#114FFF",
          "#4E5F77",
          "#5AE4A7",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card p-3 col-lg-4 col-12 d-flex justify-content-start  align-items-center">
      <div className="d-flex justify-content-md-between flex-md-row flex-column  align-items-center w-100 mb-3">
        <span className="fw-bold text-muted " style={{ fontSize: "13px" }}>
          Headcounts by HR Status
        </span>
        <FormControl variant="standard">
          <Select
            name="hrStatus"
            value={durations.hrStatus}
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
      <Doughnut data={data} options={options} />
    </div>
  );
};
