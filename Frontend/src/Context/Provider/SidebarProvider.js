import React, { useState } from "react";
import { SidebarContext } from "../CreateContext";

export const SidebarProvider = ({ children }) => {
  const [reimbursenavVisible, setReimburseNavVisible] = useState(true);
  const [recruiterNavVisible, setRecruiterNavVisible] = useState(true);
  const [intrasellNavVisible, setIntrasellNavVisible] = useState(true);
  return (
    <SidebarContext.Provider
      value={{
        reimbursenavVisible,
        setReimburseNavVisible,
        recruiterNavVisible,
        setRecruiterNavVisible,
        intrasellNavVisible,
        setIntrasellNavVisible,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
