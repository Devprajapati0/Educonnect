import React from 'react'
import {

  Typography,
  Button,
  Container,
  Grid,

  Box,
} from "@mui/material";
import {
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
// Footer Links
const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Security", href: "/security" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Compliance", href: "/compliance" },
      ],
    },
  ];

const Footer = () => {
  return (
    <Box bgcolor="grey.100" py={10} mt={10}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box bgcolor="primary.main" p={1} borderRadius={2}>
                  <GraduationCap size={20} color="white" />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  EduConnect
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Your trusted partner for secure and seamless educational communication.
              </Typography>
            </Grid>

            {footerLinks.map((section, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  {section.title}
                </Typography>
                <Box component="ul" p={0} m={0} listStyle="none" display="flex" flexDirection="column" gap={1}>
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Button component={Link} to={link.href} sx={{ color: "text.secondary", textTransform: "none", fontSize: "14px" }}>
                        {link.label}
                      </Button>
                    </li>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" color="text.secondary" align="center" mt={6}>
            © {new Date().getFullYear()} EduConnect. All rights reserved.
          </Typography>
        </Container>
        
      </Box>
  )
}

export default Footer