import { MdDashboard } from "react-icons/md";
import {
  PostAdd,
  ShoppingCartCheckout,
  AddBusiness,
  Category,
} from "@mui/icons-material";

export const SidebarData = [
  {
    link: "/intrasell-dashboard",
    title: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    link: "/intrasell-posts",
    title: "Intrasell",
    icon: <AddBusiness />,
  },
  {
    link: "/intrasell-postRequests",
    title: "Post Requests",
    icon: <PostAdd />,
  },
  {
    link: "/intrasell-my-posts",
    title: "My Posts",
    icon: <ShoppingCartCheckout />,
  },
  {
    link: "/intrasell-categories",
    title: "Categories",
    icon: <Category />,
  },
];
