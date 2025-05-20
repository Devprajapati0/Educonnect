import React, { useState,useRef,useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Box,
  Stack,
  Divider,
  IconButton,
  styled,
  Button,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Paper,
    DialogTitle,
    DialogActions,
    Checkbox,
    CircularProgress,
    FormControlLabel, Switch,
    Grid,


} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useDeleteChatMutation, useExitGroupMutation, useGetChatDetailQuery, useGetChatMediaQuery, useGetUserForGroupsQuery, useUpDateChatDetailMutation } from "../../store/api/api";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import toast from "react-hot-toast";
import { setAvatar } from "../../store/slice/chatSlice";
import { useNavigate } from "react-router-dom";
import AddMembersDialog from "./AddMemebersDialog";



const TopDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: 0,
    top: 0,
    position: "absolute",
    borderRadius: "0 0 10px 10px",
    width: "100%",
    maxWidth: "600px",
    left: "50%",
    transform: "translateX(-50%)",
  },
}));

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  return {
    institution: parts[0] || "EduConnect",
    role: parts[1] || "guest",
  };
}
const UpdateGroupInfoDialog = ({ open, onClose, avatar, name, id }) => {
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState(name || "");
    const [groupImage, setGroupImage] = useState(avatar || "");
    const [uploading, setUploading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef = useRef(null);
    const { institution, role } = getInstitutionAndRoleFromPath();
    const [updateGroup, { isLoading }] = useUpDateChatDetailMutation();
  
    const handleCancel = () => {
      onClose();
      setGroupName(name);
      setGroupImage(avatar);
    };
  
    const handleDone = async () => {
      if (!groupName.trim()) return;
      try {
        const data = {
          name: groupName,
          avatar: groupImage || null,
          chatId: id,
        };
  
        const res = await updateGroup({
          data,
          subdomain: institution,
          role,
        }).unwrap();
        console.log("res", res);
  
        if (res.success === false) {
          toast.error(res.message || "Failed to update group info");
          return;
        }
  
        dispatch(setAvatar({
          image: res.data.avatar,
          chatId: id,
          name: groupName,
          _id: id,
          isGroup: true,
        }));
  
        toast.success(res.message || "Group updated successfully");
        onClose();
      } catch (error) {
        console.error("Failed to update group info", error);
        toast.error("Update failed. Please try again.");
      }
    };
  
    const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
  
    const handleChangePhoto = (type) => {
      if (type === "upload") {
        fileInputRef.current.click();
      } else {
        setGroupImage("");
      }
      handleCloseMenu();
    };
  
    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
    //   setUploading(true)
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupImage(reader.result);
      };
      reader.readAsDataURL(file);
    };
  
    return (
      <TopDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent sx={{ p: 0, bgcolor: "#1E1E1E" }}>
          <Box p={2} color="white">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Edit group
              </Typography>
              <Box>
                <Button onClick={handleCancel} color="#111827">Cancel</Button>
                <Button onClick={handleDone} color="#111827" disabled={isLoading }>
  {(isLoading ) ? <CircularProgress size={20}  /> : "Done"}
</Button>
              </Box>
            </Stack>
  
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
              <Avatar src={groupImage} sx={{ width: 80, height: 80, mb: 1 }} />
              <Button
  variant="contained"
  size="small"
  onClick={handleOpenMenu}
  disabled={uploading}
  sx={{
    textTransform: "none",
    bgcolor: "#2C2C2C",
    color: "white",
    borderRadius: "8px",
    px: 2,
    "&:hover": { bgcolor: "#3A3A3A" },
  }}
>
   Add photo ▾
</Button>
  
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{ sx: { bgcolor: "#2C2C2C", color: "white" } }}
              >
                <MenuItem onClick={() => handleChangePhoto("upload")}>Upload photo</MenuItem>
                <MenuItem onClick={() => handleChangePhoto("remove")}>Remove photo</MenuItem>
              </Menu>
  
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </Box>
  
            <Box mt={4}>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name"
                style={{
                  backgroundColor: "#2C2C2C",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  width: "100%",
                  fontSize: "16px",
                }}
              />
            </Box>
          </Box>
        </DialogContent>
      </TopDialog>
    );
};
  

const ChatInfoDialog = ({ open, onClose, isGroup, avatar, name, _id,refetch:listRefetch }) => {
  const [tab, setTab] = useState(0);
  const [openInfo, setOpenInfo] = useState(false);
  const navigate = useNavigate();
  
  const { institution, role } = getInstitutionAndRoleFromPath();

  const { data: chatDetail,refetch } = useGetChatDetailQuery({
    chatId: _id,
    subdomain: institution,
    role,
  });
  const [deleteChat,{ isLoading: isLoadingDeleteChat }] = useDeleteChatMutation()
  const [updateGroup] = useUpDateChatDetailMutation();

  const [exitGroup, { isLoading: isLoadingExitGroup }] = useExitGroupMutation();
  const [confirmOpen, setConfirmOpen] = useState(false); // dialog state
  const [selectedUsers, setSelectedUsers] = useState([]); // For selected users
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: allUsers,
    isLoading: isLoadingAllUsers,
    isError: isErrorAllUsers,
  } = useGetUserForGroupsQuery(
    { subdomain: institution, role },
    { skip: !isDialogOpen } // fetch only when dialog is open
  );

  const allUsersList = allUsers || [];
  // console.log("secete",selectedUsers)
//   console.log("allUsersList", allUsersList)
  console.log("cahtData", chatDetail?.data)
const handleUpdateMembers = async (updatedMembers) => {
  // console.log("updatedMembers", updatedMembers)
    const data = {
      chatId: _id, // your current chat ID
      members: updatedMembers.map((u) => ({
        _id: u._id,
        name: u.name,
        role: u.role,
        avatar: u.avatar,
        publicKey: u.publicKey,
      })),
    };

    console.log("data", data)
  
    try {
      const res = await updateGroup({
        data,
        subdomain: institution,
        role,
      }).unwrap();
  
      if (res.success === false) {
        return toast.error(res.message || "Failed to update members");
      }
  
      toast.success("Group members updated");
      refetch(); // refresh chat detail
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Something went wrong");
    }
  };




// const { _id, members = [], isAdmin = [] } = selectedChat || {}; // destructure from chat
const currentUser = useSelector((state) => state.auth.user)
const members = chatDetail?.data?.members || [];
//  console.log("members", members)
// const filteredMembers = members.filter(m => m._id !== currentUser._id);
//  console.log("filteredMembers", chatDetail?.data?.addmembersallowed )

const creator = chatDetail?.data?.creator || {};
const isAdmin = chatDetail?.data?.isAdmin?.includes(currentUser._id);
const [addMembersAllowed, setAddMembersAllowed] = useState(chatDetail?.data?.addmembersallowed||false );
//  console.log(addMembersAllowed)

const [sendMessageAllowed, setSendMessageAllowed] = useState(chatDetail?.data?.sendmessageallowed||false );
// console.log("filteredMembers", chatDetail?.data?.sendmessageallowed )
// console.log(sendMessageAllowed) got 
const [adminDialogOpen, setAdminDialogOpen] = useState(false);
const [selectedAdmins, setSelectedAdmins] = useState([]);
const [activeTab, setActiveTab] = useState(0);

useEffect(() => {
  if (chatDetail?.data) {
    setAddMembersAllowed(chatDetail.data.addmembersallowed || false);
    setSendMessageAllowed(chatDetail.data.sendmessageallowed || false);
  }
}, [chatDetail?.data]);

const {
  data: mediaMessagesData,
  refetch: refetchMediaMessages,
  isLoading: isLoadingMediaMessages,
} = useGetChatMediaQuery({
  chatId: _id,
  subdomain: institution,
  role,
}, {
  skip: tab !== 1 || !_id, // Don't auto-fetch unless needed
});

useEffect(() => {
    if (tab === 1 && _id) {
      refetchMediaMessages();
    }
  }, [tab, _id, refetchMediaMessages]);



  const allFiles = mediaMessagesData?.data?.flatMap((msg) =>
    msg.attachments.map((file) => ({
      ...file,
      messageId: msg._id,
    }))
  ) || [];
  
  const images = allFiles.filter((file) => file.fileType === "image");
  const videos = allFiles.filter((file) => file.fileType === "video");
  const documents = allFiles.filter(
    (file) => file.fileType !== "image" && file.fileType !== "video"
  );
  
  const tabs = [
    { label: "Images", data: images },
    { label: "Videos", data: videos },
    { label: "Documents", data: documents },
  ];
  
  //   console.log("mediaMessagesData", mediaMessagesData?.data)
  
  
  useEffect(() => {
    if (Array.isArray(chatDetail?.data?.isAdmin)) {
      setSelectedAdmins(chatDetail?.data?.isAdmin);
    }
  }, [chatDetail?.data?.isAdmin]);
  
  
  
  
  const handleToggleAdminDialog = () => {
    setAdminDialogOpen(!adminDialogOpen);
  };
  
  const handleAdminToggle = (id) => {
    setSelectedAdmins((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
};

const handleUpdateAdmins = async () => {
  await handleToggleUpdate({ isAdmin: selectedAdmins });
  await refetch(); // important: await so that it completes before closing
  handleToggleAdminDialog();
  
  
};


const handleToggleUpdate = async (updatedFields) => {
  try {
    const data = {
      chatId: _id,
      ...updatedFields,
    };

    const res = await updateGroup({
      data,
      subdomain: institution,
      role,
    }).unwrap();

    if (res.success === false) {
      toast.error(res.message || "Failed to update group settings");
      return;
    }

    toast.success(res.message || "Group setting updated");
  } catch (error) {
    console.error("Failed to update group settings", error);
    toast.error("Update failed. Please try again.");
  }
};

const handleAddMembersToggle = async (e) => {
  const value = e.target.checked;
  setAddMembersAllowed(value);
  await handleToggleUpdate({ addmembersallowed: value });

};

const handleSendMessagesToggle = async (e) => {
  const value = e.target.checked;
  setSendMessageAllowed(value);
  await handleToggleUpdate({ sendmessageallowed: value });

};
  const handleClose = () => {
    onClose();
    setTab(0);
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };
  // console.log(creator._id , currentUser._id)

  return (
    <TopDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <Box bgcolor="#1E1E1E" color="white" p={2} position="relative">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={avatar} sx={{ width: 60, height: 60 }} />
            <Box>
              <Typography variant="h6">{name}</Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{ color: "white", position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          {isGroup && isAdmin && (
            <Button
              onClick={() => setOpenInfo(true)}
              variant="outlined"
              color="primary"
              sx={{ position: "absolute", top: 28, right: 80 }}
            >
              Edit Group
            </Button>
          )}

          {isGroup && (
            <UpdateGroupInfoDialog
              open={openInfo}
              onClose={() => setOpenInfo(false)}
              avatar={avatar}
              name={name}
              id={_id}
            />
          )}
        </Box>

        <Tabs value={tab} onChange={handleTabChange} centered variant="fullWidth">
          <Tab label="Info" />
          <Tab label="Media" />
          {isGroup && <Tab label="Members" />}
          {isGroup && isAdmin && <Tab label="Group Settings" />}
        </Tabs>

        <Divider />

        <Box p={2}>
        {tab === 0 && (
  <Stack spacing={3}>
    {/* Creator Info */}
    <Box sx={{ bgcolor: '#F9FAFB', p: 2.5, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                  Creator
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      Name:
                    </Typography>
                    <Typography variant="body1">{creator.fullname}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      Role:
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {creator.role}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

    <Divider sx={{ my: 1 }} />

    {/* Conditional Action */}
    {!isGroup && creator._id === currentUser._id ? (
      <Box>
       
        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmOpen(true)}
          startIcon={<span>🗑️</span>}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Delete Chat
        </Button>
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Exit</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to exit the group <strong>{name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} disabled={isLoadingDeleteChat}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const res = await deleteChat({
                    chatId: _id,
                    subdomain: institution,
                    role,
                  }).unwrap();

                  console.log(res)
                  
                  toast.success(res.message || "Delete Chat successfully");
                  await listRefetch();
                  setConfirmOpen(false);
                  navigate(`/${institution}/${role}/chat`);
                } catch (err) {
                  toast.error(err?.data?.message || "Failed to delete group");
                }
              }}
              color="error"
              variant="contained"
              disabled={isLoadingDeleteChat}
              startIcon={isLoadingDeleteChat && <CircularProgress size={18} />}
            >
              {isLoadingDeleteChat ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    ) : isGroup && (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          Group Options
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmOpen(true)}
          startIcon={<span>🚪</span>}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Exit Group
        </Button>
       

        {/* Confirm Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Exit</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to exit the group <strong>{name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} disabled={isLoadingExitGroup}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const res = await exitGroup({
                    chatId: _id,
                    subdomain: institution,
                    role,
                  }).unwrap();
                  
                  toast.success(res.message || "Exited group successfully");
                  await listRefetch();
                  setConfirmOpen(false);
                  navigate(`/${institution}/${role}/chat`);
                } catch (err) {
                  toast.error(err?.data?.message || "Failed to exit group");
                }
              }}
              color="error"
              variant="contained"
              disabled={isLoadingExitGroup}
              startIcon={isLoadingExitGroup && <CircularProgress size={18} />}
            >
              {isLoadingExitGroup ? "Exiting..." : "Exit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )}
  </Stack>
)}
            
                
            
      
{tab === 1 && (
   <Box>
   <Tabs
     value={activeTab}
     onChange={(e, newVal) => setActiveTab(newVal)}
     sx={{ marginBottom: 2 }}
   >
     {tabs.map((tab, idx) => (
       <Tab key={idx} label={`${tab.label} (${tab.data.length})`} />
     ))}
   </Tabs>

   {isLoadingMediaMessages ? (
     <Typography>Loading media...</Typography>
   ) : tabs[activeTab].data.length === 0 ? (
     <Typography>No {tabs[activeTab].label.toLowerCase()} found.</Typography>
   ) : (
    <Grid container spacing={1}>
  {tabs[activeTab].data.map((file, i) => (
    <Grid item xs={3} key={`${file._id}-${i}`}>
      {file.fileType === "image" ? (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          <img
            src={file.url}
            alt={`media-${i}`}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 6,
              cursor: "pointer",
              display: "block",
              margin: "auto",
            }}
          />
        </a>
      ) : file.fileType === "video" ? (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          <video
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 6,
              cursor: "pointer",
              display: "block",
              margin: "auto",
            }}
          >
            <source src={file.url} type="video/mp4" />
          </video>
        </a>
      ) : (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          <Paper
            elevation={2}
            sx={{
              padding: 1,
              textAlign: "center",
              height: 80,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            📄 Document
          </Paper>
        </a>
      )}
    </Grid>
  ))}
</Grid>
   )}
 </Box>
)}
{tab === 2 && (isGroup) && (
  <Stack spacing={2}>
    {/* Header with Add Button (Only for Admins) */}
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Members</Typography>

      {(isAdmin || chatDetail.data.addmembersallowed) && (
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsDialogOpen(true)}
          sx={{
            textTransform: "none",
            bgcolor: "#2C2C2C",
            color: "white",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#3A3A3A" },
          }}
        >
           Add/Remove Members
        </Button>
      )}
    </Stack>

    

    {/* Member list grouped by roles */}
    {["teacher", "student", "parent", "admin"].map((roleType) => {
      const roleMembers = members.filter((member) => member.role === roleType);
      if (roleMembers.length === 0) return null;

      return (
        <Box key={roleType}>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: "#888" }}>
            {roleType.charAt(0).toUpperCase() + roleType.slice(1)}s
          </Typography>

          {roleMembers.map((member) => {
            const isGroupAdmin = chatDetail?.data?.isAdmin?.includes(member._id);

            return (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                key={member._id}
                sx={{ mb: 2 }}
              >
                <Avatar src={member.avatar} sx={{ width: 36, height: 36 }} />
                <Typography>{member.name}</Typography>

                {isGroupAdmin && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "0.75rem",
                      color: "green",
                      backgroundColor: "#d1fae5",
                      border: "1px solid #86efac",
                      px: 1,
                      py: 0.5,
                      borderRadius: "999px",
                      ml: 4,
                    }}
                  >
                    <Box
                      component="svg"
                      sx={{ width: 8, height: 8, fill: "#16a34a", mr: 0.5 }}
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="4" />
                    </Box>
                    Group Admin
                  </Box>
                )}
              </Stack>
            );
          })}
        </Box>
      );
    })}

    {/* Add Members Dialog */}
    <AddMembersDialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      onAddMembers={handleUpdateMembers}
      allUsers={allUsersList?.data || []}
      alreadySelected={selectedUsers}
      existingMembers={chatDetail?.data?.members || []}
      isLoading={isLoadingAllUsers}
      isError={isErrorAllUsers}
    />
  </Stack>
)}
{tab === 3 && isGroup && isAdmin && (
  <>
    <Stack spacing={2} mt={4}>
      <Typography variant="h6">Group Settings</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={addMembersAllowed}
            onChange={handleAddMembersToggle}
            color="primary"
          />
        }
        label="Allow members to add others"
        sx={{ color: "#1E1E1E" }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={sendMessageAllowed}
            onChange={handleSendMessagesToggle}
            color="primary"
          />
        }
        label="Allow members to send messages"
        sx={{ color: "#1E1E1E" }}
      />

      <Box mt={3}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: "#1E1E1E",
            borderColor: "#555",
            '&:hover': { borderColor: "#888" }
          }}
          onClick={handleToggleAdminDialog}
        >
          Update Admins
        </Button>
      </Box>
    </Stack>

    {/* Admin Dialog */}
    <Dialog open={adminDialogOpen} onClose={handleToggleAdminDialog} fullWidth maxWidth="sm">
  <DialogTitle>Select Admins</DialogTitle>
  <DialogContent dividers sx={{ bgcolor: "#fff" }}>
    
    {/* Admin Section */}
    <Typography variant="subtitle2" sx={{ px: 1.5, py: 0.5, color: "#555" }}>
      Admins
    </Typography>
    <List disablePadding>
      {members
        .filter((member) => chatDetail?.data?.isAdmin?.includes(member._id))
        .map((member) => (
          <ListItem
            key={member._id}
            disabled
            sx={{
              borderRadius: 2,
              opacity: 0.6,
              cursor: "not-allowed",
              mb: 1,
            }}
          >
            <Avatar src={member.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
            <ListItemText primary={member.name} />
            <span className="ml-2 inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full border border-green-300">
              <svg
                className="w-2 h-2 fill-green-600"
                viewBox="0 0 8 8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="4" cy="4" r="4" />
              </svg>
              Admin
            </span>
          </ListItem>
        ))}
    </List>

    {/* Members Section */}
    <Typography variant="subtitle2" sx={{ mt: 2, px: 1.5, py: 0.5, color: "#555" }}>
      Members
    </Typography>
    <List disablePadding>
      {members
        .filter((member) => !chatDetail?.data?.isAdmin?.includes(member._id))
        .map((member) => (
          <ListItem
            key={member._id}
            button
            onClick={() => handleAdminToggle(member._id)}
            sx={{
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
              mb: 1,
            }}
          >
            <Avatar src={member.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
            <ListItemText primary={member.name} />
            <span className="ml-2 inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full border border-gray-300">
              <svg
                className="w-2 h-2 fill-gray-500"
                viewBox="0 0 8 8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="4" cy="4" r="4" />
              </svg>
              Member
            </span>
            <Checkbox
              checked={selectedAdmins.includes(member._id)}
              sx={{ ml: 2 }}
            />
          </ListItem>
        ))}
    </List>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleToggleAdminDialog} sx={{ color: "#1E40AF" }}>
      Cancel
    </Button>
    <Button onClick={handleUpdateAdmins} variant="contained" color="primary">
      Update
    </Button>
  </DialogActions>
</Dialog>
  </>
)}
        </Box>
        </DialogContent>
    </TopDialog>
  );
};

export default ChatInfoDialog;
