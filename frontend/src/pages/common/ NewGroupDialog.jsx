// NewGroupDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Avatar,
  TextField,
  IconButton,
  Typography,
  Box,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import GroupDetailsStep from "./GroupDetailsStep";
import { useCreateGroupChatMutation, useGetUserForGroupsQuery } from "../../store/api/api";
import toast from "react-hot-toast";
import { setAvatar } from "../../store/slice/chatSlice.js";
import { useDispatch } from "react-redux";

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);

  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";

  return { institution, role };
}

export default function NewGroupDialog({refetch, open, onClose }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [nextStep, setNextStep] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");

  const { institution, role } = getInstitutionAndRoleFromPath();

  const { data, isLoading, isError } = useGetUserForGroupsQuery(
    { subdomain: institution, role },
    { skip: !open }
  );

  const contacts = data?.data || [];
  console.log("contacts", contacts);

  const filteredContacts = contacts.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedContacts = filteredContacts.reduce((groups, contact) => {
    const userRole = contact.role || "Others";
    if (!groups[userRole]) groups[userRole] = [];
    groups[userRole].push(contact);
    return groups;
  }, {});

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };
  const [createGroupChat] = useCreateGroupChatMutation();
  const dispatch = useDispatch()
  const handleNext = () => setNextStep(true);
  const handleBack = () => setNextStep(false);
  const handleCreate = async(groupData) => {
     console.log("Group data:", groupData);
     dispatch(setAvatar({
          image:groupData.groupImage,
          chatId:"",
          name:groupData.groupName
        }))
    const members = groupData.selectedUsers.map((user) => ( {
      _id: user._id,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
      publicKey: user.publicKey,
    }));
    // const image = groupData.groupImage || null;
    const data={
        name: groupData.groupName,
        description: null,
        subdomain: institution,
        role,
        members: members,
        groupchat: true,
        addmembersallowed: groupData.allowAddMembers,
        sendmessageallowed: groupData.allowSendMessages,
        avatar: groupData.groupImage || null,
    }
     console.log("data", data)
    createGroupChat(data)
    .unwrap()
    .then((response) => {
      console.log("Chat created successfully:", response);
      if(response.success == false){
        return toast.error(response.message);
      }
      toast.success(response.message);
      // setFlag(!flag);
    })
    .catch((error) => {
      console.error("Error creating chat:", error);
      toast.error("Error creating chat");
    });
    setGroupName("");
    setSelectedUsers([]);
    setNextStep(false);
    onClose();
    await refetch();
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error fetching contacts</Typography>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#ffffff",
          color: "#000000",
        },
      }}
    >
      {!nextStep ? (
        <>
          <DialogTitle
            sx={{
              p: 0,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            <Typography variant="body1">Add Members</Typography>
            <Button
              onClick={handleNext}
              disabled={selectedUsers.length === 0}
              sx={{ color: "#1976d2", textTransform: "none" }}
            >
              Next
            </Button>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <TextField
              fullWidth
              placeholder="Search name"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {selectedUsers.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  mb: 2,
                }}
              >
                {selectedUsers.map((user) => (
                  <Box
                    key={user._id}
                    sx={{ width: 64, position: "relative", textAlign: "center" }}
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{ width: 56, height: 56, mx: "auto", backgroundColor: "#ccc" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => toggleUser(user)}
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        backgroundColor: "#555",
                        color: "#fff",
                        width: 20,
                        height: 20,
                        "&:hover": { backgroundColor: "#333" },
                      }}
                    >
                      <Close fontSize="small" sx={{ fontSize: "14px" }} />
                    </IconButton>
                    <Typography variant="caption" noWrap sx={{ mt: 0.5 }}>
                      {user.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Divider sx={{ mb: 1 }} />
            <Box sx={{ maxHeight: 300, overflowY: "auto", pr: 1 }}>
              {filteredContacts.length === 0 ? (
                <Typography sx={{ textAlign: "center", color: "gray", mt: 4 }}>
                  No current users available
                </Typography>
              ) : (
                Object.entries(groupedContacts).map(([role, users]) => (
                  <Box key={role} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "gray", mb: 1 }}>
                      {role}
                    </Typography>
                    {users.map((user) => (                                              
                      <Box
                        key={user._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1,
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                        onClick={() => toggleUser(user)}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar src={user.avatar} />
                          <Typography>{user.name}</Typography>
                        </Box>
                        <input
                          type="checkbox"
                          checked={selectedUsers.some((u) => u._id === user._id)}
                          readOnly
                        />
                      </Box>
                    ))}
                  </Box>
                ))
              )}
            </Box>
          </DialogContent>
        </>
      ) : (
        <GroupDetailsStep
          selectedUsers={selectedUsers}
          onBack={handleBack}
          onCreate={handleCreate}
          groupName={groupName}
          setGroupName={setGroupName}
        />
      )}
    </Dialog>
  );
}
