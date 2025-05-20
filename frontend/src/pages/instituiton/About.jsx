import React from "react";
import { Link } from "react-router-dom";
import { 
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  useTheme,
  alpha,
  Paper,
  Divider,
  Chip,
  useMediaQuery
} from "@mui/material";
import { 
  GraduationCap, 
  Users, 
  Shield, 
  Globe, 
  Heart, 
  Lightbulb,
  ChevronRight,
  Briefcase
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box 
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "5%",
          right: "-5%",
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, rgba(255,255,255,0) 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: { xs: 350, md: 600 },
          height: { xs: 350, md: 600 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.06)} 0%, rgba(255,255,255,0) 70%)`,
          zIndex: 0,
        }}
      />

      <Header />

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 10 }, position: "relative", zIndex: 1 }}>
        {/* Mission Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, sm: 10 } }}>
          <Chip 
            label="About Us" 
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
            variant={isMobile ? "h3" : "h2"} 
            component="h1" 
            fontWeight="800" 
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 30px rgba(0,0,0,0.05)",
            }}
          >
            Our Mission
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 800, 
              mx: "auto", 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            At EduConnect, we're dedicated to transforming educational communication by creating secure, 
            intuitive platforms that bring together students, teachers, parents, and administrators.
          </Typography>
        </Box>

        {/* Our Story Section */}
        <Paper
          elevation={0}
          sx={{
            mb: { xs: 6, sm: 10 },
            borderRadius: 4,
            overflow: "hidden",
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.07)}`,
          }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12} md={7} sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                Our Story
              </Typography>

              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  EduConnect was founded in 2018 by a team of technology innovators who recognized 
                  the need for better communication tools in educational settings.
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  After witnessing firsthand the challenges of coordinating between various stakeholders in education,
                  our founders set out to create a platform that would streamline communication while maintaining
                  appropriate boundaries and security.
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  What began as a simple messaging tool has evolved into a comprehensive communication platform serving
                  thousands of educational institutions worldwide, from small private schools to large public
                  universities.
                </Typography>
              </Box>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={5} 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: alpha(theme.palette.primary.main, 0.04),
                p: { xs: 4, sm: 6 },
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Background pattern */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.4,
                  backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.2)} 2px, transparent 2px)`,
                  backgroundSize: "30px 30px",
                }}
              />
              
              <Box sx={{ position: "relative", textAlign: "center" }}>
                <Box 
                  sx={{ 
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                  }}
                >
                  <GraduationCap size={60} color="white" />
                </Box>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                  2018
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Empowering better communication since
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Our Values Section */}
        <Box sx={{ mb: { xs: 6, sm: 10 } }}>
          <Typography variant="h4" fontWeight="700" align="center" gutterBottom>
            Our Values
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              maxWidth: 700, 
              mx: "auto", 
              mb: 6 
            }}
          >
            These core principles guide everything we do at EduConnect
          </Typography>

          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ValueCard
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        
  
      </Container>

      <Footer />
    </Box>
  );
}

// Custom components with enhanced UI
function ValueCard({ icon, title, description, index }) {
  const theme = useTheme();
  
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        p: 0,
        overflow: "hidden",
        transition: "all 0.3s ease",
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.07)",
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Box 
          sx={{ 
            color: "white",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
            borderRadius: 2,
            width: 60,
            height: 60,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${
              index % 3 === 0 ? theme.palette.primary.dark : 
              index % 3 === 1 ? theme.palette.secondary.main : 
              alpha(theme.palette.info.main, 0.9)
            } 100%)`,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="700" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function TeamMember({ name, role, bio, color }) {
  const theme = useTheme();
  
  // Create initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('');
  
  return (
    <Box 
      sx={{ 
        textAlign: "center",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
        }
      }}
    >
      <Avatar
        sx={{
          width: 120,
          height: 120,
          mx: "auto",
          mb: 2,
          fontSize: "2rem",
          fontWeight: "bold",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${color} 100%)`,
          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
          border: `4px solid ${alpha(theme.palette.background.paper, 0.9)}`,
        }}
      >
        {initials}
      </Avatar>
      <Typography variant="h6" fontWeight="600" gutterBottom>
        {name}
      </Typography>
      <Typography 
        variant="body2" 
        color="primary" 
        sx={{ 
          mb: 1,
          fontWeight: 500
        }}
      >
        {role}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, mx: "auto" }}>
        {bio}
      </Typography>
    </Box>
  );
}

// Data arrays
const values = [
  {
    icon: <Shield size={30} />,
    title: "Security & Privacy",
    description: "We prioritize the protection of sensitive educational data and communications, adhering to the highest standards of security and privacy."
  },
  {
    icon: <Users size={30} />,
    title: "Inclusivity",
    description: "We design our platform to be accessible and usable by all members of the educational community, regardless of role, ability, or technical expertise."
  },
  {
    icon: <Lightbulb size={30} />,
    title: "Innovation",
    description: "We continuously evolve our platform based on research, user feedback, and technological advancements to better serve our users."
  },
  {
    icon: <Heart size={30} />,
    title: "Empathy",
    description: "We approach every feature and decision with empathy for the diverse needs and challenges of educational stakeholders."
  },
  {
    icon: <Globe size={30} />,
    title: "Global Impact",
    description: "We strive to make quality educational communication tools accessible to institutions around the world, supporting educational excellence globally."
  },
  {
    icon: <GraduationCap size={30} />,
    title: "Educational Focus",
    description: "We maintain a laser focus on the unique needs of educational institutions, rather than adapting generic communication tools."
  }
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Technology innovator with 15 years in educational software development.",
    color: theme => theme.palette.secondary.main
  },
  {
    name: "Michael Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Software engineer with a passion for creating tools that enhance learning.",
    color: theme => theme.palette.info.main
  },
  {
    name: "James Wilson",
    role: "Chief Product Officer",
    bio: "Product strategist with expertise in educational technology solutions.",
    color: theme => theme.palette.success.main
  },
  {
    name: "Aisha Patel",
    role: "Head of Product",
    bio: "UX specialist focused on creating intuitive educational interfaces.",
    color: theme => theme.palette.warning.main
  },
  {
    name: "David Kim",
    role: "Head of Security",
    bio: "Cybersecurity expert specializing in educational data protection.",
    color: theme => theme.palette.error.main
  },
  {
    name: "Emily Johnson",
    role: "Customer Success Director",
    bio: "Dedicated to helping institutions implement EduConnect successfully.",
    color: theme => theme.palette.secondary.dark
  },
  {
    name: "Carlos Mendez",
    role: "Engineering Lead",
    bio: "Full-stack developer with expertise in scalable educational platforms.",
    color: theme => alpha(theme.palette.primary.main, 0.8)
  },
  {
    name: "Lisa Thompson",
    role: "Head of Marketing",
    bio: "Educational technology marketing specialist with a background in K-12 administration.",
    color: theme => theme.palette.info.dark
  }
];