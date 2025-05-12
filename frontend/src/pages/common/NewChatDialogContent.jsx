import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  InputAdornment,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import NewGroupDialog from "./ NewGroupDialog"; // Adjust the import path as necessary
import { Key } from "lucide-react";

export default function NewChatDialogContent({ data, onStartChat,refetch }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const roles = [
    { key: "students", label: "Students" },
    { key: "teachers", label: "Teachers" },
    { key: "parents", label: "Parents" },
    {key: "admins", label: "Admins" },
  ];

  const filterUsers = (users = []) => {
    return users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <Box
      className="w-full sm:w-[600px] p-5 space-y-4"
      sx={{
        backgroundColor: "#ffffff",
        color: "#000000",
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Typography variant="h6" sx={{ color: "#1976d2" }}>
        New Chat
      </Typography>

      {/* Search Field */}
      <TextField
        fullWidth
        placeholder="Search name or email"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* New Group Button */}
      <Button
        fullWidth
        variant="contained"
        startIcon={<GroupIcon />}
        sx={{
          backgroundColor: "#1976d2",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
        onClick={() => setOpen(true)}
      >
        New Group
      </Button>

      <NewGroupDialog refetch={refetch} open={open} onClose={() => setOpen(false)} />

      {/* User List */}
      <Box className="max-h-[300px] overflow-y-auto pr-1">
        {roles.map(({ key, label }) => {
          const users = filterUsers(data[key]);
          if (users.length === 0) return null;

          return (
            <Box key={key} sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#1976d2", mb: 0.5 }}
              >
                {label}
              </Typography>
              <Divider sx={{ bgcolor: "#1976d2", mb: 1 }} />

              <List dense disablePadding>
                {users.map((user) => (
                  // console.log("user88888", user),
                  <ListItem
                    key={user._id}
                    button
                    onClick={() =>
                      onStartChat({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar, // Pass avatar
                        role: user.role,
                        publicKey: user.publicKey,
                      })
                    }
                    sx={{
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatar} alt={user.name}>
                        {user.name?.[0]}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography sx={{ color: "#000000" }}>
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: "#666666" }}>
                          {user.email}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}