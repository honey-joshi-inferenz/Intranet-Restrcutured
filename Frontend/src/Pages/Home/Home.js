import React from "react";
import "./Home.css";
import maskImg from "../../Assets/Images/Full side Image.png";
import logo from "../../Assets/Logo/Logo.svg";
import subtract from "../../Assets/Images/Subtract.svg";
import { Home4CardLayout } from "../../Components/Home/Home4CardLayout";
import { Home3CardLayout } from "../../Components/Home/Home3CardLayout";

export const Home = () => {
  const role = localStorage.getItem("role");
  return (
    <div>
      <div className="mt-3 w-100  d-flex align-items-center  justify-content-between ">
        <div className="homeHeader d-flex flex-row w-100">
          <div className="col-2 ">
            <img
              src={logo}
              alt="homeHeader"
              className="homeHeaderLogo ms-2 ms-lg-0"
            />
          </div>
          <div className="d-flex col-10 align-items-center">
            <img src={subtract} alt="homeHeader" className="ms-4" />
            <div className="headerLine rounded w-100" />
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row mt-3 p-3 homeComponent">
        <div className="col-md-4  homeLeftCard card text-start">
          <div className="d-none d-md-block">
            <img alt="homeLeftimg" src={maskImg} className="w-100" />
          </div>
          <div className="position-absolute ps-4 welcomeTag">
            <span>Welcome</span>
            <p>To the All in One HR Solution</p>
          </div>
        </div>
        <div className="col-md-8  mt-0 p-3">
          {(role === "Admin" ||
            role === "HR" ||
            role === "Interviewer" ||
            role === "Accounts") && <Home4CardLayout />}
          {role === "Employee" && <Home3CardLayout />}
        </div>
      </div>
    </div>
  );
};
