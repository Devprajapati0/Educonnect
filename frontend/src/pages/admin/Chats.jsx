import React, { useState } from 'react';
import {
  Box, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, IconButton, Stack, Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/People';
import toast from 'react-hot-toast';
import { useGetAllChatsofAlluserQuery, useDeleteChatMutation, useRemoveMemberFromChatMutation } from '../../store/api/api';
import Leftbar from '../common/Leftbar';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { deleteKey } from '../../helpers/key.js';

const getInstitutionAndRoleFromPath = () => {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(Boolean);
  return { institution: parts[0] || 'EduConnect', role: parts[1] || 'guest' };
};

const ChatManagement = () => {
  const { institution, role } = getInstitutionAndRoleFromPath();
  const navigate = useNavigate();

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
     console.log("Deletechatres",res);
     if(res.data.success){
      //delete privateKey fir indexDb
      await deleteKey("privateKey");
      toast.success("Chat deleted successfully");

     }
        else{
            toast.error("Error while Deleting Chat")
            }
      refetch();
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  const handleRemoveMember = async (chatId, memberId) => {
    try {
      const res =await removeMember({ chatId, memberId, subdomain: institution, role });
      console.log("mmeberremove",res)
      if(res.data.statuscode == 200){
        toast.success(res.data.message || "memeber removed successfully");
      }
      else{
      toast.error(res.data.message);}
      refetch();
    } catch {
      toast.error( "Failed to remove member");
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
        <Typography variant="body2">{ params.row.groupchat &&  params.row.creator?.fullname || '-'}</Typography>
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
    <Box sx={{ display: 'flex' }}>
      <Leftbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
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

        {/* Table */}
        {isLoading ? (
          <Typography>Loading chats...</Typography>
        ) : (
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={chats.map((chat) => ({ id: chat._id, ...chat }))}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              autoHeight
              disableSelectionOnClick
              sx={{ borderRadius: 2, bgcolor: "white" }}
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
        <Avatar src={member.avatar || '/path/to/default-avatar.png'}>
          {!member.avatar && member.name?.charAt(0)}
        </Avatar>
        <Typography>
          {member.name} {isAdmin && (<span className="ml-2 inline-flex items-center gap-1 bg-green-200 text-green-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-green-300">
      <svg
        className="w-2 h-2 fill-green-600"
        viewBox="0 0 8 8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="4" r="4" />
      </svg>
      Admin
    </span>)}
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