import { Fragment, useState, useEffect } from "react";
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
  Fade,
  alpha,
  Badge,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
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

  const [createGroupChat, { isLoading: chatLoading }] = useCreateGroupChatMutation();
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
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Loading conversations...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        gap={2}
        sx={{ p: 3 }}
      >
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: alpha(theme.palette.error.light, 0.1),
            borderRadius: 2,
            textAlign: 'center',
            maxWidth: 300
          }}
        >
          <Typography color="error" variant="body1" fontWeight={500} mb={1}>
            Unable to load users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check your connection and try again.
          </Typography>
        </Box>
      </Box>
    );
  }

  const totalUnreadMessages = newMessageAlert?.reduce((total, alert) => total + (alert.count || 0), 0) || 0;

  const chatListContent = (
    <Box
      sx={{
        width: isSmallScreen ? "100vw" : "100%",
        height: "100vh",
        position: "relative",
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        borderRadius: { xs: 0, md: 2 },
        boxShadow: { xs: 'none', md: '0 4px 20px rgba(0,0,0,0.08)' },
        px: { xs: 2, md: 2.5 },
        py: 2.5,
        overflowY: "auto",
        display: 'flex',
        flexDirection: 'column',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Fade in={true} timeout={800}>
        <Box>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mb={3}
            sx={{
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              pb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 38,
                  height: 38
                }}
              >
                <ChatIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.text.primary, 
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Messages
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                </Typography>
              </Box>
            </Box>
            
            {isSmallScreen && (
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ color: theme.palette.text.secondary }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 2.5,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px',
              },
              '& .MuiTab-root': {
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: '0.9rem',
                minWidth: 100,
                minHeight: '48px',
                borderRadius: '8px',
                mx: 0.5,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
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
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      {hasUnreadInCategory && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: theme.palette.primary.main,
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    </Box>
                  }
                />
              );
            })}
          </Tabs>

          <Divider sx={{ mb: 2, opacity: 0.6 }} />

          {chats.length > 0 ? (
            <Box
              sx={{
                overflowY: "auto",
                maxHeight: "calc(100vh - 220px)",
                mr: -1,
                pr: 1,
                pb: 10,
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: '4px',
                },
              }}
            >
              <Stack spacing={1.5}>
                {chats.map((chat) => {
                  const alert = newMessageAlert?.find((item) => item.chatId === chat._id);
                  const otherMembers =
                    chat?.members?.filter((member) => member?._id !== currentUser?._id) || [];
                  const isOnline = otherMembers.some((member) =>
                    onlineUsers.includes(member._id)
                  );

                  return (
                    <Fade key={chat._id} in={true} timeout={600}>
                      <Box>
                        <ChatItem
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
                      </Box>
                    </Fade>
                  );
                })}
              </Stack>
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                py: 6,
                px: 2,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 4,
                height: '50vh',
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  mb: 2
                }}
              >
                <ChatIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: theme.palette.primary.main,
                    opacity: 0.8
                  }}
                />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                No conversations yet
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 3,
                  maxWidth: 260
                }}
              >
                No chats found for {selectedTab}. Start a new conversation to get started!
              </Typography>
              <Chip
                icon={<AddIcon />}
                label="Start new chat"
                onClick={() => setDialogOpen(true)}
                color="primary"
                variant="outlined"
                sx={{ 
                  borderRadius: '20px',
                  px: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Fade>

      {/* FAB for new chat */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&:hover': {
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          },
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <NewChatDialogContent
          data={data?.data || []}
          onStartChat={handleStartChat}
          onClose={() => setDialogOpen(false)}
          refetch={refetch}
          isChatLoading={chatLoading}
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
              zIndex: 1500,
              ...(id
                ? { top: 25, right: 16, width: 48, height: 48 } // Safe zone from top
                : { bottom: 90, right: 16 }
              ),
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
            }}
          >
            <Badge 
              badgeContent={totalUnreadMessages} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  height: '18px',
                  minWidth: '18px',
                  padding: '0 4px',
                }
              }}
            >
              <MenuIcon />
            </Badge>
          </Fab>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true, disableScrollLock: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: "100vw",
                boxSizing: 'border-box',
                boxShadow: '-4px 0 28px rgba(0,0,0,0.1)',
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