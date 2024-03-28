import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { CandidateContext } from "../../../Context/CreateContext";
import useWindowDimensions from "../../../Helpers/window_dimensions";

export const RoundStepper = () => {
  const { currentRound } = useContext(CandidateContext);
  const steps = ["Round 1", "Round 2", "Round 3"];
  const { width } = useWindowDimensions();
  return (
    <div className="col-md-12 col-lg-2">
      <Box sx={{ width: "100%" }}>
        <Stepper
          activeStep={currentRound?.substring(6, 7) - 1}
          alternativeLabel={width > 900 ? false : true}
          orientation={width > 900 ? "vertical" : "horizontal"}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
};
