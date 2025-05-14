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
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

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
    <Box sx={{ display: 'flex' }}>
      <Leftbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {isLoading ? (
          <Skeleton variant="rectangular" height="90vh" />
        ) : (
          <Container maxWidth="xl">
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" fontWeight="bold">📊 Admin Dashboard</Typography>
              <Typography variant="subtitle2" color="gray">
                {moment().format('dddd, D MMMM YYYY')}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} mb={4}>
            <Button
  variant="contained"
  onClick={() => navigate(`/${institution}/${role}/dashboard/users`)}
>
  Users
</Button>

<Button
  variant="contained"
  onClick={() => navigate(`/${institution}/${role}/dashboard/chats`)}
>
  Chats
</Button>
            </Stack>

            {/* Overview Widgets */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}><Widget title="Total Users" value={stats.totalUsers} Icon={<PersonIcon />} /></Grid>
              
              <Grid item xs={12} sm={6} md={3}><Widget title="Messages" value={stats.totalMessages} Icon={<MessageIcon />} /></Grid>
      
              <Grid item xs={12} sm={6} md={3}><Widget title="Admins" value={stats.totalAdmins} Icon={<AdminPanelSettingsIcon />} /></Grid>
              <Grid item xs={12} sm={6} md={3}><Widget title="Teachers" value={stats.totalTeachers} Icon={<SchoolIcon />} /></Grid>
              <Grid item xs={12} sm={6} md={3}><Widget title="Parents" value={stats.totalParents} Icon={<FamilyRestroomIcon />} /></Grid>
              <Grid item xs={12} sm={6} md={3}><Widget title="Students" value={stats.totalStudents} Icon={<PersonIcon />} /></Grid>
            </Grid>

            {/* Charts Section */}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} justifyContent="center" alignItems="stretch" flexWrap="wrap">
              <Paper elevation={3} sx={{ flex: 1, p: 3, minWidth: 300, borderRadius: '1rem' }}>
                <Typography variant="h6" gutterBottom>Last 7 Days Messages</Typography>
                <LineChart value={stats.messagesLast7Days} />
              </Paper>

              <Paper
  elevation={3}
  sx={{
    flex: 1,
    p: 3,
    minWidth: 300,
    maxWidth: 360,
    borderRadius: '1rem',
    position: 'relative',
    height: 360, // ✅ Add height
  }}
>
                <Typography variant="h6" gutterBottom>Chat Types</Typography>
                <DoughnutChart
  labels={["Group Chats", "Individual Chats"]}
  value={[stats.totalGroups || 0, stats.totalPrivateChats || 0]}
/>
              </Paper>
            </Stack>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
