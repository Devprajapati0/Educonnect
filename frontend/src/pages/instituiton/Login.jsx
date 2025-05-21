import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  Avatar,
  Divider
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Business,
  LoginOutlined
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FRONTEND_URL } from "../../helpers/url.js";
import Header from "./Header.jsx";
import { useDispatch } from "react-redux";
import { setInstitute, setIsActive } from "../../store/slice/instituteSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  // console.log(FRONTEND_URL)

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${FRONTEND_URL}institution/login-institution`, form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res);
      
      const data = res.data;
      dispatch(setInstitute({
        fullname: data.data.fullname,
        email: data.data.email,
        type: data.data.type,
        subdomain: data.data.subdomain,
        _id: data.data?._id,
        isAuthicated: true,
      }));
      dispatch(setIsActive(true));

      if (data.success) {
        toast.success("Logged in successfully!");
        // Navigate to dashboard or home
        navigate("/");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 flex items-center justify-center"
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={4} 
            className="overflow-hidden rounded-xl"
            sx={{ borderRadius: '16px', overflow: 'hidden' }}
          >
            {/* Top banner */}
            <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6 text-center">
              <Avatar 
                className="mx-auto mb-4 bg-white text-blue-600"
                sx={{ 
                  width: 70, 
                  height: 70, 
                  backgroundColor: 'white',
                  color: '#3949ab',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Business sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" className="text-white font-medium mb-1">
                Welcome Back
              </Typography>
              <Typography variant="body1" className="text-blue-100">
                Sign in to access your EduConnect dashboard
              </Typography>
            </Box>

            <CardContent className="px-6 py-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <TextField
                  label="Institution Name"
                  value={form.fullname}
                  onChange={handleChange("fullname")}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business className="text-gray-500" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '10px' }
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-gray-500" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '10px' }
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-500" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? 
                            <VisibilityOff className="text-gray-500" /> : 
                            <Visibility className="text-gray-500" />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '10px' }
                  }}
                />

                <Box className="flex justify-end mt-1">
                  <Typography 
                    variant="body2" 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => navigate('/forgotpassword')}
                  >
                    Forgot password?
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                  className="mt-4"
                  startIcon={<LoginOutlined />}
                  sx={{ 
                    py: 1.5, 
                    textTransform: 'none', 
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    background: 'linear-gradient(90deg, #3949ab 0%, #4e6ae6 100%)',
                    boxShadow: '0 4px 10px rgba(57, 73, 171, 0.3)'
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <Box className="mt-6 pt-6 border-t border-gray-200">
                <Typography variant="body1" align="center" className="text-gray-600">
                  Don't have an account yet?{" "}
                  <Typography
                    component="span"
                    variant="body1"
                    className="text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                    onClick={() => navigate('/signup')}
                    sx={{ fontWeight: 500 }}
                  >
                    Create an account
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Paper>
          
          <Box className="text-center mt-6">
            <Typography variant="body2" className="text-gray-500">
              © 2025 EduConnect. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}