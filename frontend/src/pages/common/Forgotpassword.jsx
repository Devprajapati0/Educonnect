import { useState } from "react"
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import toast from "react-hot-toast"
import { useUpdateUserPasswordMutation } from "../../store/api/api"

function getSubdomainName() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)
  return parts.length > 0 ? parts[0].charAt(0) + parts[0].slice(1) : "EduConnect"
}

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("student")
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")

  const subdomain = getSubdomainName()
  const [updatePassword, { isLoading ,isError}] = useUpdateUserPasswordMutation()
  if(isError){
    toast.error("Something went wrong")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New and confirm passwords do not match")
      return
    }

    try {
      const payload = {
        email,
        oldPassword,
        newPassword,
        confirmPassword,
        role,
        subdomain,
      }

      const response = await updatePassword(payload).unwrap()
      toast.success(response.message || "Password updated successfully")

      // Clear fields after success
      setEmail("")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Paper elevation={3} className="w-full max-w-md p-6 rounded-xl">
        <Box className="text-center mb-4">
          <Typography variant="h5" fontWeight="bold">
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email and role to update your password securely.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Typography color="error" sx={{ fontSize: 14 }}>
              {error}
            </Typography>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Select Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Old Password"
            type={showOld ? "text" : "password"}
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOld(!showOld)} edge="end">
                    {showOld ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            type={showNew ? "text" : "password"}
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Paper>
    </div>
  )
}