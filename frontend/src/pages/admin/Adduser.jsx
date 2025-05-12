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
} from "@mui/material"
import BusinessIcon from "@mui/icons-material/Business"
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
      {/* Full-screen loader overlay */}
      {isAddRoleSignupLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      <Box sx={{ display: "flex" }}>
        <Leftbar />

        <Card className="max-w-xl mx-auto mt-10 shadow-lg">
          <CardHeader
            title="Signup"
            subheader="Create your account"
            className="text-center"
            style={{ backgroundColor: "#f5f5f5" }}
          />
          <CardContent>
            <Box className="flex flex-col items-center mb-6">
              <div
                className="w-24 h-24 rounded-full border-4 border-gray-300 overflow-hidden shadow-md cursor-pointer relative group"
                onClick={handleUploadClick}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-3xl">
                    <BusinessIcon fontSize="inherit" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <Button onClick={handleUploadClick} size="small" variant="outlined" className="mt-2">
                {avatar ? "Change avatar" : "Upload avatar"}
              </Button>
            </Box>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                name="rollnumber"
                label="Roll Number"
                value={formData.rollnumber}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
                size="small"
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
                size="small"
              />
              <TextField
                select
                name="role"
                label="User Role"
                value={formData.role}
                onChange={handleInputChange}
                required
                fullWidth
                variant="outlined"
                size="small"
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Role-specific fields */}
              {formData.role === "student" && (
                <TextField
                  name="batch"
                  label="Batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  variant="outlined"
                  size="small"
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
                  size="small"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept.toLowerCase()}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {formData.role === "parent" && (
                <>
                  <TextField
                    name="parentofemail"
                    label="Student's Email (Parent Of)"
                    value={formData.parentofemail}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    name="parentofname"
                    label="Student's Name (Parent Of)"
                    value={formData.parentofname}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </>
              )}

              <Button type="submit" variant="contained" fullWidth size="large">
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default Adduser