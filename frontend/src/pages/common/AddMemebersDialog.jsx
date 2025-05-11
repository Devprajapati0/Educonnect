import React, { useState, useEffect, Fragment } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Button,
  Slide,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
export default function AddMembersDialog({
    open,
    onClose,
    onAddMembers,
    allUsers = [],
    existingMembers = [],
    isLoading,
    isError
  }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState([]);
  
    // Combine all existing members initially
    useEffect(() => {
      if (open) {
        setSelected(existingMembers); // preload with all current members
        setSearchTerm('');
      }
    }, [open, existingMembers]);
  
    const handleToggle = (user) => {
      const exists = selected.some((u) => u._id === user._id);
      if (exists) {
        setSelected((prev) => prev.filter((u) => u._id !== user._id));
      } else {
        setSelected((prev) => [...prev, user]);
      }
    };
  
    const handleAdd = () => {
      onAddMembers(selected); // Final member list after selection
      onClose();
    };
  
    const filteredUsers = Array.isArray(allUsers)
      ? allUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
  
    const groupedByRole = filteredUsers.reduce((acc, user) => {
      const role = user.role || 'Others';
      if (!acc[role]) acc[role] = [];
      acc[role].push(user);
      return acc;
    }, {});
  
    return (
      <Dialog open={open} onClose={onClose} TransitionComponent={Transition} fullWidth maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': { borderRadius: 2, height: '60vh' }
        }}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#1976d2' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose}><CloseIcon /></IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">Manage Members</Typography>
            <Button color="inherit" onClick={handleAdd} disabled={selected.length === 0}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
  
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth placeholder="Search users" variant="outlined"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
  
          <List dense>
            {Object.entries(groupedByRole).map(([role, users]) => (
              <Fragment key={role}>
                <Typography variant="subtitle2" sx={{ pl: 1, mt: 2, color: 'gray' }}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}s
                </Typography>
                {isLoading && (
                  <Typography variant="body2" sx={{ pl: 1, color: 'gray' }}>
                    Loading {role}s...
                  </Typography>
                )}
                {isError && (
                  <Typography variant="body2" sx={{ pl: 1, color: 'red' }}>
                    Error fetching users
                  </Typography>
                )}
                {users.length === 0 && (
                  <Typography variant="body2" sx={{ pl: 1, color: 'gray' }}>
                    No {role}s found
                  </Typography>
                )}

                {users.map((user) => {
                  const isSelected = selected.some((u) => u._id === user._id);
                  return (
                    <ListItem
                      key={user._id}
                      button
                      onClick={() => handleToggle(user)}
                      sx={{ borderBottom: '1px solid #eee' }}
                    >
                      <ListItemAvatar><Avatar src={user.avatar || ''} /></ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={
                          isSelected
                            ? existingMembers.some((u) => u._id === user._id)
                              ? 'Will stay'
                              : 'Will be added'
                            : existingMembers.some((u) => u._id === user._id)
                              ? 'Will be removed'
                              : ''
                        }
                      />
                      <Checkbox
                        edge="end"
                        checked={isSelected}
                        onChange={() => handleToggle(user)}
                      />
                    </ListItem>
                  );
                })}
              </Fragment>
            ))}
          </List>
        </Box>
      </Dialog>
    );
  }