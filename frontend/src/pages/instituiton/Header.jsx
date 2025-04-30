import React from 'react'

import { Button, Typography } from "@mui/material";
import { SchoolOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <SchoolOutlined style={{ color: "#1976d2" }} />
      <Typography variant="h6">  <Button component={Link} to="/" color="inherit">EduConnect</Button></Typography>
    </div>
    <div style={{ display: "flex", gap: "15px" }}>
      <Button component={Link} to="/features" color="inherit">Features</Button>
      <Button component={Link} to="/pricing" color="inherit">Pricing</Button>
      <Button component={Link} to="/about" color="inherit">About</Button>
      <Button component={Link} to="/login" variant="outlined">Log In</Button>
      <Button component={Link} to="/signup" variant="contained">Sign Up</Button>
    </div>
  </header>
  )
}

export default Header