import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// //Routes for Admin and HR
// const adminLevelAuth = () => {
//   const role = localStorage.getItem("role");
//   if (role === "Admin" || role === "HR") {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const ProtectedAdminLevel = ({
//   component: Component,
//   ...restOfProps
// }) => {
//   const auth = adminLevelAuth();

//   return auth ? <Outlet /> : <Navigate to="/unauthorized" />;
// };

// //Routes for Admin and Accounts
// const accountsLevelAuth = () => {
//   const role = localStorage.getItem("role");
//   if (role === "Admin" || role === "Accounts") {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const ProtectedAccountsLevel = ({
//   component: Component,
//   ...restOfProps
// }) => {
//   const auth = accountsLevelAuth();

//   return auth ? <Outlet /> : <Navigate to="/unauthorized" />;
// };

// //Routes for HR
// const hrLevelAuth = () => {
//   const role = localStorage.getItem("role");
//   if (role === "HR") {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const ProtectedRoutesHR = ({ component: Component, ...restOfProps }) => {
//   const auth = hrLevelAuth();

//   return auth ? <Outlet /> : <Navigate to="/unauthorized" />;
// };

// //Routes for Interviewer
// const interviewerLevelAuth = () => {
//   const role = localStorage.getItem("role");
//   if (role === "Interviewer") {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const ProtectedRoutesInterviewer = ({
//   component: Component,
//   ...restOfProps
// }) => {
//   const auth = interviewerLevelAuth();

//   return auth ? <Outlet /> : <Navigate to="/unauthorized" />;
// };

// //Routes for Employee
// const employeeLevelAuth = () => {
//   const role = localStorage.getItem("role");
//   if (
//     role === "Admin" ||
//     role === "HR" ||
//     role === "Accounts" ||
//     role === "Interviewer" ||
//     role === "Employee"
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const ProtectedRoutesEmployee = ({
//   component: Component,
//   ...restOfProps
// }) => {
//   const auth = employeeLevelAuth();

//   return auth ? <Outlet /> : <Navigate to="/unauthorized" />;
// };

const checkUserRole = (allowedRoles) => {
  const role = localStorage.getItem("role");
  return allowedRoles.includes(role);
};

const ProtectedRoute = ({
  allowedRoles,
  component: Component,
  ...restOfProps
}) => {
  const isAuthenticated = checkUserRole(allowedRoles);

  return isAuthenticated ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export const ProtectedRoutesEmployee = (props) => (
  <ProtectedRoute
    allowedRoles={["Admin", "HR", "Accounts", "Interviewer", "Employee"]}
    {...props}
  />
);

export const ProtectedRoutesInterviewer = (props) => (
  <ProtectedRoute allowedRoles={["Interviewer", "Accounts"]} {...props} />
);

export const ProtectedRoutesHR = (props) => (
  <ProtectedRoute allowedRoles={["HR"]} {...props} />
);

export const ProtectedAccountsLevel = (props) => (
  <ProtectedRoute allowedRoles={["Admin", "Accounts"]} {...props} />
);

export const ProtectedAdminLevel = (props) => (
  <ProtectedRoute allowedRoles={["Admin", "HR"]} {...props} />
);
