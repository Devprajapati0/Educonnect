import { Dashboard } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { Box, IconButton, Tooltip } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CallIcon from "@mui/icons-material/Call"
import SettingsIcon from "@mui/icons-material/Settings"
import React from "react"
import { UserIcon } from "lucide-react"

function getSubdomainName() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)

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
        bgcolor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        gap: 3,
        borderRight: "1px solid #1f2937",
      }}
    >
      <Tooltip title="Dashboard" placement="right">
        <IconButton onClick={() => navigate(`/${subdomain}/admin/dashboard`)} sx={{ color: "white" }}>
          <Dashboard />
        </IconButton>
      </Tooltip>

      <Tooltip title="Chat" placement="right">
        <IconButton onClick={() => navigate(`/${subdomain}/admin/chat`)} sx={{ color: "white" }}>
          <ChatIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Calls" placement="right">
        <IconButton sx={{ color: "white" }}>
          <CallIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add User" placement="right">
        <IconButton onClick={() => navigate(`/${subdomain}/admin/add-user`)} sx={{ color: "white" }}>
          <UserIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings" placement="right">
        <IconButton sx={{ color: "white" }}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}