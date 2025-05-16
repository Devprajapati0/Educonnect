import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Skeleton,
  Container,
  Grid,
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

const getInstitutionAndRoleFromPath = () => {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(Boolean);
  const institution = parts[0] || 'EduConnect';
  const role = parts[1] || 'guest';
  return { institution, role };
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: '1rem',
      width: '100%',
      maxWidth: '20rem',
      textAlign: 'center',
    }}
  >
    <Stack alignItems="center" spacing={2}>
      <Typography sx={{ color: 'blue', fontSize: '2rem', fontWeight: 'bold' }}>
        {value ?? 0}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        {Icon}
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

const Dashboard = () => {
  const navigate = useNavigate();
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

  return (
<Box width="100%" className="min-h-screen bg-gray-100 flex flex-row">
       <Box
        sx={{
          width: 70, // match with Leftbar width
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          bgcolor: '#0e1c2f',
          zIndex: 1100, // keep it on top
          borderRight: '1px solid #1f2937',
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
          marginLeft: { xs: 0, md: '70px',lg:'70px' }, // Adjust margin for Leftbar
          width: '100%',
          display: 'flex',
        }}
      >
        {isLoading ? (
          <Skeleton variant="rectangular" height="90vh" />
        ) : (
          <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            p: { xs: 0.5, sm: 2 },
            marginLeft: { xs: 8, sm: 10, md: 5,lg:5 }, // Adjust margin for Leftbar
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mb={4}
            spacing={2}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
              📊 Admin Dashboard
            </Typography>
            <Typography variant="subtitle2" color="gray">
              {moment().format('dddd, D MMMM YYYY')}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            mb={4}
            
            sx={{ width: '100%' }}
          >
            <Button
              variant="contained"
              fullWidth={isMobile}
              onClick={() => navigate(`/${institution}/${role}/dashboard/users`)}
            >
              Users
            </Button>
            <Button
              variant="contained"
              fullWidth={isMobile}
              onClick={() => navigate(`/${institution}/${role}/dashboard/chats`)}
            >
              Chats
            </Button>
          </Stack>

          {/* Overview Widgets */}
          <Grid container spacing={2} mb={4} mt={2}>
            <Grid item xs={12} sm={4} md={3}><Widget title="Total Users" value={stats.totalUsers} Icon={<PersonIcon />} /></Grid>
            <Grid item xs={12} sm={4} md={3}><Widget title="Messages" value={stats.totalMessages} Icon={<MessageIcon />} /></Grid>
            <Grid item xs={12} sm={4} md={3}><Widget title="Admins" value={stats.totalAdmins} Icon={<AdminPanelSettingsIcon />} /></Grid>
            <Grid item xs={12} sm={4} md={3}><Widget title="Teachers" value={stats.totalTeachers} Icon={<SchoolIcon />} /></Grid>
            <Grid item xs={12} sm={4} md={3}><Widget title="Parents" value={stats.totalParents} Icon={<FamilyRestroomIcon />} /></Grid>
            <Grid item xs={12} sm={4} md={3}><Widget title="Students" value={stats.totalStudents} Icon={<PersonIcon />} /></Grid>
          </Grid>

          {/* Charts Section */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="stretch"
            flexWrap="wrap"
            mt={2}
            gap={2}
            marginLeft={{ xs: 0,sm:10, md: '70px',lg:'70px' }} // Adjust margin for Leftbar
          >
            {/* Line Chart */}
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                p: 2,
                minWidth: { xs: '100%', sm: 200 },
                maxWidth: { md: '100%', lg: '48%' },
                borderRadius: '1rem',
                mb: { xs: 2, md: 0 },
              }}
            >
              <Typography variant="h6" gutterBottom>
                Last 7 Days Messages
              </Typography>
              <Box sx={{height: { xs: 180, sm: 220, md: 250, lg: 300 }}}>
                <LineChart value={stats.messagesLast7Days} />
              </Box>
            </Paper>

            {/* Doughnut Chart */}
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                p: 2,
                minWidth: { xs: '100%', sm: 300 },
                maxWidth: { md: '100%', lg: 360 },
                borderRadius: '1rem',
                height: { xs: 300, sm: 340, md: 360 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
             
              }}
            >
              <Typography variant="h6" gutterBottom>
                Chat Types
              </Typography>
              <Box sx={{ flex: 1 }}>
                <DoughnutChart
                  labels={['Group Chats', 'Individual Chats']}
                  value={[stats.totalGroups || 0, stats.totalPrivateChats || 0]}
                />
              </Box>
            </Paper>
          </Stack>
        </Container>
      )}
      </Box>
    </Box>
  );
};

export default Dashboard;
