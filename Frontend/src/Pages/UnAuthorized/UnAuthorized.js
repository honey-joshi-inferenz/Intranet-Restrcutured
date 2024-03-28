import React from "react";
import "./UnAuthorized.css";
import logo from "../../Assets/Logo/Logo.svg";

export const UnAuthorized = () => {
  return (
    <div className="unauthorized">
      <div className="mt-5">
        <img src={logo} alt="logo" height={50}/>
      </div>
      <div className="unauthorizedText mt-4 d-flex align-items-center justify-content-center flex-column">
        <h1 className="text-muted">401</h1>
        <h2 className="fw-bold">Unauthorized!</h2>
        <p className="text-muted">We couldn't validate your credentials.</p>
      </div>
    </div>
  );
};
