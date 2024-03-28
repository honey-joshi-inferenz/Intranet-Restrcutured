import React from "react";
import "./Styles.css";
import { Button } from "@mui/material";
import recruiter from "../../Assets/Logo/recruiter.png";
import reimbursement from "../../Assets/Logo/reimbursement.png";
import intraSell from "../../Assets/Logo/intrasell.png";
import referral from "../../Assets/Logo/referBuddy.png";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export const Home4CardLayout = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  return (
    <div className="Home4CardLayout homeViewCards">
      <div className="row row-cols-2 g-2">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-2 mb-md-5">
          <div className="recruiter p-3  position-relative switchCard w-75 d-flex  flex-row flex-xl-column">
            <div className="position-absolute homeImages">
              <img alt="recruiter" src={recruiter} className="w-100" />
            </div>
            <Button
              className="generalButton homeButton d-flex justify-content-between "
              onClick={() =>
                role === "HR" || role === "Admin"
                  ? navigate("/recruiter-dashboard")
                  : role === "Interviewer" || role === "Accounts"
                  ? navigate("/recruiter-interviews")
                  : navigate("/unauthorized")
              }
            >
              <span>Recruiter</span>
              <div className="bg-light rounded">
                <GrFormNextLink />
              </div>
            </Button>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center  mb-2 mb-md-5">
          <div className="reimbursement p-3  position-relative switchCard w-75 d-flex  flex-row flex-xl-column">
            <div className="position-absolute homeImages">
              <img alt="reimbursement" src={reimbursement} className="w-100" />
            </div>
            <Button
              className="generalButton homeButton d-flex justify-content-between "
              onClick={() =>
                role === "HR"
                  ? navigate("/reimbursement-home")
                  : role === "Admin" || role === "Accounts"
                  ? navigate("/reimbursement-dashboard")
                  : role === "Interviewer"
                  ? navigate("/reimbursement-view")
                  : navigate("/unauthorized")
              }
            >
              <span>Reimbursement</span>
              <div className="bg-light  rounded">
                <GrFormNextLink />
              </div>
            </Button>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center  mb-2 mb-md-5">
          <div className="intraSell p-3  position-relative switchCard w-75 d-flex  flex-row flex-xl-column">
            <div className="position-absolute homeImages">
              <img alt="intraSell" src={intraSell} className="w-100" />
            </div>
            <Button
              className="generalButton homeButton d-flex justify-content-between "
              onClick={() =>
                role === "HR" || role === "Admin"
                  ? navigate("/intrasell-dashboard")
                  : role === "Interviewer" || role === "Accounts"
                  ? navigate("/intrasell-myposts")
                  : navigate("/unauthorized")
              }
            >
              <span>Intrasell</span>
              <div className="bg-light  rounded">
                <GrFormNextLink />
              </div>
            </Button>
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center  mb-2 mb-md-5">
          <div className="referral p-3  position-relative switchCard w-75 d-flex  flex-row flex-xl-column">
            <div className="position-absolute homeImages">
              <img alt="referral" src={referral} height={250} />
            </div>
            <Button
              className="generalButton homeButton d-flex justify-content-between "
              onClick={() => navigate("/refer-view")}
            >
              <span>Refer a Buddy</span>
              <div className="bg-light  rounded">
                <GrFormNextLink />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
