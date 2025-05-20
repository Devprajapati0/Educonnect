import React, { useRef, useState } from "react"
import {
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Typography,
  Divider,
  Paper,
  Avatar
} from "@mui/material"
import BusinessIcon from "@mui/icons-material/Business"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import toast from "react-hot-toast"
import { useAddRoleSignupMutation } from "../../store/api/api"
import Leftbar from "../common/Leftbar"

function getSubdomainName() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)
  return parts.length > 0 ? parts[0] : "EduConnect"
}

const roles = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Parent", value: "parent" },
  { label: "Admin", value: "admin" },
]

const departments = [
  "Science",
  "Mathematics",
  "IT/CS",
  "English or HSS",
  "Hindi",
  "Sports",
]

function Adduser() {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [
    addRoleSignupMutation,
    { isLoading: isAddRoleSignupLoading, isError: isAddRoleSignupError, error: addRoleSignupError },
  ] = useAddRoleSignupMutation()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    rollnumber: "",
    subdomain: getSubdomainName(),
    batch: "",
    department: "",
    parentofemail: "",
    parentofname: "",
    avatar: null,
  })

  const [avatar, setAvatar] = useState(null)
  const fileInputRef = useRef(null)

  if (isAddRoleSignupError) {
    toast.error(addRoleSignupError?.data?.message || "Registration failed. Please try again.")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatar(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, email, password, role, rollnumber } = formData
    if (!name || !email || !password || !role || !rollnumber) {
      toast.error("Please fill all the required fields")
      return
    }

    if (role === "student" && !formData.batch) {
      toast.error("Please enter batch for student.")
      return
    }
    if (role === "teacher" && !formData.department) {
      toast.error("Please select department for teacher.")
      return
    }
    if (role === "parent" && !formData.parentofemail) {
      toast.error("Please enter student's email for parent.")
      return
    }
    if (role === "parent" && !formData.parentofname) {
      toast.error("Please enter student's name for parent.")
      return
    }

    try {
      const payload = { ...formData, avatar: avatar }
      const response = await addRoleSignupMutation(payload).unwrap()
      if (response.success === false) {
        return toast.error(response.message)
      }

      toast.success(`User ${formData.name} registered successfully as ${formData.role}`)

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        rollnumber: "",
        subdomain: getSubdomainName(),
        batch: "",
        department: "",
        parentofemail: "",
        parentofname: "",
        avatar: null,
      })
      setAvatar(null)
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed. Please try again.")
    }
  }

  return (
    <>
      {isAddRoleSignupLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper elevation={6} sx={{ p: 3, borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress size={60} />
            <Typography sx={{ mt: 2, fontWeight: 500 }}>Processing...</Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f9fc" }}>
        {/* Fixed Leftbar */}
        <Box
          sx={{
            width: { xs: 60, sm: 70 },
            flexShrink: 0,
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            bgcolor: "#0e1c2f",
            borderRight: "1px solid #1f2937",
            zIndex: 1100,
          }}
        >
          <Leftbar />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: '60px', sm: '70px' },
            p: { xs: 2, sm: 4 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Card 
            sx={{ 
              width: "100%", 
              maxWidth: 550,
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              overflow: 'visible',
              position: 'relative',
              pb: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <PersonAddIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            
            <CardHeader
              title={
                <Typography variant="h5" sx={{ fontWeight: 600, textAlign: "center", mt: 3 }}>
                  Create Account
                </Typography>
              }
              subheader={
                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: "center" }}>
                  Join {getSubdomainName()} platform
                </Typography>
              }
              sx={{ pb: 0 }}
            />
            
            <CardContent sx={{ pt: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    overflow: "hidden",
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    cursor: "pointer",
                    position: "relative",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: avatar ? 'transparent' : '#f0f2f5',
                    border: '3px solid white',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                  onClick={handleUploadClick}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <BusinessIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CloudUploadIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {avatar ? "Click to change avatar" : "Click to upload avatar"}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <TextField 
                    name="name" 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    fullWidth 
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField 
                    name="rollnumber" 
                    label="Roll Number" 
                    value={formData.rollnumber} 
                    onChange={handleInputChange} 
                    required 
                    fullWidth 
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <TextField 
                    name="email" 
                    label="Email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    fullWidth 
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <TextField 
                    name="password" 
                    label="Password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                    fullWidth 
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2, mb: 3 }}>
                  <TextField
                    select
                    name="role"
                    label="User Role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Role-specific fields with animation */}
                <Box 
                  sx={{ 
                    transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                    maxHeight: formData.role ? '200px' : '0',
                    opacity: formData.role ? 1 : 0,
                    overflow: 'hidden',
                    mb: formData.role ? 3 : 0
                  }}
                >
                  {formData.role === "student" && (
                    <TextField 
                      name="batch" 
                      label="Batch" 
                      value={formData.batch} 
                      onChange={handleInputChange} 
                      required 
                      fullWidth 
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                  {formData.role === "teacher" && (
                    <TextField
                      select
                      name="department"
                      label="Department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept.toLowerCase()}>
                          {dept}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  {formData.role === "parent" && (
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                      <TextField 
                        name="parentofemail" 
                        label="Student's Email" 
                        value={formData.parentofemail} 
                        onChange={handleInputChange} 
                        required 
                        fullWidth 
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                      <TextField 
                        name="parentofname" 
                        label="Student's Name" 
                        value={formData.parentofname} 
                        onChange={handleInputChange} 
                        required 
                        fullWidth 
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2, 
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    '&:hover': {
                      boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  )
}

export default Adduser