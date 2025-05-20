import React from 'react';
import { useGetInstituteProfileQuery } from '../../store/api/api';
import { 
  Avatar, 
  CircularProgress, 
  Paper, 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Container, 
  Grid, 
  Divider,
  Card,
  CardContent,
  Skeleton,
  Tooltip,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import RefreshIcon from '@mui/icons-material/Refresh';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetInstituteProfileQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data?.data) {
    toast.error(data?.message || 'Failed to fetch profile data');
    return <ErrorState onRetry={refetch} />;
  }

  const institute = data.data.institute;
  const admin = data.data.admin;

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <Box className="pt-6 pb-16 px-4">
        <Container maxWidth="lg">
          {/* Institution Header Card */}
          <Card 
            elevation={2} 
            className="mb-8 overflow-hidden transform transition-all duration-300 hover:shadow-lg"
          >
            <Box className="relative">
              {/* Header Background Banner */}
              <Box 
                className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"
              />
              
              {/* Institution Info */}
              <Box className="px-6 pb-6 pt-0 relative">
                <Box className="flex flex-col md:flex-row gap-6 items-center md:items-end -mt-12 md:-mt-16">
                  {/* Logo/Avatar */}
                  {institute.logo ? (
                    <Avatar
                      src={institute.logo}
                      alt="Institution Logo"
                      className="w-24 h-24 md:w-32 md:h-32 border-4 border-white ring-4 ring-blue-100 shadow-xl"
                      sx={{ width: {xs: 96, md: 128}, height: {xs: 96, md: 128} }}
                    />
                  ) : (
                    <Avatar
                      className="w-24 h-24 md:w-32 md:h-32 border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-blue-100 shadow-xl text-white"
                      sx={{ width: {xs: 96, md: 128}, height: {xs: 96, md: 128} }}
                    >
                      <Typography variant="h2">{institute.fullname[0]}</Typography>
                    </Avatar>
                  )}
                  
                  {/* Institution Name & Type */}
                  <Box className="flex flex-col items-center md:items-start flex-grow mt-4 md:mt-0">
                    <Typography variant="h4" className="font-bold text-gray-800 text-center md:text-left mb-1">
                      {institute.fullname}
                    </Typography>
                    <Chip 
                      label={institute.type} 
                      size="small" 
                      className="bg-blue-100 text-blue-800 capitalize font-medium"
                    />
                  </Box>
                  
                  {/* Edit Button */}
                  <Box className="mt-4 md:mt-0 md:self-center">
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate('/profile/edit')}
                      className="bg-blue-600 hover:bg-blue-700 font-medium px-6 py-2 shadow-md"
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>

          <Grid container spacing={4}>
            {/* Institution Details Card */}
            <Grid item xs={12} md={7}>
              <Card elevation={1} className="overflow-hidden transition-all duration-300 hover:shadow-md h-full">
                <CardContent>
                  <Box className="p-2">
                    <Box className="flex items-center justify-between mb-4">
                      <Typography variant="h5" className="font-bold flex items-center gap-2">
                        <SchoolIcon className="text-blue-600" />
                        Institution Details
                      </Typography>
                      <Tooltip title="Subscription status">
                        {institute.subscription?.isActive ? (
                          <Chip 
                            label="Active Subscription" 
                            size="small" 
                            color="success"
                            className="bg-green-100 text-green-800"
                          />
                        ) : (
                          <Chip 
                            label="Inactive Subscription" 
                            size="small"
                            color="error" 
                            className="bg-red-100 text-red-800"
                          />
                        )}
                      </Tooltip>
                    </Box>
                    <Divider className="mb-6" />

                    <Grid container spacing={4}>
                      <InfoItem 
                        icon={<EmailIcon className="text-blue-500" />}
                        label="Email Address" 
                        value={institute.email} 
                        xs={12} 
                        md={6}
                      />
                      <InfoItem 
                        icon={<LinkIcon className="text-blue-500" />}
                        label="Portal URL" 
                        value={
                          <Typography className="text-blue-600 font-medium break-words hover:underline cursor-pointer">
                            {institute.subdomain}.educonnect.com
                          </Typography>
                        } 
                        xs={12} 
                        md={6}
                      />
                      <InfoItem 
                        icon={<WorkspacePremiumIcon className="text-blue-500" />}
                        label="Current Plan" 
                        value={
                          <Typography className="font-semibold capitalize">
                            {institute.subscription?.plan || 'Free Plan'}
                          </Typography>
                        } 
                        xs={12} 
                        md={6}
                      />
                      <InfoItem 
                        icon={<CalendarTodayIcon className="text-blue-500" />}
                        label="Account Created" 
                        value={moment(institute.createdAt).format('MMMM Do YYYY')} 
                        xs={12} 
                        md={6}
                      />
                      
                      {institute.subscription?.startDate && (
                        <InfoItem 
                          icon={<CalendarTodayIcon className="text-blue-500" />}
                          label="Subscription Start" 
                          value={moment(institute.subscription.startDate).format('MMMM Do YYYY')} 
                          xs={12} 
                          md={6}
                        />
                      )}
                      {institute.subscription?.endDate && (
                        <InfoItem 
                          icon={<CalendarTodayIcon className="text-blue-500" />}
                          label="Subscription Ends" 
                          value={
                            <Box className="flex items-center">
                              <Typography className="font-semibold mr-2">
                                {moment(institute.subscription.endDate).format('MMMM Do YYYY')}
                              </Typography>
                              {moment().isAfter(institute.subscription.endDate) && (
                                <Chip 
                                  label="Expired" 
                                  size="small" 
                                  className="bg-red-100 text-red-800"
                                />
                              )}
                            </Box>
                          } 
                          xs={12} 
                          md={6}
                        />
                      )}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Admin Details Card */}
            <Grid item xs={12} md={5}>
              <Card elevation={1} className="overflow-hidden transition-all duration-300 hover:shadow-md h-full">
                <CardContent>
                  <Box className="p-2">
                    <Typography variant="h5" className="font-bold flex items-center gap-2 mb-4">
                      <PersonIcon className="text-blue-600" />
                      Administrator Information
                    </Typography>
                    <Divider className="mb-6" />

                    <Grid container spacing={4}>
                      <InfoItem 
                        icon={<PersonIcon className="text-blue-500" />}
                        label="Admin Name" 
                        value={admin.name || 'Not Provided'} 
                        xs={12}
                      />
                      <InfoItem 
                        icon={<EmailIcon className="text-blue-500" />}
                        label="Admin Email" 
                        value={admin.email} 
                        xs={12}
                      />
                      <InfoItem 
                        icon={<BadgeIcon className="text-blue-500" />}
                        label="Role" 
                        value={
                          <Chip 
                            label={admin.role} 
                            size="small" 
                            className="bg-indigo-100 text-indigo-800 capitalize font-medium"
                          />
                        } 
                        xs={12}
                      />
                      <InfoItem 
                        icon={<BadgeIcon className="text-blue-500" />}
                        label="Roll Number" 
                        value={admin.rollnumber} 
                        xs={12}
                      />
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

const InfoItem = ({ icon, label, value, xs = 6, md = 6 }) => (
  <Grid item xs={xs} md={md}>
    <Box className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300">
      <Box className="flex items-center gap-2 mb-1">
        {icon}
        <Typography variant="body2" className="text-gray-500 font-medium">
          {label}
        </Typography>
      </Box>
      <Box className="pl-8">
        {typeof value === 'string' ? (
          <Typography variant="body1" className="text-gray-900 font-semibold break-words">
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  </Grid>
);

const LoadingState = () => (
  <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
    <Container maxWidth="lg">
      <Card elevation={2} className="mb-8 overflow-hidden">
        <Box className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <Box className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <Skeleton variant="circular" width={128} height={128} />
          </Box>
        </Box>
        <Box className="px-6 pb-6 pt-16 flex flex-col items-center">
          <Skeleton variant="text" width="60%" height={40} className="mb-2" />
          <Skeleton variant="rectangular" width={100} height={24} />
        </Box>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card elevation={1} className="h-full">
            <CardContent>
              <Skeleton variant="text" width="40%" height={40} className="mb-4" />
              <Divider className="mb-6" />
              <Grid container spacing={4}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={12} md={6} key={i}>
                    <Skeleton variant="text" width="30%" height={24} className="mb-2" />
                    <Skeleton variant="text" width="80%" height={30} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card elevation={1} className="h-full">
            <CardContent>
              <Skeleton variant="text" width="60%" height={40} className="mb-4" />
              <Divider className="mb-6" />
              <Grid container spacing={4}>
                {[...Array(4)].map((_, i) => (
                  <Grid item xs={12} key={i}>
                    <Skeleton variant="text" width="30%" height={24} className="mb-2" />
                    <Skeleton variant="text" width="90%" height={30} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const ErrorState = ({ onRetry }) => (
  <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <Card elevation={3} className="max-w-md w-full p-8 text-center">
      <Box className="text-red-500 text-6xl mb-4 flex justify-center">
        <SchoolIcon fontSize="inherit" />
      </Box>
      <Typography variant="h5" className="font-bold text-gray-800 mb-2">
        Unable to Load Profile
      </Typography>
      <Typography variant="body1" className="text-gray-600 mb-6">
        We encountered a problem while retrieving your institution profile data.
      </Typography>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        className="bg-blue-600 hover:bg-blue-700"
        onClick={onRetry}
      >
        Try Again
      </Button>
    </Card>
  </Box>
);

export default Profile;