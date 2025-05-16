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
  MenuItem
} from '@mui/material'
import { Business } from '@mui/icons-material'
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress size={40} />
      </div>
    )
  }

  if (isError || !data?.data?.institute) {
    toast.error(data?.message || 'Failed to fetch profile data')
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-gray-50">
        Failed to load profile.
      </div>
    )
  }

  return (<>

    <Header />
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-gray-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-6 md:mb-10">
          Edit Institution Profile
        </h1>

        {/* Logo Upload Section */}
        <div className="flex flex-col items-center gap-3 mb-8 sm:mb-10">
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-gray-300 overflow-hidden shadow-md cursor-pointer relative group"
            onClick={handleUploadClick}
          >
            {image ? (
              <img
                src={image}
                alt="Institution Logo"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-4xl">
                <Business fontSize="inherit" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          <Button variant="text" size="small" onClick={handleUploadClick}>
            {image ? 'Change Logo' : 'Upload Logo'}
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <TextField
            label="Full Name"
            name="fullname"
            value={form.fullname}
            onChange={handleChange('fullname')}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
            fullWidth
          />
          <TextField
            select
            label="Institution Type"
            name="type"
            value={form.type}
            onChange={handleChange('type')}
            required
            fullWidth
          >
            <MenuItem value="school">School</MenuItem>
            <MenuItem value="university">University/College</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            label="Subdomain"
            name="subdomain"
            value={form.subdomain}
            fullWidth
            disabled
          />

          {/* Password Section */}
          <div className="pt-6 border-t border-gray-200">
            <Typography variant="h6" gutterBottom className="text-gray-700 mb-2">
              Change Password
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Current Password"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange('current')}
                fullWidth
                autoComplete="current-password"
              />
              <TextField
                label="New Password"
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange('new')}
                fullWidth
                autoComplete="new-password"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange('confirm')}
                fullWidth
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/profile')}
              fullWidth={window.innerWidth < 640}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isUpdating}
              fullWidth={window.innerWidth < 640}
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default EditInstitutionProfile