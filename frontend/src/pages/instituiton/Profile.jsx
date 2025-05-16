import React from 'react';
import { useGetInstituteProfileQuery } from '../../store/api/api';
import { Avatar, CircularProgress } from '@mui/material';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetInstituteProfileQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress size={40} />
      </div>
    );
  }

  if (isError || !data?.data) {
    toast.error(data?.message || 'Failed to fetch profile data');
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-gray-50">
        Failed to load profile.
      </div>
    );
  }

  const institute = data.data.institute;
  const admin = data.data.admin;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-10">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Institution Profile</h1>
            <button
              onClick={() => navigate('/profile/edit')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold"
            >
              Edit
            </button>
          </div>

          {/* Institution Info */}
          <SectionTitle title="Institution Details" />
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
            {institute.logo ? (
              <Avatar
                src={institute.logo}
                alt="Institution Logo"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                {institute.fullname[0]}
              </div>
            )}
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">{institute.fullname}</h2>
              <p className="text-sm text-gray-600 capitalize">{institute.type}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <InfoItem label="Email" value={institute.email} />
            <InfoItem
              label="Subdomain"
              value={<span className="text-blue-700 break-words">{institute.subdomain}.educonnect.com</span>}
            />
            <InfoItem
              label="Account Created"
              value={moment(institute.createdAt).format('MMMM Do YYYY')}
            />
            <InfoItem
              label="Plan"
              value={
                <>
                  <span className="capitalize">{institute.subscription?.plan || 'Free'}</span>{' '}
                  {institute.subscription?.isActive ? (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Inactive
                    </span>
                  )}
                </>
              }
            />
            {institute.subscription?.startDate && (
              <InfoItem
                label="Subscription Start"
                value={moment(institute.subscription.startDate).format('MMMM Do YYYY')}
              />
            )}
            {institute.subscription?.endDate && (
              <InfoItem
                label="Subscription Ends"
                value={moment(institute.subscription.endDate).format('MMMM Do YYYY')}
              />
            )}
          </div>

          {/* Admin Info */}
          <SectionTitle title="Admin Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem label="Name" value={admin.name || 'N/A'} />
            <InfoItem label="Email" value={admin.email} />
            <InfoItem label="Role" value={admin.role} />
            <InfoItem label="Roll Number" value={admin.rollnumber} />
          </div>
        </div>
      </div>
    </>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{label}</h3>
    <p className="text-gray-900 text-base font-semibold break-words">{value}</p>
  </div>
);

const SectionTitle = ({ title }) => (
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 border-b pb-1">{title}</h2>
);

export default Profile;