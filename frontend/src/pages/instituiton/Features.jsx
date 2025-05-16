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
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// ...imports remain the same

export default function FeaturesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 10 }, textAlign: "center" }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          mb={2}
        >
          Powerful Features for Educational Communication
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", px: { xs: 2, sm: 0 } }}
        >
          EduConnect offers an all-in-one suite of secure, smart tools to enhance collaboration across your institution.
        </Typography>
      </Container>

      {/* Features */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, sm: 10 } }}>
        <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  px: { xs: 3, sm: 4 },
                  py: { xs: 4, sm: 5 },
                  borderRadius: 3,
                  backgroundColor: "background.paper",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 10 } }}>
          <Box
            bgcolor="background.paper"
            borderRadius={4}
            boxShadow={3}
            p={{ xs: 4, sm: 6 }}
            textAlign="center"
          >
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" mb={2}>
              Ready to Transform Your Institution?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto", mb: 4, px: { xs: 2, sm: 0 } }}
            >
              Get started with EduConnect and empower communication like never before.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                size="large"
                variant="contained"
                color="primary"
                component={Link}
                to="/signup"
                fullWidth={isMobile}
              >
                Get Started
              </Button>
              <Button
                size="large"
                variant="outlined"
                color="primary"
                component={Link}
                to="/demo"
                fullWidth={isMobile}
              >
                Request Demo
              </Button>
            </Stack>
          </Box>
        </Container>
      </Container>

      <Footer />
    </Box>
  );
}

// Features Data
const features = [
  {
    icon: <MessageSquare size="2.5rem" />,
    title: "Secure Messaging",
    description: "End-to-end encrypted messaging with role-based permissions.",
  },
  {
    icon: <Video size="2.5rem" />,
    title: "Video Conferencing",
    description: "High-quality virtual classes and meetings.",
  },
  {
    icon: <Shield size="2.5rem" />,
    title: "Administrative Oversight",
    description: "Comprehensive monitoring for safe communication.",
  },
  {
    icon: <Bell size="2.5rem" />,
    title: "Smart Notifications",
    description: "Instant alerts for updates and meetings.",
  },
  {
    icon: <Users size="2.5rem" />,
    title: "Role-Based Access",
    description: "Custom permissions for students, teachers, and parents.",
  },
  {
    icon: <BarChart size="2.5rem" />,
    title: "Analytics Dashboard",
    description: "Track engagement and platform usage smartly.",
  },
  {
    icon: <Globe size="2.5rem" />,
    title: "Multi-Tenant Architecture",
    description: "Each institution has its secure custom portal.",
  },
  {
    icon: <Lock size="2.5rem" />,
    title: "Data Privacy Compliance",
    description: "Built for FERPA, GDPR, and educational standards.",
  },
  {
    icon: <GraduationCap size="2.5rem" />,
    title: "Learning Tools Integration",
    description: "Seamless LMS integrations for better learning.",
  },
];