import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Skeleton,
  Container,
  Grid,
  Fade,
  alpha,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useGetDashboardStatsQuery } from '../../store/api/api';
import Leftbar from '../common/Leftbar';
import { DoughnutChart, LineChart } from '../../helpers/chart.jsx';
import GroupIcon from '@mui/icons-material/Groups';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

const getInstitutionAndRoleFromPath = () => {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(Boolean);
  const institution = parts[0] || 'EduConnect';
  const role = parts[1] || 'guest';
  return { institution, role };
};

const Widget = ({ title, value, Icon, delay = 0 }) => {
  const theme = useTheme();
  
  return (
    <Fade in={true} style={{ transitionDelay: `${delay}ms` }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
          height: '100%',
          transition: 'transform 0.3s, box-shadow 0.3s',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '50%',
              width: 56,
              height: 56,
              mb: 1,
            }}
          >
            {React.cloneElement(Icon, { 
              sx: { color: theme.palette.primary.main, fontSize: 28 }
            })}
          </Box>
          <Typography variant="h4" sx={{ 
            color: theme.palette.primary.main, 
            fontSize: '2.2rem', 
            fontWeight: 700,
            lineHeight: 1 
          }}>
            {value ?? 0}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            {title}
          </Typography>
        </Stack>
      </Paper>
    </Fade>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  const { institution, role } = getInstitutionAndRoleFromPath();
  const { data, isLoading } = useGetDashboardStatsQuery({ subdomain: institution, role });
  console.log('Dashboard data:', data);
  const stats = data?.data || {
    totalUsers: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalParents: 0,
    totalStudents: 0,
    totalGroups: 0,
    totalMessages: 0,
    totalPrivateChats: 0,
    totalIndividualChats: 0,
    messagesLast7Days: new Array(7).fill(0),
  };

  // Add a subtle animation effect when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box width="100%" className="min-h-screen bg-slate-50 flex flex-row">
      {/* Sidebar */}
      <Box
        sx={{
          width: 70,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          bgcolor: theme.palette.primary.dark,
          zIndex: 1100,
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Leftbar />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          marginLeft: { xs: 0, md: '70px' },
          width: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9ff 100%)',
          minHeight: '100vh',
        }}
      >
        {isLoading ? (
          <Box sx={{ p: 3, width: '100%' }}>
            <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
            <Grid container spacing={3}>
              {[...Array(6)].map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, flex: 1 }} />
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, flex: 1 }} />
            </Box>
          </Box>
        ) : (
          <Container
            maxWidth="xl"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3 },
              marginLeft: { xs: 8, sm: 10, md: 5, lg: 5 },
              overflowY: 'auto',
              width: '100%',
            }}
          >
            <Fade in={true}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                mb={4}
                spacing={2}
                sx={{ 
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)', 
                  p: 3, 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: '12px',
                      p: 1.5,
                    }}
                  >
                    <DashboardIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    fontWeight="700" 
                    sx={{ 
                      fontSize: { xs: '1.7rem', md: '2.2rem' },
                      background: 'linear-gradient(90deg, #1565C0 0%, #3949AB 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Admin Dashboard
                  </Typography>
                </Stack>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  📅 {moment().format('dddd, D MMMM YYYY')}
                </Typography>
              </Stack>
            </Fade>

            <Fade in={true} style={{ transitionDelay: '100ms' }}>
              <Box 
                sx={{ 
                  mb: 4, 
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)', 
                  p: 2, 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ width: '100%' }}
                >
                  <Button
                    variant="contained"
                    fullWidth={isMobile}
                    onClick={() => navigate(`/${institution}/${role}/dashboard/users`)}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2)',
                      background: 'linear-gradient(45deg, #1565C0 0%, #3949AB 100%)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565C0 0%, #3949AB 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(21, 101, 192, 0.3)',
                      }
                    }}
                  >
                    Manage Users
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth={isMobile}
                    onClick={() => navigate(`/${institution}/${role}/dashboard/chats`)}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2)',
                      background: 'linear-gradient(45deg, #1565C0 0%, #3949AB 100%)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565C0 0%, #3949AB 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(21, 101, 192, 0.3)',
                      }
                    }}
                  >
                    Manage Chats
                  </Button>
                </Stack>
              </Box>
            </Fade>

            {/* Overview Widgets */}
            <Fade in={true} style={{ transitionDelay: '200ms' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: theme.palette.text.primary 
                }}
              >
                Platform Overview
              </Typography>
            </Fade>
            
            <Grid container spacing={3} mb={5}>
              <Grid item xs={12} sm={6} md={4}>
                <Widget 
                  title="Total Users" 
                  value={stats.totalUsers} 
                  Icon={<PersonIcon />} 
                  delay={300}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Widget 
                  title="Messages" 
                  value={stats.totalMessages} 
                  Icon={<MessageIcon />} 
                  delay={400}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Widget 
                  title="Admins" 
                  value={stats.totalAdmins} 
                  Icon={<AdminPanelSettingsIcon />} 
                  delay={500}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Widget 
                  title="Teachers" 
                  value={stats.totalTeachers} 
                  Icon={<SchoolIcon />} 
                  delay={600}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Widget 
                  title="Parents" 
                  value={stats.totalParents} 
                  Icon={<FamilyRestroomIcon />} 
                  delay={700}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Widget 
                  title="Students" 
                  value={stats.totalStudents} 
                  Icon={<PersonIcon />} 
                  delay={800}
                />
              </Grid>
            </Grid>

            {/* Analytics Title */}
            <Fade in={true} style={{ transitionDelay: '900ms' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: theme.palette.text.primary 
                }}
              >
                Analytics & Insights
              </Typography>
            </Fade>

            {/* Charts Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' }, 
                gap: 3,
                mb: 4
              }}
            >
              {/* Line Chart */}
              <Fade in={true} style={{ transitionDelay: '1000ms' }}>
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1.5,
                    p: 3,
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      pb: 1,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                  >
                    Message Activity (Last 7 Days)
                  </Typography>
                  <Box sx={{ height: { xs: 250, sm: 280, md: 300, lg: 320 }, mt: 2 }}>
                    <LineChart value={stats.messagesLast7Days} />
                  </Box>
                </Paper>
              </Fade>

              {/* Doughnut Chart */}
              <Fade in={true} style={{ transitionDelay: '1100ms' }}>
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      pb: 1,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                  >
                    Chat Distribution
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                    <DoughnutChart
                      labels={['Group Chats', 'Individual Chats']}
                      value={[stats.totalGroups || 0, stats.totalPrivateChats || 0]}
                    />
                  </Box>
                </Paper>
              </Fade>
            </Box>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;