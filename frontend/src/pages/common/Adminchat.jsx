import React, { useEffect, useRef, useState } from "react"
import { Box, CircularProgress, Grid } from "@mui/material"
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
  const socket = useSocket()
  const [onlineUsers, setOnlineUsers] = useState([])
  
  // console.log("onlineUsers", onlineUsers)
    // console.log("sdddocket", socket)
  const AlertData = useSelector((state) => state.chat)
  const { institution, role } = getInstitutionAndRoleFromPath()
  const [flag, setFlag] = useState(false)
  const categories = ["students", "teachers", "parents", "groups","admins"];

  const { data, isLoading, isError, refetch } = useGetMyChatsQuery({
    subdomain: institution,
    role: role,
  })

  //  console.log("data", data)
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

  // const dates = useSelector((state) => state.chat.avatar);
  // console.log("dates", dates)

  const chats = data?.data || []

  

  // if (isLoading) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //         backgroundColor: "#f0f2f5",
  //       }}
  //     >
  //       <CircularProgress />
  //     </Box>
  //   )
  // }

  // if (isError) {
  //   toast.error("Something went wrong")
  //   return null
  // }

  return (
    
<Box className="flex flex-row min-h-screen bg-gray-100">
  {/* LEFTBAR fixed to left side */}
  <Box
    sx={{
      width: 70, // match with Leftbar width
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      bgcolor: "#0e1c2f",
      zIndex: 1100, // keep it on top
      borderRight: "1px solid #1f2937",
    }}
  >
    <Leftbar />
  </Box>

  {/* MAIN GRID - shifted right to make space for Leftbar */}
  <Box sx={{ marginLeft: "50px", flex: 1, width: "calc(100% - 70px)", display: "flex" }}>
    {/* CHAT LIST */}
    <Grid
      item

      md={2}
      lg={4}
      sx={{
        bgcolor: "#f5f5f5",
        p: 1,
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      {isLoading ? (
        <Box height="100%" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Box height="100%" display="flex" justifyContent="center" alignItems="center">
          <p>Error loading chats</p>
        </Box>
      ) : (
        <Box height="100%" overflow="auto">
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
      )}
    </Grid>

    {/* CHAT AREA */}
    <Grid
      item
  
     
      md={10}
      lg={8}
      sx={{
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
        width: "100%",
      }}
    >
      <Chat socket={socket} refetch={refetch} />
    </Grid>
  </Box>
</Box>

  )
}

export default Adminchat