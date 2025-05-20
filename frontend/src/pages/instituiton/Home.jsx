import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// MUI imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Container,
  Stack,
} from "@mui/material";

// Icons
import {
  School,
  People,
  SchoolOutlined,
  Security,
  VerifiedUser,
  Apartment,
  Visibility,
} from "@mui/icons-material";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #f0f4f8 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Header />

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        {/* Hero Section */}
        <Box 
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 6, md: 4 },
            mb: { xs: 8, md: 12 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ flex: 1, maxWidth: { md: "550px" } }}>
            <Typography
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "3.5rem",
                },
                lineHeight: 1.2,
                mb: 3,
                background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Connect Your Educational Community
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: "normal", lineHeight: 1.6 }}
            >
              EduConnect provides a secure, role-based communication platform for
              schools and universities. Connect students, teachers, parents, and
              administrators in one unified platform.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: { xs: 4, md: 0 } }}
            >
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                sx={{ 
                  borderRadius: "8px", 
                  px: 4, 
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    boxShadow: "0 15px 20px -3px rgba(59, 130, 246, 0.4)",
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Box>
          
          <Box 
            sx={{ 
              flex: 1, 
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Box
  sx={{
    width: "100%",
    maxWidth: "600px",
    height: "400px",
    backgroundImage: 'url("./public/image.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(59, 130, 246, 0.05)",
      borderRadius: "24px",
    },
  }}
/>
          </Box>
        </Box>

        {/* Institution Cards */}
        <Box sx={{ mb: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ 
              mb: 5,
              background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            For Every Educational Institution
          </Typography>
          
          <Box 
            sx={{ 
              display: "grid",
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "1fr 1fr", 
                md: "1fr 1fr 1fr" 
              },
              gap: 4,
            }}
          >
            <InstitutionCard
              icon={<School fontSize="large" color="primary" />}
              title="K-12 Schools"
              description="Connect teachers, students, and parents in a safe, monitored environment. Improve parent involvement and student outcomes."
            />

            <InstitutionCard
              icon={<SchoolOutlined fontSize="large" color="primary" />}
              title="Universities"
              description="Facilitate communication between professors, students, and departments. Streamline academic processes and enhance collaboration."
            />

            <InstitutionCard
              icon={<People fontSize="large" color="primary" />}
              title="Learning Centers"
              description="Manage student-tutor communications and scheduling. Keep parents informed and engaged in the learning process."
            />
          </Box>
        </Box>

        {/* Features Section */}
        <Box 
          sx={{ 
            mb: { xs: 8, md: 12 },
            px: { xs: 2, md: 4 },
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              backgroundImage: "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
              zIndex: -1,
            }
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ 
              mb: 5,
              background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Why Choose EduConnect?
          </Typography>
          
          <Box 
            sx={{ 
              display: "grid",
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "1fr 1fr", 
                md: "1fr 1fr 1fr 1fr" 
              },
              gap: 4,
            }}
          >
            <FeatureCard
              icon={<VerifiedUser color="primary" fontSize="large" />}
              title="Role-Based Access"
              description="Customized interfaces and permissions for students, teachers, parents, and administrators."
            />
            
            <FeatureCard
              icon={<Security color="primary" fontSize="large" />}
              title="Secure Communication"
              description="End-to-end encrypted messaging and calls with proper hierarchical restrictions."
            />
            
            <FeatureCard
              icon={<Apartment color="primary" fontSize="large" />}
              title="Multi-Tenant Architecture"
              description="Each institution gets their own secure instance with custom branding options."
            />
            
            <FeatureCard
              icon={<Visibility color="primary" fontSize="large" />}
              title="Comprehensive Monitoring"
              description="Administrators can oversee all communications to ensure a safe environment."
            />
          </Box>
        </Box>

        {/* Call to Action */}
        <Box 
          sx={{ 
            px: { xs: 2, md: 4 },
            py: { xs: 6, md: 8 },
            textAlign: "center",
            backgroundColor: "rgba(59, 130, 246, 0.03)",
            borderRadius: "24px",
            border: "1px solid rgba(59, 130, 246, 0.1)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ready to Transform Your Institution's Communication?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto", mb: 4, fontWeight: "normal" }}
          >
            Join thousands of educational institutions already using EduConnect
            to improve communication and collaboration.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
            sx={{ 
              borderRadius: "8px", 
              px: 5, 
              py: 1.5,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
              "&:hover": {
                boxShadow: "0 15px 20px -3px rgba(59, 130, 246, 0.4)",
                transform: "translateY(-2px)"
              },
              transition: "all 0.3s ease"
            }}
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
    <Card
      sx={{
        height: "100%",
        p: 4,
        borderRadius: "16px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        "&:hover": { 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", 
          transform: "translateY(-4px)",
          borderColor: "rgba(59, 130, 246, 0.3)",
        },
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ 
        mb: 3, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        width: "60px",
        height: "60px",
        borderRadius: "12px",
      }}>
        {icon}
      </Box>
      <CardContent sx={{ p: 0, flex: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 0, justifyContent: "flex-start" }}>
        <Button 
          size="medium" 
          variant="outlined" 
          sx={{ 
            borderRadius: "8px", 
            textTransform: "none",
            fontWeight: "medium",
            borderWidth: "2px",
            "&:hover": {
              borderWidth: "2px",
              backgroundColor: "rgba(59, 130, 246, 0.04)"
            }
          }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card
      sx={{
        height: "100%",
        p: 4,
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        "&:hover": { 
          transform: "translateY(-4px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box sx={{ 
        mb: 3, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        width: "50px",
        height: "50px",
        borderRadius: "10px",
      }}>
        {icon}
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}