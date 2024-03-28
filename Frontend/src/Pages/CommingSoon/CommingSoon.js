import React from "react";
import "./CommingSoon.css";
import logo from "../../Assets/Logo/Logo.svg";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const CommingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="coomingSoon">
      <div className="mt-5">
        <img src={logo} alt="logo" height={50} />
      </div>
      <div className="coomingSoonText mt-5 d-flex align-items-center justify-content-center flex-column">
        <h2 className="fw-bold">Cooming Soon!</h2>
        <Button
          onClick={() => navigate("/home")}
          className="generalButton mt-5"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};
