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
   <Box className="h-screen flex" >
  <Grid container sx={{width:"100%", height: "100%" }}>

    <Grid item sx={{ width: 80, backgroundColor: "#0e1c2f" }}>
      <Leftbar />
    </Grid>

    {/* CHAT LIST */}
    <Grid
            item
            sm={4}
            md={3}
            lg={2}
            sx={{
              display: { xs: "none", sm: "block" },
              bgcolor: "#f5f5f5",
              p: 1,
              borderRight: "1px solid #ccc",
              overflowY: "auto",
            }}
          >
          {
            isLoading ? (
              <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
              </div>
            ) : isError ? (
              <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p>Error loading chats</p>
              </div>
            ) : (
              <div style={{ height: "100%", overflowY: "auto" }}>
                <ChatList
                  categorizedChats={chats}
                  flag={flag}
                  setFlag={setFlag}
                  newMessageAlert={AlertData.newMessageAlert}
                  categories={categories}
                  onlineUsers={onlineUsers}
                  refetch={refetch}
                />
              </div>
            )
          }
      
    </Grid>

    {/* CHAT AREA */}
    <Grid
            item
            xs={12}
            sm={8}
            md={9}
            lg={10}
            sx={{
              bgcolor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
      <Chat 
        socket={socket} refetch={refetch}
       />
    </Grid>
  </Grid>
</Box>
  )
}

export default Adminchat