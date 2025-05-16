import React, { useState } from 'react';
import {
  Box, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, IconButton, Stack, Avatar, Drawer, useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Leftbar from '../common/Leftbar';
import {
  useGetAllChatsofAlluserQuery,
  useDeleteChatMutation,
  useRemoveMemberFromChatMutation
} from '../../store/api/api';
import { deleteKey } from '../../helpers/key.js';

const getInstitutionAndRoleFromPath = () => {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(Boolean);
  return { institution: parts[0] || 'EduConnect', role: parts[1] || 'guest' };
};

const drawerWidth = 70;

const ChatManagement = () => {
  const { institution, role } = getInstitutionAndRoleFromPath();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, isLoading, refetch } = useGetAllChatsofAlluserQuery({
    subdomain: institution,
    role,
  });

  const [deleteChat] = useDeleteChatMutation();
  const [removeMember] = useRemoveMemberFromChatMutation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [openMembersDialog, setOpenMembersDialog] = useState(false);

  const chats = [
    ...(data?.data?.chats || []),
    ...(data?.data?.groups || []),
  ];

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await deleteChat({ chatId, subdomain: institution, role });
      if (res.data.success) {
        await deleteKey("privateKey");
        toast.success("Chat deleted successfully");
      } else {
        toast.error("Error while deleting chat");
      }
      refetch();
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  const handleRemoveMember = async (chatId, memberId) => {
    try {
      const res = await removeMember({ chatId, memberId, subdomain: institution, role });
      if (res.data.statuscode === 200) {
        toast.success(res.data.message || "Member removed successfully");
      } else {
        toast.error(res.data.message);
      }
      refetch();
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const columns = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.row.groupchat ? params.row.avatar : params.row.creator?.avatar}
          alt={params.row.groupchat ? params.row.name : params.row.creator?.fullname}
          sx={{ width: 40, height: 40 }}
        >
          {!params.row.groupchat && params.row.creator?.fullname?.charAt(0)}
          {params.row.groupchat && params.row.name?.charAt(0)}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'name', headerName: 'Chat Name', flex: 1 },
    {
      field: 'creator.fullname',
      headerName: 'Creator',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.groupchat ? params.row.creator?.fullname : '-'}
        </Typography>
      ),
    },
    {
      field: 'groupchat',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Typography variant="caption" color="primary">
          {params.row.groupchat ? "Group" : "Private"}
        </Typography>
      ),
    },
    {
      field: 'members',
      headerName: 'Members',
      width: 120,
      renderCell: (params) =>
        params.row.groupchat ? (
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedChat(params.row);
              setOpenMembersDialog(true);
            }}
          >
            <PeopleAltIcon />
          </IconButton>
        ) : (
          "-"
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteChat(params.row._id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Fixed Sidebar */}
      <Drawer
        variant="permanent"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#0e1c2f',
            borderRight: '1px solid #1f2937',
            position: 'fixed',
            height: '100vh',
            top: 0,
            left: 0,
          },
        }}
      >
        <Leftbar />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          ml: ` sm :${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            💬 Chat Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/${institution}/${role}/dashboard`)}
          >
            Back to Dashboard
          </Button>
        </Stack>

        {/* Data Table */}
        {isLoading ? (
          <Typography>Loading chats...</Typography>
        ) : (
          <Box sx={{ width: '100%' }}>
            <DataGrid
              rows={chats.map((chat) => ({ id: chat._id, ...chat }))}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              autoHeight
              disableSelectionOnClick
              sx={{
                borderRadius: 2,
                bgcolor: 'white',
              }}
            />
          </Box>
        )}

        {/* Members Dialog */}
        <Dialog open={openMembersDialog} onClose={() => setOpenMembersDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Group Members</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              {selectedChat?.members?.map((member) => {
                const isAdmin = selectedChat?.isAdmin?.includes(member._id);
                return (
                  <Stack
                    key={member._id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={member.avatar}>
                        {!member.avatar && member.name?.charAt(0)}
                      </Avatar>
                      <Typography>
                        {member.name}{' '}
                        {isAdmin && (
                          <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#065f46',
                            fontSize: '0.75rem',
                            padding: '4px 8px',
                            borderRadius: '9999px',
                            border: '1px solid #bbf7d0',
                            marginLeft: '8px'
                          }}>
                            Admin
                          </span>
                        )}
                      </Typography>
                    </Stack>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveMember(selectedChat._id, member._id)}
                    >
                      Remove
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMembersDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ChatManagement;