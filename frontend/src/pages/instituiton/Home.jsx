import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { School, People, SchoolOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Home() {
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f5f5f5, #e0e0e0)" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={10}>
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
                lg: "3.5rem",
              },
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            Connect Your Educational Community
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="700px"
            mx="auto"
            mb={4}
          >
            EduConnect provides a secure, role-based communication platform for schools and universities.
            Connect students, teachers, parents, and administrators in one unified platform.
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
            <Button component={Link} to="/signup" variant="contained" size="large">
              Get Started
            </Button>
            <Button component={Link} to="/demo" variant="outlined" size="large">
              Request Demo
            </Button>
          </Box>
        </Box>

        {/* Institution Cards */}
        <Box mb={10}>
          <Typography variant="h4" align="center" gutterBottom>
            For Every Educational Institution
          </Typography>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} sm={6} md={4}>
              <InstitutionCard
                icon={<School sx={{ fontSize: 50, color: "primary.main" }} />}
                title="K-12 Schools"
                description="Connect teachers, students, and parents in a safe, monitored environment. Improve parent involvement and student outcomes."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InstitutionCard
                icon={<SchoolOutlined sx={{ fontSize: 50, color: "primary.main" }} />}
                title="Universities"
                description="Facilitate communication between professors, students, and departments. Streamline academic processes and enhance collaboration."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InstitutionCard
                icon={<People sx={{ fontSize: 50, color: "primary.main" }} />}
                title="Learning Centers"
                description="Manage student-tutor communications and scheduling. Keep parents informed and engaged in the learning process."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Why Choose Section */}
        <Box mb={10}>
          <Typography variant="h4" align="center" gutterBottom>
            Why Choose EduConnect?
          </Typography>
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                title="Role-Based Access"
                description="Customized interfaces and permissions for students, teachers, parents, and administrators."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                title="Secure Communication"
                description="End-to-end encrypted messaging and calls with proper hierarchical restrictions."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                title="Multi-Tenant Architecture"
                description="Each institution gets their own secure instance with custom branding options."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard
                title="Comprehensive Monitoring"
                description="Administrators can oversee all communications to ensure a safe environment."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Ready to Transform Your Institution's Communication?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="700px"
            mx="auto"
            mb={4}
          >
            Join thousands of educational institutions already using EduConnect to improve communication and collaboration.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
          >
            Sign Up Your Institution
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

function InstitutionCard({ icon, title, description }) {
  return (
    <Card sx={{ textAlign: "center", height: "100%" }}>
      <CardHeader title={icon} sx={{ textAlign: "center" }} />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button size="small" variant="outlined">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

function FeatureCard({ title, description }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}