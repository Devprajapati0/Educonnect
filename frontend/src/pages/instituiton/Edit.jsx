import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useGetInstituteProfileQuery,
  useUpdateInstituteProfileMutation
} from '../../store/api/api'
import {
  CircularProgress,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Container,
  Grid,
  Avatar,
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material'
import { Business, PhotoCamera, ArrowBack, Save } from '@mui/icons-material'
import toast from 'react-hot-toast'
import Header from './Header'

const EditInstitutionProfile = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetInstituteProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateInstituteProfileMutation()

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    type: '',
    subdomain: ''
  })

  const [image, setImage] = useState('')
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (data?.data?.institute) {
      const institute = data.data.institute
      setForm({
        fullname: institute.fullname || '',
        email: institute.email || '',
        type: institute.type || '',
        subdomain: institute.subdomain || ''
      })
      setImage(institute.logo || '')
    }
  }, [data])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handlePasswordChange = (field) => (e) => {
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (passwords.new && passwords.new !== passwords.confirm) {
      return toast.error('New passwords do not match')
    }

    try {
      const payload = {
        ...form,
        logo: image,
        ...(passwords.current && {
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      }

      const res = await updateProfile(payload).unwrap()
      toast.success('Profile updated successfully!')
      navigate('/profile')
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || 'Failed to update profile')
    }
  }

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress size={60} thickness={4} className="text-indigo-600" />
      </Box>
    )
  }

  if (isError || !data?.data?.institute) {
    toast.error(data?.message || 'Failed to fetch profile data')
    return (
      <Box className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Typography variant="h5" className="text-red-500 mb-4">Failed to load profile</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
        >
          Return to Dashboard
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Header />
      <Box className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-gray-100 py-10 px-4">
        <Container maxWidth="md">
          <Paper elevation={3} className="rounded-xl overflow-hidden">
            {/* Header Section */}
            <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-6 sm:px-10">
              <Typography variant="h4" className="text-white font-medium">
                Edit Institution Profile
              </Typography>
              <Typography variant="body1" className="text-blue-100 mt-1">
                Update your institution's information and settings
              </Typography>
            </Box>

            <Box className="px-6 py-8 sm:p-10">
              {/* Logo Upload Section */}
              <Box className="flex flex-col items-center mb-10">
                <Box className="relative">
                  <Avatar
                    src={image}
                    className="w-32 h-32 border-4 border-white shadow-lg bg-gray-100"
                    sx={{ width: 130, height: 130 }}
                  >
                    {!image && <Business sx={{ fontSize: 60 }} className="text-gray-400" />}
                  </Avatar>
                  <Tooltip title="Change Logo" arrow>
                    <IconButton
                      className="absolute bottom-0 right-0 bg-white shadow-md hover:bg-gray-100 border border-gray-200"
                      onClick={handleUploadClick}
                      size="small"
                      sx={{ 
                        padding: '8px',
                        backgroundColor: 'white'
                      }}
                    >
                      <PhotoCamera className="text-indigo-600" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </Box>
                <Typography variant="body2" className="mt-2 text-gray-500">
                  Click on the camera icon to upload a new logo
                </Typography>
              </Box>

              {/* Form Section */}
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Institution Name"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleChange('fullname')}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        className: "rounded-lg"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        className: "rounded-lg"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Institution Type"
                      name="type"
                      value={form.type}
                      onChange={handleChange('type')}
                      required
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        className: "rounded-lg"
                      }}
                    >
                      <MenuItem value="school">School</MenuItem>
                      <MenuItem value="university">University/College</MenuItem>
                      <MenuItem value="other">Other Educational Institution</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Subdomain"
                      name="subdomain"
                      value={form.subdomain}
                      fullWidth
                      disabled
                      variant="outlined"
                      helperText="Subdomain cannot be changed"
                      InputProps={{
                        className: "rounded-lg bg-gray-50"
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Password Section */}
                <Box className="mt-12 mb-6">
                  <Divider>
                    <Typography variant="h6" className="font-medium text-gray-700 px-3">
                      Security Settings
                    </Typography>
                  </Divider>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Current Password"
                      type="password"
                      value={passwords.current}
                      onChange={handlePasswordChange('current')}
                      fullWidth
                      variant="outlined"
                      autoComplete="current-password"
                      InputProps={{
                        className: "rounded-lg"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="New Password"
                      type="password"
                      value={passwords.new}
                      onChange={handlePasswordChange('new')}
                      fullWidth
                      variant="outlined"
                      autoComplete="new-password"
                      InputProps={{
                        className: "rounded-lg"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      value={passwords.confirm}
                      onChange={handlePasswordChange('confirm')}
                      fullWidth
                      variant="outlined"
                      autoComplete="new-password"
                      InputProps={{
                        className: "rounded-lg"
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Buttons */}
                <Box className="mt-10 flex flex-col sm:flex-row justify-end gap-3">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/profile')}
                    className="rounded-lg py-2.5 font-medium border-2"
                    sx={{ 
                      borderWidth: '1px',
                      py: 1.25,
                      px: 3,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-lg py-2.5 font-medium shadow-md bg-gradient-to-r from-blue-600 to-indigo-600"
                    startIcon={<Save />}
                    sx={{ 
                      py: 1.25,
                      px: 3,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)'
                    }}
                  >
                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default EditInstitutionProfile