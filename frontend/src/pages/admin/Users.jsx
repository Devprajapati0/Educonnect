import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { useGetAllUsersforAdminQuery, useDeleteUserMutation } from '../../store/api/api';
import Leftbar from '../common/Leftbar';
import toast from 'react-hot-toast';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { deleteKey } from '../../helpers/key';
const getInstitutionAndRoleFromPath = () => {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter(Boolean);
  const institution = parts[0] || 'EduConnect';
  const role = parts[1] || 'guest';
  return { institution, role };
};

const UserManagement = () => {
  const { institution, role } = getInstitutionAndRoleFromPath();
  const { data, isLoading, refetch } = useGetAllUsersforAdminQuery({ subdomain: institution, role });
  const [deleteUser] = useDeleteUserMutation();
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const handleConfirmDelete = async () => {
    try {
     const res = await deleteUser({
        subdomain: institution,
        role: role,
        userId: selectedUser._id,
      });
      if(res.data.success){
        //delete privateKey fir indexDb
        await deleteKey("privateKey");

        toast.success('User deleted successfully');
      }
      else{
        toast.error("Error while Deleting User")
      }
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete user',error);
    }
  };

  const users = [
    ...(data?.data?.students || []),
    ...(data?.data?.teachers || []),
    ...(data?.data?.parents || []),
    ...(data?.data?.admins || []),
  ];

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row.name} />
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 230 },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="caption"
          color="primary"
          sx={{
            textTransform: 'capitalize',
            fontWeight: 600,
            px: 1,
            borderRadius: 1,
            bgcolor: '#e3f2fd',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => setSelectedUser(params.row)}
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
  <Typography variant="h4" fontWeight="bold">
    👥 User Management
  </Typography>
  <Button
    variant="outlined"
    startIcon={<ArrowBackIcon />}
    onClick={() => navigate(`/${institution}/${role}/dashboard`)}
  >
    Back to Dashboard
  </Button>
</Stack>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={users.map((user) => ({ id: user._id, ...user }))}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              autoHeight
              sx={{
                borderRadius: 2,
                bgcolor: 'white',
              }}
            />
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete user{' '}
            <strong>{selectedUser?.name}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUser(null)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserManagement;