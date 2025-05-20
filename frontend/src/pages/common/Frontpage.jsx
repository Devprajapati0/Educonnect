import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  School, 
  ArrowForward,
  LockOutlined,
  EmailOutlined,
  PersonOutline
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FRONTEND_URL } from "../../helpers/url";
import toast from "react-hot-toast";
import { generateKeyPair } from "../../helpers/key";
import { useDispatch } from "react-redux";
import { login } from "../../store/slice/authSlice";

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);

  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";

  return { institution, role };
}

export default function Frontpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");
  const [orgName, setOrgName] = useState("EduConnect");
  const [loading, setLoading] = useState(false);
  const { institution } = getInstitutionAndRoleFromPath();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  console.log('institution', institution);
  const navigate = useNavigate();
  const subdomain = institution;
  const dispatch = useDispatch();

  useEffect(() => {
    setOrgName(institution);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${FRONTEND_URL}${subdomain}/${role}/login`,
        { email, password, role, subdomain },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      let publicKeyer = null;
      if (response.data.success) {
        console.log('response', response);
        
        toast.success(response.data.message || "Login successful");
        if (response.data.data.user.publicKey == null) {
          console.log('public key required');

          const publicKey = await generateKeyPair();
          console.log('publicKey', publicKey);

          const responseother = await axios.post(
            `${FRONTEND_URL}${subdomain}/${role}/updatePublicKey`,
            { userId: response.data.data.user._id, publicKey },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          console.log('responseother', responseother);
          if (responseother.data.success) {
            toast.success(responseother.data.message || "Public key updated successfully");
          } else {
            toast.error(responseother.data.message);
          }
          publicKeyer = responseother.data.data.publicKey;
        }
        publicKeyer = publicKeyer || response.data.data.user.publicKey;
        const user = response.data.data.user;
        dispatch(login({
          user: {
            _id: user._id,
            username: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: response.data.data.token,
            publicKey: publicKeyer,
            institution: institution,
          },
          isAuthenticated: true,
        }));

        navigate((role === "admin") ? `/${subdomain}/${role}/dashboard` : `/${subdomain}/${role}/chat`);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.primary.main}33 100%)`,
        px: 2,
        py: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background design elements */}
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}33)`,
          top: "-150px",
          right: "-150px",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}22, ${theme.palette.primary.main}33)`,
          bottom: "-100px",
          left: "-100px",
          zIndex: 0,
        }}
      />
      
      {/* Logo and Institution Name */}
      <Link
        to="/"
        style={{ 
          textDecoration: "none", 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          marginBottom: "2rem",
          zIndex: 1,
          position: "relative"
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            p: 1.5,
            borderRadius: 2,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: theme.shadows[4],
          }}
        >
          <School fontSize="medium" />
        </Box>
        <Typography 
          variant="h4" 
          fontWeight="700" 
          color="primary.main"
          sx={{
            textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
            letterSpacing: "-0.5px"
          }}
        >
          {orgName}
        </Typography>
      </Link>

      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 480,
          p: isMobile ? 3 : 5,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 1,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-2px)"
          }
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography 
            variant="h5" 
            fontWeight="700"
            color="text.primary"
            gutterBottom
          >
            Welcome back!
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Sign in to your {orgName} account
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                fontSize: 14, 
                mb: 2,
                p: 1,
                borderRadius: 1,
                bgcolor: "error.light",
                color: "error.dark",
                fontWeight: 500
              }}
            >
              {error}
            </Typography>
          )}

          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <InputLabel id="role-label">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonOutline fontSize="small" />
                <span>Select Role</span>
              </Box>
            </InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonOutline fontSize="small" />
                  <span>Select Role</span>
                </Box>
              }
              onChange={(e) => setRole(e.target.value)}
              sx={{ 
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.mode === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailOutlined fontSize="small" />
                <span>Email</span>
              </Box>
            }
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ 
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: theme.palette.mode === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              }
            }}
          />

          <TextField
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockOutlined fontSize="small" />
                <span>Password</span>
              </Box>
            }
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ 
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: theme.palette.mode === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              }
            }}
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
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Link 
              to={`/${subdomain}/forgot-password`} 
              style={{ 
                fontSize: "0.875rem", 
                color: theme.palette.primary.main,
                textDecoration: "none",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                }
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-1px)"
              }
            }}
            endIcon={!loading && <ArrowForward />}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Paper>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mt: 3, 
          textAlign: "center",
          zIndex: 1,
          position: "relative"
        }}
      >
        © {new Date().getFullYear()} {orgName}. All rights reserved.
      </Typography>
    </Box>
  );
}