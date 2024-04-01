import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const HeadCountsByPosition = ({ chartData }) => {
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
      </div>
      <Bar options={options} data={data} />
    </div>
  );
};
