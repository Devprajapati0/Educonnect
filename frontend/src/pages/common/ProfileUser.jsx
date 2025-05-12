import React, { useEffect, useState } from 'react';
import { useGetUserProfileQuery } from '../../store/api/api';
import {
  CircularProgress,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Leftbar } from '../admin/Leftbar';
import axios from 'axios';

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

  const { data, refetch, isError } = useGetUserProfileQuery({
    subdomain: institutions,
    role,
  });

  const info = data?.data;

  useEffect(() => {
    if (info) {
      setEditData({ name: info.name || '', avatar: info.avatar || '' });
    }
  }, [info]);

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-gray-50">
  //       <CircularProgress size={40} />
  //     </div>
  //   );
  // }

  if (isError || !data?.data) {
    
    if(data) {
    toast.error(data?.message);}
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-gray-50">
        Failed to load profile.
      </div>
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Leftbar />
      <div className="flex-1 overflow-auto pl-0 md:pl-46 pr-4 md:pr-8 pt-32 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

          {/* Profile Info */}
          <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-900">Your Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="flex justify-center pr-16 mb-6">
              <Avatar
                alt={info.name}
                src={info.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 36,
                  bgcolor: info.avatar ? 'transparent' : '#3B82F6',
                }}
              >
                {!info.avatar && info.name?.[0]?.toUpperCase()}
              </Avatar>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  <div className="flex items-center">
    <InfoItem label="Name" value={info.name} />
    <span className="ml-2 inline-flex items-center gap-1 bg-green-200 text-green-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-green-300">
      <svg
        className="w-2 h-2 fill-green-600"
        viewBox="0 0 8 8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="4" r="4" />
      </svg>
      {info.role.charAt(0).toUpperCase() + info.role.slice(1)}
    </span>
  </div>

              <InfoItem label="Email" value={info.email} />
              {info.rollnumber && <InfoItem label="Roll Number" value={info.rollnumber} />}
              <InfoItem label="Created At" value={moment(info.createdAt).format('MMMM D, YYYY')} />
              {info.role === 'student' && (
                <>
                  <InfoItem label="Batch" value={info.batch} />
                  <InfoItem label="Year" value={info.year} />
                  <InfoItem label="Department" value={info.department} />
                </>
              )}
              {info.role === 'teacher' && (
                <>
                  <InfoItem label="Department" value={info.department} />
                  <InfoItem label="Subjects" value={info.subjects?.join(', ')} />
                </>
              )}
              {info.role === 'parent' && (
                <>
                  <InfoItem label="Parent of (Name)" value={info.parentofname} />
                  <InfoItem label="Parent of (Email)" value={info.parentofemail} />
                </>
              )}
            </div>

            <hr className="my-4 border-gray-200" />

            {info.institution && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Institution</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem label="Institution Name" value={info.institution.fullname} />
                  <InfoItem label="Email" value={info.institution.email} />
                  <InfoItem
                    label="Subdomain"
                    value={
                      <a
                        href={`https://${info.institution.subdomain}.educonnect.com`}
                        className="text-blue-700 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {info.institution.subdomain}.educonnect.com
                      </a>
                    }
                  />
                  <InfoItem label="Created At" value={moment(info.institution.createdAt).format('MMMM D, YYYY')} />
                </div>
              </div>
            )}
          </div>

          {/* Edit Section */}
          {isEditing && (
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Edit Profile</h2>

              <div className="flex justify-center items-center mb-6 relative">
                <Avatar
                  alt={editData.name}
                  src={selectedAvatar || editData.avatar || info.avatar}
                  sx={{ width: 120, height: 120, fontSize: 40, bgcolor: "transparent" }}
                >
                  {!selectedAvatar && !editData.avatar && editData.name?.[0]?.toUpperCase()}
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute right-30 top-28 w-8 h-8 bg-white border-blue-500 rounded-full flex items-center justify-center text-blue-500 cursor-pointer"
                >
                  📷
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              {selectedAvatar && (
                <button className="text-red-600 text-sm mt-2" onClick={handleResetAvatar}>
                  Reset Avatar
                </button>
              )}

              <div className="flex flex-col mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <TextField
                  fullWidth
                  value={editData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  variant="outlined"
                  size="small"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="mb-4">
    <h4 className="text-sm font-medium text-gray-600">{label}</h4>
    <p className="text-base text-gray-800">{value || 'N/A'}</p>
  </div>
);

export default ProfileUser;