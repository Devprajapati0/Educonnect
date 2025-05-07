import React, { useEffect } from "react"
import { Leftbar } from "./Leftbar.jsx"
import { Box, Grid } from "@mui/material"
import { useGetMyChatsQuery } from "../../store/api/api.js"
import toast from "react-hot-toast"
import  {ChatList}  from "../common/ChatList.jsx"
import {CircularProgress} from "@mui/material"
import { Typography } from "@mui/material"

const Chat = () => {
  return (
    <div>
      here
      {/* Add your chat component here */}
    </div>
  )
}
function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean); // removes empty strings

  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";

  return { institution, role };
}
const Adminchat = () => {
  const { institution, role } = getInstitutionAndRoleFromPath();
  const [flag, setFlag] = React.useState(false);
  const { data, isLoading, isError, refetch } = useGetMyChatsQuery({
    subdomain: institution,
    role: role,
  });

  useEffect(() => {
    // console.log("institution", institution);
    if(flag){
      refetch();
      setFlag(false)
    }
  }, [flag]);
  
  // console.log("data", data)
  const chats = data?.data || []
  console.log("chats", chats)
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />  
      </Box>
    )
  }
  if (isError) {
   return toast.error("Something went wrong")
  }
  return (
    <Box sx={{ display: "flex" }}>
      <Leftbar />

      <Grid container sx={{ height: "calc(100vh)", overflow: "hidden" }}>
          {/* Sidebar */}
          <Grid
            item
            sm={4}
            md={3}
            height={"100%"}
            sx={{
              display: { xs: "none", sm: "block" },
              bgcolor: "#f5f5f5",
              p: 1,
              borderRight: "1px solid #ccc",
              overflowY: "auto",
            }}
          >
            <ChatList
              categorizedChats={chats}
              flag={flag}
              setFlag={setFlag}

              // onlineUsers={["1", "2"]}
              // handleDeleteChat={handleDeleteChat}
              // newMessageAlert={AlertData.newMessageAlert}
            />
          </Grid>

          {/* Chat Area */}
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            sx={{
              bgcolor: "#ffffff",
              p: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Chat />
          </Grid>
        </Grid>
      
    </Box>
  )
}

export default Adminchat