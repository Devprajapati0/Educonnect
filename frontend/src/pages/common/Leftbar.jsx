import { Dashboard, ImportantDevices, Logout } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { Box, IconButton, Tooltip } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import CallIcon from "@mui/icons-material/Call"
import SettingsIcon from "@mui/icons-material/Settings"
import React from "react"
import { UserIcon } from "lucide-react"
import { useLogoutUSerMutation } from "../../store/api/api"
import { useDispatch } from "react-redux"
import { logouts } from "../../store/slice/authSlice"
import toast from "react-hot-toast"

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)

  const institution = parts[0] || "EduConnect"
  const role = parts[1] || "guest"

  return { institution, role }
}

const Leftbar = () => {
  const dispatch = useDispatch()
  const { institution, role } = getInstitutionAndRoleFromPath()
  const navigate = useNavigate()
  const [logout] = useLogoutUSerMutation()

  const handleLogout = async() => {
    try {
      const res = await logout({
       subdomain: institution,
        role,
      }).unwrap()

      if(res.success) {
        dispatch(logouts())
        toast.success(res.message)
        navigate(`/${institution}/login`)
      } else {
        console.error("Logout failed:", res.message)
      }
      

      // console.log("Logout response:", res)
    } catch (error) {
      console.error("Logout error:", error)
      
    }
  }

  return (
    <Box
      sx={{
      
        height: "100vh",
        bgcolor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // To push logout to bottom
        alignItems: "center",
        py: 2,
        borderRight: "1px solid #1f2937",
      }}
    >
      <Box display="flex" flexDirection="column" gap={3} alignItems="center">
        {role === "admin" && (
          <Tooltip title="Dashboard" placement="right">
            <IconButton onClick={() => navigate(`/${institution}/${role}/dashboard`)} sx={{ color: "white" }}>
              <Dashboard />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Chat" placement="right">
          <IconButton onClick={() => navigate(`/${institution}/${role}/chat`)} sx={{ color: "white" }}>
            <ChatIcon />
          </IconButton>
        </Tooltip>

        {role === "admin" && (
          <Tooltip title="Add User" placement="right">
            <IconButton onClick={() => navigate(`/${institution}/${role}/add-user`)} sx={{ color: "white" }}>
              <UserIcon />
            </IconButton>
          </Tooltip>
        )}

        {(role === "admin" || role === "teacher") && (
          <Tooltip title="Complain" placement="right">
            <IconButton onClick={() => navigate(`/${institution}/${role}/complain`)} sx={{ color: "white" }}>
              <ImportantDevices />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Settings" placement="right">
          <IconButton onClick={() => navigate(`/${institution}/${role}/update-profile`)} sx={{ color: "white" }}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Logout at the bottom */}
      <Tooltip title="Logout" placement="right">
        <IconButton onClick={handleLogout} sx={{ color: "white" }}>
          <Logout />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Leftbar