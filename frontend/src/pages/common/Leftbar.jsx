import { Dashboard } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { Box, IconButton, Tooltip } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CallIcon from "@mui/icons-material/Call"
import SettingsIcon from "@mui/icons-material/Settings"
import React from "react"
import { UserIcon } from "lucide-react"

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)

  const institution = parts[0] || "EduConnect"
  const role = parts[1] || "guest"

  return { institution, role }
}

 const Leftbar = () => {
  const {institution,role} = getInstitutionAndRoleFromPath()
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
    >{role =="admin" &&
      <Tooltip title="Dashboard" placement="right">
        <IconButton onClick={() => navigate(`/${institution}/${role}/dashboard`)} sx={{ color: "white" }}>
          <Dashboard />
        </IconButton>
      </Tooltip>}

      <Tooltip title="Chat" placement="right">
        <IconButton onClick={() => navigate(`/${institution}/${role}/chat`)} sx={{ color: "white" }}>
          <ChatIcon />
        </IconButton>
      </Tooltip>


      {role == "admin" && <Tooltip title="Add User" placement="right">
        <IconButton onClick={() => navigate(`/${institution}/${role}/add-user`)} sx={{ color: "white" }}>
          <UserIcon />
        </IconButton>
      </Tooltip>}

      <Tooltip title="Settings" placement="right">
        <IconButton onClick={() => navigate(`/${institution}/${role}/update-profile`)} sx={{ color: "white" }}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
export default Leftbar