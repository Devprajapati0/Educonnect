import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Paper,
  Divider,
  Chip
} from "@mui/material";
import {
  GraduationCap,
  MessageSquare,
  Shield,
  Users,
  Video,
  Bell,
  BarChart,
  Globe,
  Lock,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function FeaturesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "background.default",
      background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, rgba(255,255,255,0) 100%)`,
    }}>
      <Header />

      {/* Hero Section with Background Accents */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 12 },
        }}
      >
        {/* Abstract background shapes */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, rgba(255,255,255,0) 70%)`,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -150,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, rgba(255,255,255,0) 70%)`,
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Chip 
              label="Features" 
              color="primary" 
              size="small" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                px: 1.5,
                borderRadius: "16px",
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: "none"
              }} 
            />
            <Typography
              variant={isMobile ? "h4" : "h2"}
              fontWeight="800"
              mb={2}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 4px 30px rgba(0,0,0,0.05)",
              }}
            >
              Powerful Features for Educational Communication
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight="400"
              sx={{ 
                maxWidth: 700, 
                mx: "auto", 
                px: { xs: 2, sm: 0 },
                lineHeight: 1.6
              }}
            >
              EduConnect offers an all-in-one suite of secure, smart tools to enhance collaboration across your institution.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features Cards with Modern Grid Layout */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  p: 0,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <Box 
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box 
                    sx={{ 
                      color: "white",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1.5,
                      borderRadius: 2,
                      width: 56,
                      height: 56,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="700" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                    {feature.description}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-start", mt: "auto" }}>
                    <Button 
                      variant="text" 
                      color="primary" 
                      size="small"
                      endIcon={<ChevronRight size={16} />}
                      sx={{ p: 0, fontWeight: 600, fontSize: "0.875rem" }}
                    >
                      Learn more
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section with Glassmorphism effect */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 6,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, rgba(255,255,255,0) 70%)`,
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "15%",
              left: "8%",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.12)} 0%, rgba(255,255,255,0) 70%)`,
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="800" mb={2}>
              Ready to Transform Your Institution?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", mb: 4, lineHeight: 1.6 }}
            >
              Get started with EduConnect and empower communication like never before. Our platform is trusted by over 500+ educational institutions worldwide.
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: isMedium ? "column" : "row", gap: 2, justifyContent: "center", maxWidth: 500, mx: "auto" }}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                component={Link}
                to="/signup"
                fullWidth
                sx={{ 
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button
                size="large"
                variant="outlined"
                color="primary"
                component={Link}
                to="/demo"
                fullWidth
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    background: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                Schedule Demo
              </Button>
            </Box>
            
            <Divider sx={{ my: 4, width: "100%", maxWidth: 500, mx: "auto", opacity: 0.6 }} />
            
            <Typography variant="body2" color="text.secondary">
              No credit card required. Free forever for basic features.
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}

// Features Data
const features = [
  {
    icon: <MessageSquare size="1.75rem" />,
    title: "Secure Messaging",
    description: "End-to-end encrypted messaging with role-based permissions and advanced security features to protect student data.",
  },
  {
    icon: <Shield size="1.75rem" />,
    title: "Administrative Oversight",
    description: "Comprehensive monitoring dashboard for safe communication with customizable alerts and reporting.",
  },
  {
    icon: <Bell size="1.75rem" />,
    title: "Smart Notifications",
    description: "Intelligent alert system with priority settings that delivers instant updates for classes and meetings.",
  },
  {
    icon: <Users size="1.75rem" />,
    title: "Role-Based Access",
    description: "Granular permission controls for students, teachers, parents, and administrators with custom workflows.",
  },
  {
    icon: <BarChart size="1.75rem" />,
    title: "Analytics Dashboard",
    description: "Real-time insights into engagement metrics, participation rates, and platform usage with exportable reports.",
  },
  {
    icon: <Globe size="1.75rem" />,
    title: "Multi-Tenant Architecture",
    description: "Dedicated and secure custom portal for each institution with branded experience and isolated data.",
  },


];