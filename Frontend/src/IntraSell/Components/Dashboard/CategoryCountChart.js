import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const CategoryCountChart = () => {
  const token = localStorage.getItem("token");
  const [chartData, setChartData] = useState([]);

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "intraSell/dashboard/getCategoryWiseSellingCount", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setChartData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

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
      },
      //   title: {
      //     display: true,
      //     text: "Chart.js Horizontal Bar Chart",
      //   },
    },
  };

  const data = {
    labels: chartData?.map((item) => item.categoryName),
    datasets: [
      {
        label: "Count",
        data: chartData?.map((item) => item.sellerCount),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className="card p-3 col-12 col-lg-6 ms-0 ms-lg-2 mt-3 mt-lg-0">
      <span
        className="fw-bold text-muted mb-3 w-100 text-start "
        style={{ fontSize: "13px" }}
      >
        Category Counts
      </span>
      <Bar options={options} data={data} />
    </div>
  );
};
