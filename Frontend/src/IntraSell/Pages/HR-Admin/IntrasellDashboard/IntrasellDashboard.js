import React, { useContext } from "react";
import "./IntrasellDashboard.css";
import { SidebarContext } from "../../../../Context/CreateContext";
import { Sidebar } from "../../../Components/Sidebar/Sidebar";
import { AdminHeader } from "../../../Components/AdminHeader/AdminHeader";
import { BuyerSellerChart } from "../../../Components/Dashboard/BuyerSellerChart";
import { CategoryCountChart } from "../../../Components/Dashboard/CategoryCountChart";
import { RequestsGrid } from "../../../Components/Dashboard/RequestsGrid";

export const IntrasellDashboard = () => {
  const { intrasellNavVisible } = useContext(SidebarContext);
  return (
    <div className="maincontainer">
      <Sidebar />
      <AdminHeader />
      <div
        className={
          !intrasellNavVisible
            ? "page page-without-navbar"
            : "page page-with-navbar"
        }
      >
        <div className="dashboard d-flex align-items-center  justify-content-center flex-column  p-4 mt-5 mt-lg-0 w-100">
          <div className="d-flex flex-lg-row flex-column w-100">
            <BuyerSellerChart />
            <CategoryCountChart />
          </div>
          <RequestsGrid />
        </div>
      </div>
    </div>
  );
};
