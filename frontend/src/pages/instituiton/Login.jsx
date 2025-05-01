import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FRONTEND_URL } from "../../helpers/url.js";
import Header from "./Header.jsx";
import { Business } from "@mui/icons-material";

export default function LoginPage() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

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
      const res = await axios.post(`${FRONTEND_URL}institution/login-institution`, form,{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      const data = res.data;

      if (data.success) {
        toast.success("Logged in successfully!");
        // Store token or user data if needed
        // localStorage.setItem("token", data.token);

        // Navigate to dashboard or home
        navigate("/dashboard");
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          background: "#f5f5f5",
        }}
      >
        <Card sx={{ maxWidth: 400, width: "100%" }}>
          <CardHeader
            title="Login to EduConnect"
            subheader="Access your dashboard"
          />
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                 <TextField
                                    label="Institution Name"
                                    value={form.fullname}
                                    onChange={handleChange("fullname")}
                                    required
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <Business />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Typography variant="body2" align="center">
                Don’t have an account?{" "}
                <a
                  href="/signup"
                  style={{ color: "#1976d2", textDecoration: "none" }}
                >
                  Sign up
                </a>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}