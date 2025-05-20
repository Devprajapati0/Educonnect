import React, { useEffect, useRef, useState } from "react"
import { Box, CircularProgress, Grid, Fade, useTheme, alpha } from "@mui/material"
import { useSelector } from "react-redux"
import { useGetMyChatsQuery } from "../../store/api/api"
import { useSocket } from "../../socket/Socket"
import Chat from "./Chat"
import ChatList from "./ChatList"
import Leftbar from "./Leftbar"

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)

  const institution = parts[0] || "EduConnect"
  const role = parts[1] || "guest"

  return { institution, role }
}

const Adminchat = () => {
  const theme = useTheme();
  const socket = useSocket()
  const [onlineUsers, setOnlineUsers] = useState([])
  
  const AlertData = useSelector((state) => state.chat)
  const { institution, role } = getInstitutionAndRoleFromPath()
  const [flag, setFlag] = useState(false)
  const categories = ["students", "teachers", "parents", "groups", "admins"];

  const { data, isLoading, isError, refetch } = useGetMyChatsQuery({
    subdomain: institution,
    role: role,
  })

  const isBoolRef = useRef(true);
  useEffect(() => {
    if (!socket) return;
  
    // Handle online users
    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };
  
    // Request current online users
    socket.emit("GET_ONLINE_USERS", { subdomain: institution });
    socket.on("ONLINE_USERS", handleOnlineUsers);
  
    // Join all chats
    const { groups = [], students = [], teachers = [], parents = [], admins = [] } = data?.data || {};
    const allChats = [...groups, ...students, ...teachers, ...parents, ...admins];
    const chatIds = allChats.map(chat => chat._id).filter(Boolean);
  
    socket.emit("JOIN_CHATS", chatIds);
    isBoolRef.current = chatIds.length > 0;
  
    // Refetch if flag is true
    if (flag) {
      refetch();
      setFlag(false);
    }
  
    // Cleanup
    return () => {
      // socket.off("ONLINE_USERS", handleOnlineUsers);
    };
  }, [flag, socket, data, refetch, institution]);

  const chats = data?.data || []

  // Loading animation component
  const LoadingAnimation = () => (
    <Fade in={true}>
      <Box 
        height="100%" 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        sx={{
          color: theme.palette.primary.main,
        }}
      >
        <CircularProgress 
          size={50} 
          thickness={4} 
          sx={{ 
            color: 'inherit',
            mb: 2
          }} 
        />
        <Box sx={{ 
          fontSize: '0.875rem', 
          fontWeight: 500, 
          opacity: 0.8,
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { opacity: 0.4 },
            '50%': { opacity: 0.8 },
            '100%': { opacity: 0.4 },
          }
        }}>
          Loading conversations...
        </Box>
      </Box>
    </Fade>
  );

  return (
    <Box className="flex flex-row min-h-screen" sx={{ 
      background: 'linear-gradient(145deg, #f0f2f5 0%, #f8f9ff 100%)'
    }}>
      {/* LEFTBAR fixed to left side */}
      <Box
        sx={{
          width: 70,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          bgcolor: theme.palette.primary.dark,
          zIndex: 1100,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Leftbar />
      </Box>

      {/* MAIN GRID - shifted right to make space for Leftbar */}
      <Box 
        sx={{ 
          marginLeft: "70px", 
          flex: 1, 
          width: "calc(100% - 70px)", 
          display: "flex",
          overflow: "hidden",
          height: "100vh",
        }}
      >
        {/* CHAT LIST */}
        <Grid
          item
          md={2}
          lg={4}
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.03)',
            overflowY: "auto",
            height: "100vh",
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {isLoading ? (
            <LoadingAnimation />
          ) : isError ? (
            <Fade in={true}>
              <Box height="100%" display="flex" justifyContent="center" alignItems="center">
                <Box sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  color: theme.palette.error.main,
                  borderRadius: 2,
                }}>
                  <Box sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 500,
                    mb: 1
                  }}>
                    Unable to load chats
                  </Box>
                  <Box sx={{ fontSize: '0.875rem', opacity: 0.8 }}>
                    Please check your connection and try again
                  </Box>
                </Box>
              </Box>
            </Fade>
          ) : (
            <Fade in={true}>
              <Box 
                height="100%" 
                overflow="auto"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.1),
                  },
                  scrollbarWidth: 'thin',
                }}
              >
                <ChatList
                  categorizedChats={chats}
                  flag={flag}
                  setFlag={setFlag}
                  newMessageAlert={AlertData.newMessageAlert}
                  categories={categories}
                  onlineUsers={onlineUsers}
                  refetch={refetch}
                />
              </Box>
            </Fade>
          )}
        </Grid>

        {/* CHAT AREA */}
        <Grid
          item
          md={10}
          lg={8}
          sx={{
            bgcolor: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
            width: "100%",
            position: 'relative',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.02)',
          }}
        >
          <Chat socket={socket} refetch={refetch} />
        </Grid>
      </Box>
    </Box>
  )
}

export default Adminchat