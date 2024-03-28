import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { GridView } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import logo from "../../../Assets/Logo/Logo.svg";
import { SidebarData } from "./SidebarData";
import { useLocation } from "react-router-dom";
import { SidebarContext } from "../../../Context/CreateContext";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const [anchorEl, setAnchorEl] = useState(null);
  const { intrasellNavVisible, setIntrasellNavVisible } =
    useContext(SidebarContext);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <div>
      <div className="intrasell-sidenav d-flex d-lg-none ">
        <div className=" container d-flex  justify-content-between align-items-center ">
          <div>
            <button
              className="intrasell-sidenav-btn d-flex d-lg-none"
              onClick={() => setIntrasellNavVisible(!intrasellNavVisible)}
            >
              <MdMenu size={24} />
            </button>
          </div>
          <div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    sx={{ width: 35, height: 35 }}
                    className="rounded userAvatar2 "
                  >
                    {name.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <div className="d-flex flex-column mx-2 userProfile">
                  <span>{name}</span>
                  <p>{email}</p>
                </div>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/home");
                }}
              >
                <ListItemIcon>
                  <GridView fontSize="small" />
                </ListItemIcon>
                Switch Portal
              </MenuItem>
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <nav className={!intrasellNavVisible ? "sidenav" : ""}>
        <div>
          <div className="d-flex justify-content-between w-100">
            {intrasellNavVisible && (
              <img src={logo} alt="logo" className="ps-2" height={25} />
            )}
            <div className="d-flex align-items-center">
              {intrasellNavVisible && <div className="sidenavLine" />}
              <div
                className={intrasellNavVisible ? "sidenav-btn " : "open-btn "}
                onClick={() => {
                  setIntrasellNavVisible(!intrasellNavVisible);
                }}
              ></div>
            </div>
          </div>
          <div className="sidenav-links sidenav-top">
            {SidebarData?.map((i, index) => {
              return (
                <Link
                  className="sidenav-link link"
                  id={location.pathname === i.link ? "activePath" : ""}
                  to={i.link}
                  key={index}
                >
                  <div className="d-flex justify-content-start sidenav-option">
                    <div className="sidenav-sidebaricon ">{i.icon}</div>
                    {intrasellNavVisible && (
                      <span className="mt-1 ms-2">{i.title}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};
