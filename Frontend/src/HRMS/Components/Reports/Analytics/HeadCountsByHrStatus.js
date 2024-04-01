import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const HeadCountsByHrStatus = ({ chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
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
      </div>
      <Doughnut data={data} options={options} />
    </div>
  );
};
