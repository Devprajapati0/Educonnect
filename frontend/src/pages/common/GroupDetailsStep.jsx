import React, { useState } from 'react';
import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Typography,
  Box,
  Switch,
} from '@mui/material';
import { ArrowBack, PhotoCamera } from '@mui/icons-material';

export default function GroupDetailsStep({
  selectedUsers = [],
  onBack,
  onCreate,
  groupName,
  setGroupName,
  onLoader
}) {
  console.log(onLoader)
  const [groupImage, setGroupImage] = useState(null);         // for preview
  const [groupImageFile, setGroupImageFile] = useState(null); // for backend

  const [allowAddMembers, setAllowAddMembers] = useState(true);
  const [allowSendMessages, setAllowSendMessages] = useState(true);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupImage(reader.result);   // preview URL
        setGroupImageFile(file);        // actual file for backend
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    onCreate({
      groupName,
      groupImage,       // optional: preview
      groupImageFile,   // send this to backend
      allowAddMembers,
      allowSendMessages,
      selectedUsers,
    });
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#ffffff', color: '#000000' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <IconButton onClick={onBack} sx={{ color: '#1976d2' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          New Group
        </Typography>
        <Button
          onClick={handleCreate}
          disabled={!groupName ||onLoader }
          sx={{ color: '#1976d2', textTransform: 'none' }}
        >
          {onLoader ? 'Creating...' : 'Create'}
        </Button>
      </Box>

      {/* Group Avatar and Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={groupImage}
            sx={{ width: 64, height: 64, bgcolor: '#eee' }}
          />
          <IconButton
            component="label"
            size="small"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <PhotoCamera fontSize="small" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          placeholder="Group name"
          variant="standard"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          InputProps={{
            sx: { fontSize: 18 },
          }}
        />
      </Box>

      {/* Toggle Settings */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid #ddd',
          }}
        >
          <Typography>Allow members to add members</Typography>
          <Switch
            checked={allowAddMembers}
            onChange={(e) => setAllowAddMembers(e.target.checked)}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid #ddd',
          }}
        >
          <Typography>Allow members to send messages</Typography>
          <Switch
            checked={allowSendMessages}
            onChange={(e) => setAllowSendMessages(e.target.checked)}
          />
        </Box>
      </Box>

      {/* Members */}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          MEMBERS:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {selectedUsers.map((user) => (
            <Box
              key={user._id}
              sx={{
                width: 60,
                textAlign: 'center',
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{ width: 40, height: 40, mx: 'auto' }}
              />
              <Typography variant="caption" noWrap>
                {user.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}