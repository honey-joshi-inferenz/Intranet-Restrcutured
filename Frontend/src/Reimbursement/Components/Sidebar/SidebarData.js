import { MdDashboard } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";

export const SidebarData = [
  {
    link: "/reimbursement-dashboard",
    title: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    link: "/reimbursement-requests",
    title: "Requests",
    icon: <MdPersonAddAlt1 />,
  },
  {
    link: "/reimbursement-myRequests",
    title: "My Reimbursement",
    icon: <FaUserEdit />,
  },
];
