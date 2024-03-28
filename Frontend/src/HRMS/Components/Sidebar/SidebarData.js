import dashboard from "../../../Assets/Logo/Dashboard.svg";
// import referral from "../../../Assets/Logo/Referral Applications.svg";
import deletedUsers from "../../../Assets/Logo/Delet User.svg";
import reports from "../../../Assets/Logo/Reports.svg";
import users from "../../../Assets/Logo/Users.svg";
import addCandidate from "../../../Assets/Logo/AddCandidate.svg";
import position from "../../../Assets/Logo/Position.svg";
import interviewHistory from "../../../Assets/Logo/InterviewHistory.svg";

export const SidebarData = [
  {
    link: "/recruiter-dashboard",
    title: "Dashboard",
    icon: dashboard,
  },
  // {
  //   link: "/recruiter-referrals",
  //   title: "Referral Applications",
  //   icon: referral,
  // },
  {
    link: "/recruiter-deletedUsers",
    title: "Deleted Users",
    icon: deletedUsers,
  },
  {
    link: "/recruiter-reports",
    title: "Reports",
    icon: reports,
  },
  {
    link: "/recruiter-users",
    title: "Users",
    icon: users,
  },
  {
    link: "/recruiter-addCandidate",
    title: "Add Candidate",
    icon: addCandidate,
  },
  {
    link: "/recruiter-departmentMgmt",
    title: "Department Management",
    icon: position,
  },
  {
    link: "/recruiter-interview-history",
    title: "Interview History",
    icon: interviewHistory,
  },
];
