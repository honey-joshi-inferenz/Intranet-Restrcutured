import "./App.css";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { EmpLogin } from "./Pages/Login/EmpLogin";
import { Registration } from "./Pages/Registration/Registration";
import { AdminLogin } from "./Pages/Login/AdminLogin";
import { ForgotPassword } from "./Pages/ForgotPassword/ForgotPassword";
import { UpdateTempPassword } from "./Pages/UpdateTempPassword/UpdateTempPassword";
import { Home } from "./Pages/Home/Home";
import { ViewRequest } from "./Reimbursement/Pages/Employee/ViewRequest/ViewRequest";
import { ViewReferRequest } from "./ReferABuddy/Pages/ViewRequest/ViewRequest";
import { HRHome } from "./Reimbursement/Pages/HR/HRHome/HRHome";
import { HRRequests } from "./Reimbursement/Pages/HR/HRRequests/HRRequests";
import { HREditRequest } from "./Reimbursement/Pages/HR/HREditRequest/HREditRequest";
import { ReimburseDashboard } from "./Reimbursement/Pages/Admin/Dashboard/Dashboard";
import { UnAuthorized } from "./Pages/UnAuthorized/UnAuthorized";
import { MyRequests } from "./Reimbursement/Pages/Admin/MyRequests/MyRequests";
import { ReimburseRequests } from "./Reimbursement/Pages/Admin/ReimburseRequests/ReimburseRequests";
import { AdminEditRequest } from "./Reimbursement/Pages/Admin/AdminEditRequest/AdminEditRequest";
import { InterviewerHome } from "./HRMS/Pages/Interviewer/InterviewerHome/InterviewerHome";
import { InterviewHistory } from "./HRMS/Pages/Interviewer/InterviewHistory/InterviewHistory";
import { EditInterview } from "./HRMS/Pages/Interviewer/EditInterview/EditInterview";
import { RecruiterDashboard } from "./HRMS/Pages/HR-Admin/Dashboard/Dashboard";
import { CandidateDetails } from "./HRMS/Pages/HR-Admin/CandidateDetails/CandidateDetails";
import { DeletedUsers } from "./HRMS/Pages/HR-Admin/DeletedUsers/DeletedUsers";
import { Users } from "./HRMS/Pages/HR-Admin/Users/Users";
import { AddCandidate } from "./HRMS/Pages/HR-Admin/AddCandidate/AddCandidate";
import { DepartmentMgmt } from "./HRMS/Pages/HR-Admin/DepartmentMgmt/DepartmentMgmt";
import { RecruiterInterviewHistory } from "./HRMS/Pages/HR-Admin/InterviewHistory/InterviewHistory";
import { Reports } from "./HRMS/Pages/HR-Admin/Reports/Reports";
import { UserPofile } from "./HRMS/Pages/HR-Admin/UserProfile/UserPofile";
import { AdminInterviewDetails } from "./HRMS/Pages/HR-Admin/AdminInterviewDetails/AdminInterviewDetails";
import {
  ProtectedAccountsLevel,
  ProtectedAdminLevel,
  ProtectedRoutesHR,
  ProtectedRoutesInterviewer,
  ProtectedRoutesEmployee,
} from "./Helpers/ProtectedRoutes";
// import { ReferralCandidateDetails } from "./HRMS/Pages/HR-Admin/CandidateDetails/ReferralCandidateDetails";

//context
// import { ReferralCandidateProvider } from "./Context/Provider/ReferralCandidateProvider";
import { CandidateProvider } from "./Context/Provider/CandidateProvider";
import { SidebarProvider } from "./Context/Provider/SidebarProvider";
import { RecruiterDashboardProvider } from "./Context/Provider/RecruiterDashboardProvider";
import { CommingSoon } from "./Pages/CommingSoon/CommingSoon";
import { AnalyticsProvider } from "./Context/Provider/AnalyticsProvider";
import { MyPosts } from "./IntraSell/Pages/Employee/MyPosts/MyPosts";
import { AllPosts } from "./IntraSell/Pages/Employee/AllPosts/AllPosts";
import { IntrasellDashboard } from "./IntraSell/Pages/HR-Admin/IntrasellDashboard/IntrasellDashboard";
import { AdminIntraSell } from "./IntraSell/Pages/HR-Admin/AdminIntraSell/AdminIntraSell";
import { AdminSelfPosts } from "./IntraSell/Pages/HR-Admin/AdminSelfPosts/AdminSelfPosts";
import { IntrasellRequests } from "./IntraSell/Pages/HR-Admin/AdminRequests/IntrasellRequests";
import { Categories } from "./IntraSell/Pages/HR-Admin/Categories/Categories";

function App() {
  const { pathname } = useLocation();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (location.pathname === "/") {
    window.history.pushState(null, document.URL, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.URL, window.location.href);
    });
  } else if (location.pathname === "/adms") {
    window.history.pushState(null, document.URL, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.URL, window.location.href);
    });
  }
  return (
    <div className="App">
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<EmpLogin />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/adms" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<UpdateTempPassword />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="/commig-soon" element={<CommingSoon />} />

          <Route path="/" element={<ProtectedRoutesEmployee />}>
            <Route path="/home" element={<Home />} />
            <Route path="/refer-view" element={<ViewReferRequest />} />
            <Route path="/reimbursement-view" element={<ViewRequest />} />
            <Route path="/intrasell-myposts" element={<MyPosts />} />
            <Route path="/intrasell" element={<AllPosts />} />
          </Route>

          <Route path="/" element={<ProtectedRoutesInterviewer />}>
            <Route path="/recruiter-interviews" element={<InterviewerHome />} />
            <Route
              path="/recruiter-interviewHistory"
              element={<InterviewHistory />}
            />
            <Route
              path="/recruiter-editInterview/:id"
              element={<EditInterview />}
            />
          </Route>

          <Route path="/" element={<ProtectedRoutesHR />}>
            <Route path="/reimbursement-home" element={<HRHome />} />
            <Route path="/reimbursement-my-requests" element={<HRRequests />} />
            <Route path="/reimbursement-edit/:id" element={<HREditRequest />} />
          </Route>

          <Route path="/" element={<ProtectedAccountsLevel />}>
            <Route
              path="/reimbursement-dashboard"
              element={<ReimburseDashboard />}
            />
            <Route path="/reimbursement-myRequests" element={<MyRequests />} />
            <Route
              path="/reimbursement-requests"
              element={<ReimburseRequests />}
            />
            <Route
              path="/reimbursement-editRequest/:id"
              element={<AdminEditRequest />}
            />
          </Route>

          <Route path="/" element={<ProtectedAdminLevel />}>
            <Route
              path="/recruiter-dashboard"
              element={
                <RecruiterDashboardProvider>
                  <RecruiterDashboard />
                </RecruiterDashboardProvider>
              }
            />
            <Route
              path="/recruiter-interview-details/:id"
              element={<AdminInterviewDetails />}
            />
            <Route
              path="/recruiter-candidateDetails/:id"
              element={
                <CandidateProvider>
                  <CandidateDetails />
                </CandidateProvider>
              }
            />
            {/* <Route
              path="/recruiter-referral-candidateDetails/:id"
              element={
                <ReferralCandidateProvider>
                  <ReferralCandidateDetails />
                </ReferralCandidateProvider>
              }
            /> */}
            <Route path="/recruiter-deletedUsers" element={<DeletedUsers />} />
            <Route
              path="/recruiter-reports"
              element={
                <AnalyticsProvider>
                  <Reports />
                </AnalyticsProvider>
              }
            />
            <Route path="/recruiter-users" element={<Users />} />
            <Route path="/recruiter-addCandidate" element={<AddCandidate />} />
            <Route
              path="/recruiter-departmentMgmt"
              element={<DepartmentMgmt />}
            />
            <Route
              path="/recruiter-interview-history"
              element={<RecruiterInterviewHistory />}
            />
            <Route path="/recruiter-myProfile" element={<UserPofile />} />
            <Route
              path="/intrasell-dashboard"
              element={<IntrasellDashboard />}
            />
            <Route path="/intrasell-posts" element={<AdminIntraSell />} />
            <Route path="/intrasell-my-posts" element={<AdminSelfPosts />} />
            <Route
              path="/intrasell-postRequests"
              element={<IntrasellRequests />}
            />
            <Route path="/intrasell-categories" element={<Categories />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </div>
  );
}

export default App;
