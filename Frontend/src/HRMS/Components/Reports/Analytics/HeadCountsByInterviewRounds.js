import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const HeadCountsByInterviewRounds = ({ chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const data = {
    labels: chartData?.map((item) => item.interview_round),
    datasets: [
      {
        label: "Application",
        fill: true,
        data: chartData?.map((item) => item.count),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card p-3 col-lg-8 col-12 d-flex justify-content-start  align-items-center ms-0 ms-lg-2 mt-3 mt-lg-0">
      <div className="d-flex justify-content-md-between flex-md-row flex-column  align-items-center  w-100 mb-3">
        <span className="fw-bold text-muted " style={{ fontSize: "13px" }}>
          Headcounts by Interview Round
        </span>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};
