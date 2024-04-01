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

export const HeadCountsByFinalStatus = ({ chartData }) => {
  const options = {
    responsive: true,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const data = {
    labels: chartData?.map((item) => item.final_status),
    datasets: [
      {
        label: "Application",
        data: chartData?.map((item) => item.count),
        borderColor: "#4E5F77",
        backgroundColor: "#E7ECF3",
        // backgroundColor: "#E5FCF2",
      },
    ],
  };

  return (
    <div className="card p-3 col-lg-7 col-12 d-flex justify-content-start  align-items-center ms-0 ms-lg-2 mt-3 mt-lg-0">
      <div className="d-flex justify-content-md-between flex-md-row flex-column  align-items-center  w-100 mb-5">
        <span className="fw-bold text-muted " style={{ fontSize: "13px" }}>
          Headcounts by Final Status
        </span>
      </div>
      <Bar options={options} data={data} />
    </div>
  );
};
