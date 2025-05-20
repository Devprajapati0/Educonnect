import React from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper, 
  useTheme, 
  alpha, 
  Chip, 
  Divider,
  useMediaQuery
} from "@mui/material";
import { 
  Check, 
  Star, 
  Shield, 
  Users, 
  MessageSquare, 
  Video, 
  Award, 
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PricingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Extended features list with icons
  const features = [
    { 
      text: "Unlimited users and messages", 
      icon: <Users size={18} />,
      highlighted: true
    },
    { 
      text: "End-to-end encrypted messaging", 
      icon: <Shield size={18} />,
      highlighted: true
    },
    { 
      text: "Custom role-based permissions", 
      icon: <MessageSquare size={18} />,
      highlighted: true
    },
    {
      text: "Dashboard analytics and reporting",
      icon: <Star size={18} />,
      highlighted: true
    },
    { 
      text: "File sharing up to 10GB", 
      icon: <Clock size={18} />,
      highlighted: true
    },
  ];

  return (
    <Box 
      sx={{
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 1)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: "5%",
          width: { xs: 250, md: 400 },
          height: { xs: 250, md: 400 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.07)} 0%, rgba(255,255,255,0) 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "8%",
          width: { xs: 200, md: 350 },
          height: { xs: 200, md: 350 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.06)} 0%, rgba(255,255,255,0) 70%)`,
          zIndex: 0,
        }}
      />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          py: { xs: 6, md: 10 },
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Pricing Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Chip 
            label="Pricing" 
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
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 30px rgba(0,0,0,0.05)",
            }}
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              mx: "auto", 
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            One powerful plan to connect your entire educational community
          </Typography>
        </Box>
        
        {/* Pricing Card */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: 500,
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            transform: "translateY(0)",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            position: "relative",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: `0 30px 60px ${alpha(theme.palette.common.black, 0.15)}`,
            }
          }}
        >
          {/* Pricing Card Header */}
          <Box 
            sx={{ 
              position: "relative",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              p: { xs: 3, md: 4 },
              textAlign: "center",
              overflow: "hidden"
            }}
          >
            {/* Background decoration */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                opacity: 0.1,
                backgroundImage: `radial-gradient(circle at 25% 25%, white 0%, transparent 15%), 
                                  radial-gradient(circle at 75% 75%, white 0%, transparent 15%)`,
              }}
            />
            
            {/* Most Popular tag */}
            <Chip 
              label="Most Popular" 
              size="small"
              color="secondary"
              sx={{ 
                position: "absolute",
                top: 16,
                right: 16,
                fontWeight: 600,
                fontSize: "0.75rem",
                opacity: 0.9
              }}
            />
            
            <Typography variant="h5" fontWeight="700" mb={1}>
              EduConnect Pro Plan
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
              Everything you need for school communication
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
              <Typography 
                component="span" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: "2.5rem", md: "3rem" },
                  lineHeight: 1
                }}
              >
                $499
              </Typography>
              <Typography 
                component="span" 
                sx={{ 
                  ml: 1,
                  fontSize: "1rem",
                  opacity: 0.8
                }}
              >
                / month
              </Typography>
            </Box>
          </Box>
          
          {/* Card Content */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Features List */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="600" 
                sx={{ 
                  mb: 2,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Star size={18} style={{ marginRight: 8 }} />
                Included Features
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {features.map((feature, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      background: feature.highlighted ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                      border: feature.highlighted ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}` : "none",
                    }}
                  >
                    <Box 
                      sx={{ 
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                        p: 0.5,
                        background: theme.palette.primary.main,
                        flexShrink: 0
                      }}
                    >
                      <Check size={14} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.primary"
                        fontWeight={feature.highlighted ? 600 : 400}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Additional Benefits */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: "center" }}>
                <strong>All plans include:</strong> Free setup, 24/7 technical support, 99.9% uptime guarantee
              </Typography>
            </Box>
            
            {/* CTA Button */}
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                "&:hover": {
                  boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                }
              }}
            >
              Get Started Now
            </Button>
            
            {/* Additional Information */}
            <Typography variant="caption" color="text.secondary" align="center" sx={{ display: "block", mt: 2 }}>
              Try risk-free with our 30-day money-back guarantee
            </Typography>
          </Box>
        </Paper>
        
        {/* Trust Section */}
        <Box sx={{ mt: { xs: 6, md: 8 }, textAlign: "center", maxWidth: 700 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Trusted by leading educational institutions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Over 500+ schools and 100,000+ users across North America
          </Typography>
        </Box>
      </Container>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
}