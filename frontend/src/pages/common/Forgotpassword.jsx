import { useState } from "react";
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
  MenuItem,
  useTheme,
  useMediaQuery,
  alpha
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined, 
  EmailOutlined,
  PersonOutline,
  ShieldOutlined,
  RefreshOutlined
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useUpdateUserPasswordMutation } from "../../store/api/api";

function getSubdomainName() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  return parts.length > 0 ? parts[0].charAt(0) + parts[0].slice(1) : "EduConnect";
}

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [showNote, setShowNote] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const subdomain = getSubdomainName();
  const [updatePassword, { isLoading, isError }] = useUpdateUserPasswordMutation();

  if (isError) {
    toast.error("Something went wrong");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New and confirm passwords do not match");
      return;
    }

    try {
      const payload = {
        email,
        newPassword,
        confirmPassword,
        role,
        subdomain,
      };

      const response = await updatePassword(payload).unwrap();
      console.log(response);
      if (response.statuscode !== 200) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message || "Password updated successfully");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setShowNote(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Something went wrong");
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

      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 480,
          p: isMobile ? 3 : 4.5,
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
        <Box sx={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3
        }}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              p: 2,
              borderRadius: 3,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: theme.shadows[4],
              mb: 2
            }}
          >
            <ShieldOutlined fontSize="large" />
          </Box>
          <Typography 
            variant="h5" 
            fontWeight="700"
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Reset Password
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: "90%" }}
          >
            Enter your credentials below to securely update your password
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {error && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              }}
            >
              <Typography 
                color="error.main" 
                sx={{ 
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Box component="span" sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  "& svg": { fontSize: 20 } 
                }}>
                  ⚠️
                </Box>
                {error}
              </Typography>
            </Box>
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
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailOutlined fontSize="small" />
                <span>Email</span>
              </Box>
            }
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            fullWidth
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockOutlined fontSize="small" />
                <span>New Password</span>
              </Box>
            }
            type={showNew ? "text" : "password"}
            variant="outlined"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setShowNote(true);
            }}
            required
            sx={{ 
              mb: showNote ? 1 : 2.5,
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
                  <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password note */}
          {showNote && (
            <Box 
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1.5,
                mb: 2.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                position: "relative",
                overflow: "hidden",
                fontSize: "0.875rem",
                color: theme.palette.info.dark,
                animation: "pulse 2s infinite ease-in-out",
                "@keyframes pulse": {
                  "0%": { opacity: 0.85 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.85 }
                }
              }}
            >
              <InfoIcon />
              Password must be at least 6 characters long
            </Box>
          )}

          <TextField
            fullWidth
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockOutlined fontSize="small" />
                <span>Confirm Password</span>
              </Box>
            }
            type={showConfirm ? "text" : "password"}
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ 
              mb: 3,
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
            fullWidth
            disabled={isLoading}
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
            startIcon={!isLoading && <RefreshOutlined />}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Update Password"
            )}
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
        © {new Date().getFullYear()} {subdomain}. All rights reserved.
      </Typography>
    </Box>
  );
}

// Custom Info Icon component
const InfoIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: "8px", flexShrink: 0 }}
  >
    <path 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 16V12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 8H12.01" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);