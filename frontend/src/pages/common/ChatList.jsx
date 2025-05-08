import { useState } from "react";
import {
  Stack,
  Divider,
  Box,
  Tabs,
  Tab,
  Typography,
  Fab,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ChatItem } from "./ChatItem.jsx";
import NewChatDialogContent from "./NewChatDialogContent.jsx";// you will create this
import { useCreateGroupChatMutation, useGetAllUsersBasedOnRoleQuery } from "../../store/api/api.js";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean); // removes empty strings

  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";

  return { institution, role };
}
const ChatList = ({ categorizedChats = {} ,
  flag,setFlag,newMessageAlert
}) => {
  // console.log("newMessageAlert", newMessageAlert);
  const { id } = useParams(); 
  // console.log("chatId", id);
  const categories = ["students", "teachers", "parents", "groups"];
  const [selectedTab, setSelectedTab] = useState("students");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // console.log("categorizedChats", categorizedChats);

  const chats = categorizedChats[selectedTab] || [];
  // console.log("chats", chats);

  const { institution, role } = getInstitutionAndRoleFromPath();
  // console.log(institution, role)
  const [
    createGroupChat,
] = useCreateGroupChatMutation();
  const handleStartChat = (user) => {
    // console.log("Start chat with:", user);
    const chatData = {
      name: user.name,
      description: null,
      subdomain: institution,
      role,
      members: [{
        _id:  user._id,
        role: user.role,
        name:user.name
      }],
      groupchat: false,
      addmembersallowed: false,
      sendmessageallowed: true,
      avatar: user.avatar,

    };
    createGroupChat(chatData)
      .unwrap()
      .then((response) => {
        // console.log("Chat created successfully:", response);
        if(response.success == false){
          return toast.error(response.message);
        }
        toast.success(response.message);
        setFlag(!flag);
      })
      .catch((error) => {
        console.error("Error creating chat:", error);
        toast.error("Error creating chat");
      });


    setDialogOpen(false); // Close dialog after selecting
  };
  const {data,isLoading,isError} = useGetAllUsersBasedOnRoleQuery({subdomain:institution,role})
  
  if(isLoading){
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
    );
  }
  if(isError){
    return toast.error("Something went wrong")
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        px: 2,
        py: 2,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
      >
        Your Chats
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            textTransform: "capitalize",
            fontWeight: 500,
          },
        }}
      >
        {categories.map((cat) => (
          <Tab key={cat} label={cat} value={cat} />
        ))}
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1}>
        {chats.length > 0 ? (
          chats.map((chat) => {
             const alert = newMessageAlert?.find((item) => item._id === chat._id);
              
             return <ChatItem
                key={`${chat._id}`}
               avatar={chat.avatar}
                name={chat.name}
                _id={chat._id}
                // lastMessage={chat.lastMessage}
                // unreadCount={chat.unreadCount}
                // onClick={() => {
                //   // Handle chat click
                //   console.log("Chat clicked:", chat._id);
                // }}
                isSelected={chat._id === id}
                onClick={() => setSelectedChatId(chat._id)} // NEW
                subdomain={institution}
                role={role}
                // groupChat={chat.groupChat}
                // isOnline={chat.isOnline}
                // isOnline={isOnline}
                 newMessageAlert={alert}
                // handleDeleteChat={handleDeleteChat}
                // onDelete={() => handleDeleteChat(chat._id)}
                
              />}
          )
        ) : (
          <Typography variant="body2" align="center" color="text.secondary">
            No chats available
          </Typography>
        )}
      </Stack>

      {/* FAB to open dialog */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <EditIcon />
      </Fab>

      {/* Dialog for new chat */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        className="bg-[#ffffff] text-white p-4"
      >
        <NewChatDialogContent data={data.data} onStartChat={handleStartChat} onClose={() => setDialogOpen(false)} />
      </Dialog>
    </Box>
  );
};

export { ChatList };