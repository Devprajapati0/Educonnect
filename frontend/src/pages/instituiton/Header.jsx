import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { removeInstitute } from "../../store/slice/instituteSlice";
import { FRONTEND_URL } from "../../helpers/url";

// MUI imports
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
  Container,
  Avatar,
  Tooltip,
  Fade,
  useScrollTrigger,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  School, 
  Home, 
  Info, 
  LocalOffer, 
  Login, 
  AppRegistration, 
  AccountCircle, 
  Logout, 
  Celebration 
} from "@mui/icons-material";

// Scroll-triggered elevation
function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 2 : 0,
    sx: {
      ...children.props.sx,
      backdropFilter: trigger ? "blur(10px)" : "none",
      backgroundColor: trigger ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 1)",
      transition: "all 0.3s ease-in-out",
    },
  });
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const authStatus = useSelector(
    (state) => state.institute.institute.isAuthicated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // For detecting active route
  const isActive = (path) => {
    return location.pathname === path;
  };

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

  // Navigation items with icons
  const navItems = [
    { name: "Home", path: "/", icon: <Home />, active: true },
    { name: "Features", path: "/features", icon: <Celebration />, active: true },
    { name: "Pricing", path: "/pricing", icon: <LocalOffer />, active: true },
    { name: "About", path: "/about", icon: <Info />, active: true },
    { name: "Log In", path: "/login", icon: <Login />, active: !authStatus },
    { name: "Sign Up", path: "/signup", icon: <AppRegistration />, active: !authStatus },
    { name: "Profile", path: "/profile", icon: <AccountCircle />, active: authStatus },
    { name: "Logout", path: "/logout", icon: <Logout />, active: authStatus, action: handleLogout },
  ];

  const drawer = (
    <Box sx={{ py: 3, height: "100%" }}>
      {/* Logo in drawer */}
      <Box sx={{ display: "flex", alignItems: "center", px: 3, mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
            mr: 1.5,
          }}
        >
          <School fontSize="small" />
        </Avatar>
        <Typography variant="h6" fontWeight="700" color="primary.main">
          EduConnect
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {navItems.map(
          (item) =>
            item.active && (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  sx={{
                    py: 1.2,
                    px: 3,
                    borderRadius: "0 24px 24px 0",
                    mr: 2,
                    ml: 0,
                    mb: 0.5,
                    bgcolor: isActive(item.path) ? "primary.light" : "transparent",
                    color: isActive(item.path) ? "primary.main" : "text.primary",
                    "&:hover": {
                      bgcolor: isActive(item.path) ? "primary.light" : "action.hover",
                    },
                  }}
                  onClick={() => {
                    handleDrawerToggle();
                    if (item.action) {
                      item.action();
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40, 
                      color: isActive(item.path) ? "primary.main" : item.name === "Logout" ? "error.main" : "inherit"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                      color: item.name === "Logout" && !isActive(item.path) ? "error.main" : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <ElevationScroll>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: { xs: 1, md: 1.5 },
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            width: "100%",
          }}
        >
            {/* Logo + Name */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": { opacity: 0.9 },
                transition: "opacity 0.2s",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                  mr: 1.5,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <School fontSize="small" />
              </Avatar>
              <Typography
                variant="h6"
                fontWeight="700"
                color="primary.main"
                sx={{
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                EduConnect
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: { md: 0.5, lg: 1 },
              }}
            >
              {navItems.map(
                (item) =>
                  item.active && (
                    <Tooltip
                      key={item.name}
                      title={item.name}
                      placement="bottom"
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      arrow
                      enterDelay={500}
                      enterNextDelay={500}
                    >
                      <Button
                        onClick={item.action ? item.action : () => navigate(item.path)}
                        variant={
                          item.name === "Sign Up"
                            ? "contained"
                            : item.name === "Logout"
                            ? "outlined"
                            : "text"
                        }
                        color={item.name === "Logout" ? "error" : "primary"}
                        startIcon={item.icon}
                        size="medium"
                        sx={{
                          borderRadius: "12px",
                          px: item.name === "Sign Up" || item.name === "Log In" ? 2.5 : 2,
                          py: 1,
                          mx: { md: 0.5, lg: 1 },
                          fontWeight: 
                            isActive(item.path) || item.name === "Sign Up" 
                              ? 600 
                              : 500,
                          textTransform: "none",
                          position: "relative",
                          "&:after": isActive(item.path) && item.name !== "Sign Up" && item.name !== "Logout" ? {
                            content: '""',
                            position: "absolute",
                            bottom: "6px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "20px",
                            height: "3px",
                            borderRadius: "2px",
                            backgroundColor: "primary.main",
                          } : {},
                          fontSize: "0.95rem",
                          boxShadow: 
                            item.name === "Sign Up" 
                              ? "0 4px 10px rgba(59, 130, 246, 0.25)" 
                              : "none",
                          "&:hover": {
                            boxShadow: 
                              item.name === "Sign Up" 
                                ? "0 6px 15px rgba(59, 130, 246, 0.3)" 
                                : "none",
                          },
                        }}
                      >
                        {item.name}
                      </Button>
                    </Tooltip>
                  )
              )}
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              color="primary"
              aria-label="open mobile menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: "none" },
                border: "1px solid",
                borderColor: "primary.light",
                borderRadius: "12px",
                p: 1,
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            elevation: 5,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: { xs: "75%", sm: 300 },
              boxSizing: "border-box",
              overflowY: "auto",
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </ElevationScroll>
  );
}

export default Header;