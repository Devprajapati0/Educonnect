import React, { useEffect, useState } from 'react';
import { useGetUserProfileQuery } from '../../store/api/api';
import {
  CircularProgress,
  Avatar,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  Tooltip,
  alpha,
} from '@mui/material';
import moment from 'moment';
import toast from 'react-hot-toast';
import Leftbar from '../common/Leftbar';
import axios from 'axios';
import { motion } from 'framer-motion';

// Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const StatusDot = ({ active = true }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: active ? 'success.main' : 'grey.500',
      mr: 1,
    }}
  />
);

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(Boolean);
  const institutions = parts[0] || 'EduConnect';
  const role = parts[1] || 'guest';
  return { institutions, role };
}

const ProfileUser = () => {
  const { institutions, role } = getInstitutionAndRoleFromPath();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [editData, setEditData] = useState({ name: '', avatar: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data, refetch, isError } = useGetUserProfileQuery({ subdomain: institutions, role });
  const info = data?.data;

  useEffect(() => {
    if (info) {
      setEditData({ name: info.name || '', avatar: info.avatar || '' });
    }
  }, [info]);

  useEffect(() => {
    if (isError || (data && !data?.data)) {
      toast.error(data?.message || 'Failed to load profile.');
    }
  }, [isError, data]);

  if (isError || !data?.data) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'grey.50',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Typography color="error" variant="h6">
            Failed to load profile.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResetAvatar = () => {
    setSelectedAvatar(null);
  };

  const handleSave = async () => {
    const updatedData = {
      ...editData,
      avatar: selectedAvatar || editData.avatar,
    };

    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/v1/${institutions}/${role}/update-user-profile`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || 'Profile updated successfully');
        await refetch();
        setIsEditing(false);
        setSelectedAvatar(null);
      } else {
        toast.error(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ name: info.name, avatar: info.avatar });
    setSelectedAvatar(null);
  };

  // Role-specific color schemes
  const getRoleColor = (userRole) => {
    switch(userRole) {
      case 'student': return { bg: '#4F46E5', light: '#EEF2FF' };
      case 'teacher': return { bg: '#059669', light: '#ECFDF5' };
      case 'parent': return { bg: '#D97706', light: '#FEF3C7' };
      case 'admin': return { bg: '#7C3AED', light: '#F3E8FF' };
      default: return { bg: '#3B82F6', light: '#EFF6FF' };
    }
  };

  const roleColor = getRoleColor(info.role);
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
      <Box
        sx={{
          width: 70,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          bgcolor: '#111827',
          zIndex: 1100,
          borderRight: '1px solid rgba(31, 41, 55, 0.2)',
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Leftbar />
      </Box>

      <Container maxWidth="xl" sx={{ pl: { xs: '70px', sm: '82px' }, pt: 4, pb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ py: 3 }}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              User Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage your personal information and account settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Profile Card */}
            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      py: '6px',
                      bgcolor: isEditing ? 'grey.700' : 'primary.main',
                      '&:hover': {
                        bgcolor: isEditing ? 'grey.800' : 'primary.dark',
                      },
                    }}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>

                <Box
                  sx={{
                    height: 120,
                    bgcolor: roleColor.bg,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
                  }}
                />

                <Box
                  sx={{
                    mt: -8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    alt={info.name}
                    src={info.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid white',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      fontSize: 40,
                      bgcolor: info.avatar ? 'transparent' : roleColor.bg,
                    }}
                  >
                    {!info.avatar && info.name?.[0]?.toUpperCase()}
                  </Avatar>
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      {info.name}
                    </Typography>
                    
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={<StatusDot />}
                        label={info.role.charAt(0).toUpperCase() + info.role.slice(1)}
                        size="small"
                        sx={{
                          bgcolor: roleColor.light,
                          color: roleColor.bg,
                          fontWeight: 600,
                          '& .MuiChip-icon': { ml: 1 },
                          borderRadius: '8px',
                          px: 0.5,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        • {moment(info.createdAt).format('MMMM YYYY')}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                      {info.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mx: 3 }} />

                <CardContent sx={{ px: 3, py: 4 }}>
                  <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                    Personal Information
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <InfoItemGrid label="Email" value={info.email} />
                    {info.rollnumber && <InfoItemGrid label="Roll Number" value={info.rollnumber} />}
                    <InfoItemGrid label="Joined" value={moment(info.createdAt).format('MMMM D, YYYY')} />

                    {info.role === 'student' && (
                      <>
                        <InfoItemGrid label="Batch" value={info.batch} />
                        <InfoItemGrid label="Department" value={info.department} />
                      </>
                    )}
                    
                    {info.role === 'teacher' && <InfoItemGrid label="Department" value={info.department} />}
                    
                    {info.role === 'parent' && (
                      <>
                        <InfoItemGrid label="Parent of" value={info.parentofname} />
                        <InfoItemGrid label="Student Email" value={info.parentofemail} />
                      </>
                    )}
                  </Grid>

                  {info.institution && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                          Institution Details
                        </Typography>
                        
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <InfoItemGrid label="Institution Name" value={info.institution.fullname} />
                          <InfoItemGrid label="Institution Email" value={info.institution.email} />
                          <InfoItemGrid
                            label="Website"
                            value={
                              <Typography
                                component="a"
                                href={`https://${info.institution.subdomain}.educonnect.com`}
                                sx={{
                                  color: 'primary.main',
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' },
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {info.institution.subdomain}.educonnect.com
                              </Typography>
                            }
                          />
                          <InfoItemGrid
                            label="Established"
                            value={moment(info.institution.createdAt).format('MMMM D, YYYY')}
                          />
                        </Grid>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Edit Profile Card */}
            {isEditing && (
              <Grid item xs={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom textAlign="center">
                        Edit Your Profile
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                        Update your personal information
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            alt={editData.name}
                            src={selectedAvatar || editData.avatar || info.avatar}
                            sx={{
                              width: 120,
                              height: 120,
                              border: '4px solid',
                              borderColor: alpha(roleColor.bg, 0.2),
                              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                              fontSize: 40,
                              bgcolor: roleColor.bg,
                            }}
                          >
                            {!selectedAvatar && !editData.avatar && editData.name?.[0]?.toUpperCase()}
                          </Avatar>
                          
                          <Tooltip title="Change profile picture" arrow placement="bottom">
                            <IconButton
                              component="label"
                              htmlFor="avatar-upload"
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                bgcolor: 'background.paper',
                                border: '2px solid',
                                borderColor: 'divider',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                '&:hover': {
                                  bgcolor: 'background.paper',
                                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                },
                              }}
                            >
                              <CameraIcon />
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                hidden
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      {selectedAvatar && (
                        <Box sx={{ textAlign: 'center', mt: -2, mb: 3 }}>
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            onClick={handleResetAvatar}
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            Reset Avatar
                          </Button>
                        </Box>
                      )}

                      <TextField
                        label="Full Name"
                        value={editData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                          mb: 4,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            disabled={isLoading}
                            sx={{
                              borderRadius: 2,
                              py: 1.5,
                              textTransform: 'none',
                              fontWeight: 600,
                              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                            }}
                          >
                            {isLoading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="inherit"
                            onClick={handleCancel}
                            sx={{
                              borderRadius: 2,
                              py: 1.5,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderColor: 'divider',
                              color: 'text.secondary',
                            }}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

// Enhanced InfoItem component with grid support
const InfoItemGrid = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body1" color="text.primary" fontWeight={500}>
      {value || 'N/A'}
    </Typography>
  </Grid>
);

export default ProfileUser;