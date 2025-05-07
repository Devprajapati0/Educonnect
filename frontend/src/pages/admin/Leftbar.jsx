import { Dashboard } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { Box, IconButton } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CallIcon from "@mui/icons-material/Call"
import SettingsIcon from "@mui/icons-material/Settings"
import React from "react"
import { UserIcon } from "lucide-react"

function getSubdomainName() {
    const pathname = window.location.pathname
    const parts = pathname.split("/").filter(Boolean) // remove empty strings
  
    if (parts.length > 0) {
      return parts[0].charAt(0) + parts[0].slice(1)
    }
  
    return "EduConnect"
  }

export const Leftbar = () => {
    const subdomain = getSubdomainName()
    const navigate = useNavigate()
    return (
      <Box
        sx={{
          width: 80,
          height: "100vh",
          bgcolor: "grey.900",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          gap: 2,
          borderRight: "1px solid #333",
        }}
      >
        <IconButton onClick={() => navigate(`/${subdomain}/admin/dashboard`)} sx={{ color: "white" }}>
          <Dashboard />
        </IconButton>
        <IconButton onClick={() => navigate(`/${subdomain}/admin/chat`)} sx={{ color: "white" }}>
          <ChatIcon />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <CallIcon />
        </IconButton>
        <IconButton onClick={() => navigate(`/${subdomain}/admin/add-user`)} sx={{ color: "white" }}>
          <UserIcon />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <SettingsIcon />
        </IconButton>
      </Box>
    )
}
  