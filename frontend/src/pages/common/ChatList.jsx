import { Fragment, useState,useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {
  Stack,
  Divider,
  Box,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  Fab,
  Dialog,
  Drawer,
  CircularProgress,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

import { ChatItem } from "./ChatItem.jsx";
import NewChatDialogContent from "./NewChatDialogContent.jsx";
import {
  useCreateGroupChatMutation,
  useGetAllUsersBasedOnRoleQuery,
} from "../../store/api/api.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";
  return { institution, role };
}


// ...inside ChatList component
const ChatList = ({
  categorizedChats = {},
  flag,
  setFlag,
  newMessageAlert,
  categories,
  onlineUsers = [],
  refetch,
}) => {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedTab, setSelectedTab] = useState("students");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { institution, role } = getInstitutionAndRoleFromPath();

  const chats = categorizedChats[selectedTab] || [];

  const [createGroupChat] = useCreateGroupChatMutation();
  const { data, isLoading, isError } = useGetAllUsersBasedOnRoleQuery({
    subdomain: institution,
    role,
  });
 
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    navigate(`/${institution}/${role}/chat/`);
  };

  const handleChatClick = (chatId) => {
    setDrawerOpen(false); 
    navigate(`/${institution}/${role}/chat/${chatId}`);
  };

  const handleStartChat = async (user) => {
    const avatar = user.avatar || null;
    const chatData = {
      name: user.name,
      description: null,
      subdomain: institution,
      role,
      members: [
        {
          _id: user._id,
          role: user.role,
          name: user.name,
          avatar: avatar,
          publicKey: user.publicKey,
        },
      ],
      groupchat: false,
      addmembersallowed: false,
      sendmessageallowed: true,
      avatar: avatar,
    };

    try {
      const response = await createGroupChat(chatData).unwrap();
      if (response.success === false) {
        return toast.error(response.message);
      }
      toast.success(response.message);
      setFlag(!flag);
      await refetch();
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Error creating chat");
    }

    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">Failed to load users. Please try again.</Typography>
      </Box>
    );
  }

  const chatListContent = (
    <Box
      sx={{
        width: isSmallScreen ? "100vw" : "100%",
        minHeight: "100vh",
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        px: 2,
        py: 2,
        overflowY: "auto",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" align="center" sx={{ color: "primary.main", fontWeight: 600 }}>
          {role.toUpperCase()} PANEL
        </Typography>
       
      </Box>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        indicatorColor="primary"
        textColor="primary"
        sx={{
          mb: 2,
          "& .MuiTabs-flexContainer": { flexWrap: "nowrap" },
          "& .MuiTab-root": {
            textTransform: "capitalize",
            fontWeight: 500,
            minWidth: 120,
            flexShrink: 0,
          },
        }}
      >
        {categories.map((cat) => {
          const hasUnreadInCategory = (categorizedChats[cat] || []).some((chat) => {
            const alert = newMessageAlert?.find((item) => item.chatId === chat._id);
            return alert && alert.count > 0;
          });

          return (
            <Tab
              key={cat}
              value={cat}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {cat}
                  {hasUnreadInCategory && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "#1976d2",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>
              }
            />
          );
        })}
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 220px)",
          pr: 1,
          pb: 10, // <--- Increased padding to prevent overlap with FAB
        }}
      >
        <Stack spacing={1}>
          {chats.length > 0 ? (
            chats.map((chat) => {
              const alert = newMessageAlert?.find((item) => item.chatId === chat._id);
              const otherMembers =
                chat?.members?.filter((member) => member?._id !== currentUser?._id) || [];
              const isOnline = otherMembers.some((member) =>
                onlineUsers.includes(member._id)
              );

              return (
                <ChatItem
                  key={chat._id}
                  avatar={chat.avatar}
                  name={chat.name}
                  _id={chat._id}
                  isSelected={chat._id === id}
                  onClick={() => handleChatClick(chat._id)} 
                  subdomain={institution}
                  role={role}
                  newMessageAlert={alert}
                  isOnline={isOnline}
                  groupchat={chat.groupchat}
                />
              );
            })
          ) : (
            <Typography variant="body2" align="center" color="text.secondary">
              No chats found for {selectedTab}. Start a new conversation!
            </Typography>
          )}
        </Stack>
      </Box>

      {/* FAB for new chat */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <EditIcon />
      </Fab>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <NewChatDialogContent
          data={data?.data || []}
          onStartChat={handleStartChat}
          onClose={() => setDialogOpen(false)}
          refetch={refetch}
        />
      </Dialog>
    </Box>
  );

  return (
    <Fragment>
      {isSmallScreen ? (
        <>
  <Fab
  color="primary"
  aria-label="toggle drawer"
  onClick={() => setDrawerOpen(prev => !prev)}
  sx={{
    position: "fixed",
    zIndex:1500,
    ...(id
      ? { top: 25, right: 16, width: 48, height: 48 } // Safe zone from top
      : { bottom: 90, right: 16 }
    ),
  }}
>
  <MenuIcon />
</Fab>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true, disableScrollLock: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: "100vw",
              },
            }}
          >
            {chatListContent}
          </Drawer>
        </>
      ) : (
        chatListContent
      )}
    </Fragment>
  );
};
export default ChatList;