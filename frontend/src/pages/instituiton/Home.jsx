import React from "react";
import { Button, Card, CardContent, CardActions, CardHeader, Typography } from "@mui/material";
import { School, People, SchoolOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f5f5f5, #e0e0e0)" }}>
    <Header />

      <main style={{ padding: "60px 40px" }}>
        <section style={{ textAlign: "center", marginBottom: "80px" }}>
          <Typography variant="h2" gutterBottom>Connect Your Educational Community</Typography>
          <Typography variant="h6" color="textSecondary" style={{ maxWidth: "700px", margin: "20px auto" }}>
            EduConnect provides a secure, role-based communication platform for schools and universities. Connect students, teachers, parents, and administrators in one unified platform.
          </Typography>
          <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "20px" }}>
            <Button component={Link} to="/signup" variant="contained" size="large">Get Started</Button>
            <Button component={Link} to="/demo" variant="outlined" size="large">Request Demo</Button>
          </div>
        </section>

        <section style={{ marginBottom: "80px" }}>
          <Typography variant="h4" align="center" gutterBottom>For Every Educational Institution</Typography>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginTop: "40px" }}>
            <InstitutionCard 
              icon={<School style={{ fontSize: 50, color: "#1976d2" }} />} 
              title="K-12 Schools" 
              description="Connect teachers, students, and parents in a safe, monitored environment. Improve parent involvement and student outcomes." 
            />
            <InstitutionCard 
              icon={<SchoolOutlined style={{ fontSize: 50, color: "#1976d2" }} />} 
              title="Universities" 
              description="Facilitate communication between professors, students, and departments. Streamline academic processes and enhance collaboration." 
            />
            <InstitutionCard 
              icon={<People style={{ fontSize: 50, color: "#1976d2" }} />} 
              title="Learning Centers" 
              description="Manage student-tutor communications and scheduling. Keep parents informed and engaged in the learning process." 
            />
          </div>
        </section>

        <section style={{ marginBottom: "80px" }}>
          <Typography variant="h4" align="center" gutterBottom>Why Choose EduConnect?</Typography>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "40px" }}>
            <FeatureCard 
              title="Role-Based Access" 
              description="Customized interfaces and permissions for students, teachers, parents, and administrators." 
            />
            <FeatureCard 
              title="Secure Communication" 
              description="End-to-end encrypted messaging and calls with proper hierarchical restrictions." 
            />
            <FeatureCard 
              title="Multi-Tenant Architecture" 
              description="Each institution gets their own secure instance with custom branding options." 
            />
            <FeatureCard 
              title="Comprehensive Monitoring" 
              description="Administrators can oversee all communications to ensure a safe environment." 
            />
          </div>
        </section>

        <section style={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>Ready to Transform Your Institution's Communication?</Typography>
          <Typography variant="h6" color="textSecondary" style={{ maxWidth: "700px", margin: "20px auto" }}>
            Join thousands of educational institutions already using EduConnect to improve communication and collaboration.
          </Typography>
          <Button component={Link} to="/signup" variant="contained" size="large" style={{ marginTop: "30px" }}>
            Sign Up Your Institution
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InstitutionCard({ icon, title, description }) {
  return (
    <Card style={{ textAlign: "center", padding: "20px" }}>
      <CardHeader title={icon} style={{ textAlign: "center" }} />
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="textSecondary">{description}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "center" }}>
        <Button size="small" variant="outlined">Learn More</Button>
      </CardActions>
    </Card>
  );
}

function FeatureCard({ title, description }) {
  return (
    <Card style={{ padding: "20px" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="textSecondary">{description}</Typography>
      </CardContent>
    </Card>
  );
}
