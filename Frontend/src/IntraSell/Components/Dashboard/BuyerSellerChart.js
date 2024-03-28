import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { BASE_URL } from "../../../Config/BaseUrl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const BuyerSellerChart = () => {
  const token = localStorage.getItem("token");
  const [chartData, setChartData] = useState([]);

  const getData = async () => {
    try {
      await axios
        .get(BASE_URL + "intraSell/dashboard/getWeeklyBuyersSellersCount", {
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
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      //   title: {
      //     display: true,
      //     text: "Chart.js Line Chart - Multi Axis",
      //   },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const data = {
    labels: chartData?.map((item) => item.day),
    datasets: [
      {
        label: "Sellers",
        data: chartData?.map((item) => item.sellerCount),
        borderColor: "#09449E",
        backgroundColor: "#90B8F4",
        yAxisID: "y1",
      },
      {
        label: "Buyers",
        data: chartData?.map((item) => item.buyerCount),
        borderColor: "#FFC400",
        backgroundColor: "#FFF0BD",
        yAxisID: "y",
      },
    ],
  };
  return (
    <div className="card p-3 col-12 col-lg-6 d-flex align-items-center  justify-content-center  flex-column ">
      <span
        className="fw-bold text-muted mb-3 w-100 text-start "
        style={{ fontSize: "13px" }}
      >
        Weekly Buyer/Seller Counts
      </span>
      <Line options={options} data={data} />
    </div>
  );
};
