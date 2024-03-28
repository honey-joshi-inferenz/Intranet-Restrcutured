import React from "react";
import "./Styles.css";
import { Button } from "@mui/material";
import reimbursement from "../../Assets/Logo/reimbursement.png";
import intraSell from "../../Assets/Logo/intrasell.png";
import referral from "../../Assets/Logo/reverseRefer.png";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export const Home3CardLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="Home3CardLayout homeViewCards">
      <div className="row row-cols-2 g-2">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center  mb-2 mb-md-5">
          <div className="reimbursement p-3  position-relative switchCard w-75 d-flex  flex-row flex-xl-column">
            <div className="position-absolute homeImages">
              <img alt="reimbursement" src={reimbursement} className="w-100" />
            </div>
            <Button
              className="generalButton homeButton d-flex justify-content-between "
              onClick={() => navigate("/reimbursement-view")}
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
              className="generalButton homeButton d-flex justify-content-between"
              onClick={() => navigate("/intrasell-myposts")}
            >
              <span>Intrasell</span>
              <div className="bg-light  rounded">
                <GrFormNextLink />
              </div>
            </Button>
          </div>
        </div>
        <div className="col-12 d-flex align-items-center justify-content-center p-5 pt-0">
          <div className="referral p-3  position-relative switchCard w-100 mx-0 mx-md-2 ">
            <div className="position-absolute homeImages accountsReferral">
              <img alt="referral" src={referral} height={300} />
            </div>
            <Button
              className="generalButton homeButton d-flex justify-content-between Cardshome3Btn position-absolute"
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
