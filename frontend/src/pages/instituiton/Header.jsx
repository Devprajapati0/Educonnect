import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { SchoolOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { removeInstitute } from "../../store/slice/instituteSlice";
import { FRONTEND_URL } from "../../helpers/url";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const authStatus = useSelector(
    (state) => state.institute.institute.isAuthicated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${FRONTEND_URL}institution/logout-institution`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      dispatch(removeInstitute());
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { name: "Features", path: "/features", active: true },
    { name: "Pricing", path: "/pricing", active: true },
    { name: "About", path: "/about", active: true },
    { name: "Log In", path: "/login", active: !authStatus },
    { name: "Sign Up", path: "/signup", active: !authStatus },
    { name: "Profile", path: "/profile", active: authStatus },
    { name: "Logout", path: "/logout", active: authStatus },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EduConnect
      </Typography>
      <List>
        {navItems.map(
          (item) =>
            item.active && (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  sx={{ textAlign: "center" }}
                  onClick={() => {
                    handleDrawerToggle(); // close drawer
                    if (item.name === "Logout") {
                      handleLogout();
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SchoolOutlined sx={{ color: "#1976d2" }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            EduConnect
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {navItems.map(
            (item) =>
              item.active && (
                <Button
                  key={item.name}
                  onClick={
                    item.name === "Logout"
                      ? handleLogout
                      : () => navigate(item.path)
                  }
                  aria-label={item.name}
                  variant="contained"
                  color={item.name === "Logout" ? "error" : "primary"}
                  sx={{
                    borderRadius: "20px",
                    px: { xs: 2, md: 3 },
                    fontSize: "0.875rem",
                    textTransform: "none",
                  }}
                >
                  {item.name}
                </Button>
              )
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          aria-label="open mobile menu"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            overflowY: "auto",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Header;