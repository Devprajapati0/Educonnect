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

export default function FeaturesPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header */}
        <Header />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" mb={2}>
          Powerful Features for Educational Communication
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
          EduConnect offers an all-in-one suite of secure, smart tools to enhance collaboration across your institution.
        </Typography>
      </Container>

      {/* Features */}
      <Container maxWidth="xxl" sx={{ py: 10 }}>
  <Grid container spacing={4} justifyContent="center">
    {features.map((feature, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card
          sx={{
            height: "100%", // Equal height for cards
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center align the content inside card
            textAlign: "center",  // Center align text
            p: 4,
            borderRadius: 3,
            backgroundColor: "background.paper",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // Subtle shadow
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)", // Enhanced shadow on hover
            },
          }}
        >
          <Box
            sx={{
              color: "primary.main",
              mb: 2,
              fontSize: 40, // Adjust icon size
            }}
          >
            {feature.icon}
          </Box>
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
  <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box
          bgcolor="background.paper"
          borderRadius={4}
          boxShadow={3}
          p={6}
          textAlign="center"
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Ready to Transform Your Institution?
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="500px" mx="auto" mb={4}>
            Get started with EduConnect and empower communication like never before.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button size="large" variant="contained" color="primary" component={Link} to="/signup">
              Get Started
            </Button>
            <Button size="large" variant="outlined" color="primary" component={Link} to="/demo">
              Request Demo
            </Button>
          </Box>
        </Box>
      </Container>
</Container>

      {/* Footer */}
       <Footer />
    </Box>
  );
}


// Features Data
const features = [
  { icon: <MessageSquare size={40} />, title: "Secure Messaging", description: "End-to-end encrypted messaging with role-based permissions." },
  { icon: <Video size={40} />, title: "Video Conferencing", description: "High-quality virtual classes and meetings." },
  { icon: <Shield size={40} />, title: "Administrative Oversight", description: "Comprehensive monitoring for safe communication." },
  { icon: <Bell size={40} />, title: "Smart Notifications", description: "Instant alerts for updates and meetings." },
  { icon: <Users size={40} />, title: "Role-Based Access", description: "Custom permissions for students, teachers, and parents." },
  { icon: <BarChart size={40} />, title: "Analytics Dashboard", description: "Track engagement and platform usage smartly." },
  { icon: <Globe size={40} />, title: "Multi-Tenant Architecture", description: "Each institution has its secure custom portal." },
  { icon: <Lock size={40} />, title: "Data Privacy Compliance", description: "Built for FERPA, GDPR, and educational standards." },
  { icon: <GraduationCap size={40} />, title: "Learning Tools Integration", description: "Seamless LMS integrations for better learning." },
];

