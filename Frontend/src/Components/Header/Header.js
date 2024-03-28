import React, { useState } from "react";
import "./Header.css";
import logo from "../../Assets/Logo/Logo.svg";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { GridView } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const HeaderCommon = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    if (role === "Admin" || role === "HR" || role === "Accounts") {
      navigate("/adms");
    } else {
      navigate("/");
    }
    handleClose();
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <div className="header d-flex align-items-center">
      <div className=" d-flex justify-content-between align-items-center  container ">
        <img src={logo} alt="headerLogo" className="headerLogo" />
        <div className="d-flex align-items-end ">
          <div className="d-flex flex-column text-end">
            <span>Welcome,</span>
            <span style={{ color: "#4e5f77" }}>{name}</span>
          </div>
          <Tooltip title="Account">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{ width: 35, height: 35 }}
                className="rounded userAvatar "
              >
                {name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>
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
  );
};
