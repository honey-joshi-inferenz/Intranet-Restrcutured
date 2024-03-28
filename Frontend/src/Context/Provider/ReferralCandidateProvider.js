import React from "react";
import { ReferralCandidateContext } from "../CreateContext";

export const ReferralCandidateProvider = ({ children }) => {
  return (
    <ReferralCandidateContext.Provider value={{}}>
      {children}
    </ReferralCandidateContext.Provider>
  );
};
