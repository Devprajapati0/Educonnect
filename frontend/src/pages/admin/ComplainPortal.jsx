import React, { useState } from 'react';
import {  CheckCircle, MessageCircle, Calendar, School, CheckSquare, User } from 'lucide-react';
import moment from 'moment';
import Leftbar from '../common/Leftbar';
import { useGetComplaintsAssignedToMeQuery, useResolveComplaintMutation } from '../../store/api/api';
import { Cancel,Close,Visibility } from '@mui/icons-material';

const SIDEBAR_WIDTH = 70;

const StripHtmlPreview = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('img, video, audio, iframe').forEach(el => el.remove());
  return doc.body.textContent || "";
};

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  return {
    institution: parts[0] || "EduConnect",
    role: parts[1] || "guest"
  };
}

const AdminComplaintDashboard = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
  const [previewComplaint, setPreviewComplaint] = useState(null);
  const { institution, role } = getInstitutionAndRoleFromPath();

  const { data, isLoading, refetch } = useGetComplaintsAssignedToMeQuery(
    { subdomain: institution, role },
    {
      refetchOnMountOrArgChange: true,
      skip: !institution || !role,
    }
  );

  const [resolve] = useResolveComplaintMutation();
  const complaints = data?.data || [];

  const handleStatusChange = async (id, status) => {
    const response = await resolve({ subdomain: institution, role, complaintId: id, decision: status });
    if (response.data?.statuscode === 200) {
      setSnackbar({ 
        open: true, 
        message: `Complaint ${status.toLowerCase()}!`,
        type: status === 'approved' ? 'success' : 'error'
      });
      await refetch();
      setPreviewComplaint(null);
    } else {
      setSnackbar({ open: true, message: 'Failed to update complaint status', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <CheckSquare className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <Cancel className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Left Sidebar */}
      <div
        className="w-16 md:w-20 fixed top-0 left-0 h-screen bg-[#0e1c2f] border-r border-[#1f2937] z-40"
      >
        <Leftbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-16 md:ml-20 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Complaint Dashboard
          </h1>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map(({ _id, submittedBy: sender, content, status, createdAt, referToStudent: studentfor }) => (
              <div 
                key={_id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {/* Card header with avatar and name */}
                <div className="p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      {sender?.avatar ? (
                        <img 
                          src={sender?.avatar} 
                          alt={sender?.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{sender?.name}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{sender?.role}</span>
                        <span className="mx-1">•</span>
                        <span>{moment(createdAt).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Complaint preview */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {StripHtmlPreview(content).slice(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className="capitalize">{status}</span>
                    </div>
                    
                    <button 
                      className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors duration-200"
                      onClick={() => setPreviewComplaint({ sender, content, createdAt, status, studentfor })}
                    >
                      <Visibility className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Action buttons for pending complaints */}
                {status === 'pending' && (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <button 
                      className="px-3 py-1.5 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors flex items-center text-sm"
                      onClick={() => handleStatusChange(_id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button 
                      className="px-3 py-1.5 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors flex items-center text-sm"
                      onClick={() => handleStatusChange(_id, 'rejected')}
                    >
                      <Cancel className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && complaints.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl p-8">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No Complaints</h3>
            <p className="text-gray-500 text-center mt-2">You don't have any complaints assigned to you at the moment.</p>
          </div>
        )}

        {/* Snackbar notification */}
        {snackbar.open && (
          <div 
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              snackbar.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white max-w-sm transition-opacity duration-300`}
          >
            <span>{snackbar.message}</span>
            <button 
              onClick={() => setSnackbar({ open: false, message: '', type: '' })}
              className="ml-2 hover:bg-white/20 rounded-full p-1"
            >
              <Close className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Complaint Preview Dialog */}
        {previewComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              {/* Dialog Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <h2 className="font-bold text-lg text-gray-800">Complaint Details</h2>
                </div>
                <button 
                  onClick={() => setPreviewComplaint(null)}
                  className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                  <Close className="h-5 w-5" />
                </button>
              </div>
              
              {/* Dialog Content */}
              <div className="overflow-auto p-6 max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-4 mb-6">
                  {/* Complaint metadata */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Submitted by:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {previewComplaint?.sender?.avatar ? (
                      <img 
                        src={previewComplaint?.sender?.avatar} 
                        alt={previewComplaint?.sender?.name} 
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <span className="font-medium">{previewComplaint?.sender?.name}</span>
                    <span className="text-sm text-gray-500">({previewComplaint?.sender?.role})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Submitted on:</span>
                  </div>
                  <div className="text-gray-700">
                    {moment(previewComplaint?.createdAt).format("dddd, D MMM YYYY, h:mm A")}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <School className="h-4 w-4" />
                    <span className="text-sm font-medium">Submitted for:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {previewComplaint?.studentfor?.avatar ? (
                      <img 
                        src={previewComplaint?.studentfor?.avatar} 
                        alt={previewComplaint?.studentfor?.name} 
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <span className="font-medium">{previewComplaint?.studentfor?.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CheckSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Status:</span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(previewComplaint?.status)}`}>
                      {getStatusIcon(previewComplaint?.status)}
                      <span className="ml-1 uppercase">{previewComplaint?.status}</span>
                    </span>
                  </div>
                </div>
                
                <div className="h-px bg-gray-200 my-4"></div>
                
                {/* Complaint content */}
                <div 
  dangerouslySetInnerHTML={{ __html: previewComplaint?.content }}
  className="prose max-w-none p-4 bg-gray-50 rounded-lg text-gray-700"
  sx={{
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '1rem auto',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  }}
/>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintDashboard;