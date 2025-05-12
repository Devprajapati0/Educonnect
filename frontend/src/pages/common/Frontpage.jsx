import { useEffect, useState } from "react"
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper
} from "@mui/material"
import { Visibility, VisibilityOff, School, Token } from "@mui/icons-material"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { FRONTEND_URL } from "../../helpers/url"
import toast from "react-hot-toast"
import { generateKeyPair } from "../../helpers/key"
import { useDispatch } from "react-redux"
import { login } from "../../store/slice/authSlice"

function getSubdomainName() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)
  return parts.length > 0 ? parts[0].charAt(0) + parts[0].slice(1) : "EduConnect"
}

export default function Frontpage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState("student")
  const [orgName, setOrgName] = useState("EduConnect")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const subdomain = getSubdomainName()
  const dispatch = useDispatch()
  

  useEffect(() => {
    setOrgName(getSubdomainName())
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    try {

      
      const response = await axios.post(
        `${FRONTEND_URL}${subdomain}/${role}/login`,
        { email, password, role,subdomain },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
         
      let publicKeyer = null;
         if(response.data.success){
          // console.log('response',response)
        
        toast.success(response.data.message || "Login successful")
        if(response.data.data.user.publicKey == null){
          console.log('public key required')

          const publicKey = await generateKeyPair();
          console.log('publicKey',publicKey)

          const responseother = await axios.post(
            `${FRONTEND_URL}${subdomain}/${role}/updatePublicKey`,
            { userId: response.data.data.user._id, publicKey },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          )
          console.log('responseother',responseother)
          if(responseother.data.success){
            toast.success(responseother.data.message || "Public key updated successfully")
          }
          else{
            toast.error(responseother.data.message)
          }
          publicKeyer = responseother.data.data.publicKey
        }
        publicKeyer =  publicKeyer || response.data.data.user.publicKey 
        const user = response.data.data.user
        //  console.log('usersss',user)
        dispatch(login({
          user: {
            _id: user._id,
            username: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token:response.data.data.token,
            publicKey:publicKeyer,
          },
          isAuthenticated: true,
        }))

        
       navigate((role === "admin") ? `/${subdomain}/${role}/dashboard` : `/${subdomain}/${role}/chat`)
      }
        else{
          toast.error(response.data.message)
        }
    } catch (err) {
      console.error(err)
      if (err.response && err.response.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Link
        to="/"
        style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            p: 1,
            borderRadius: 1,
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <School />
        </Box>
        <Typography variant="h5" fontWeight="600" color="text.primary">
          {orgName}
        </Typography>
      </Link>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Sign in to {orgName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access your educational dashboard
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          {error && (
            <Typography color="error" sx={{ fontSize: 14, mb: 1 }}>
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
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
  
            <Link to={`/${subdomain}/forgot-password`} style={{ fontSize: "0.875rem", color: "#1976d2" }}>
              Forgot password?
            </Link>
          </Box>

          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}