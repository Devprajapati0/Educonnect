import React, { useCallback, useEffect, useRef, useState ,useMemo} from "react"
import { Box, Grid, CircularProgress, Stack, IconButton, Menu, MenuItem, Dialog, DialogTitle,Button, DialogContent, TextField, DialogActions } from "@mui/material"
import { useGetChatDetailQuery, useGetMessagesQuery, useGetMyChatsQuery, useSendAttachmentsMutation } from "../../store/api/api.js"
import toast from "react-hot-toast"
import { ChatList } from "../common/ChatList.jsx"
import { useSocket } from "../../socket/Socket.jsx"
import { useSelector,useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { Leftbar } from "./Leftbar.jsx"
import {useInfiniteScrollTop} from "6pp"
import { setFileOpen } from "../../store/slice/authSlice.js"
import { incrementNotification, removeNewMessageAlert, setNewMessageAlert } from "../../store/slice/chatSlice.js"
import { useSocketEvents } from "../../helpers/hooks.js"
import MessageCompopnent from "../common/MessageCompopnent.jsx"
import { AttachFile } from "@mui/icons-material"
import { SendIcon } from "lucide-react"
import {styled} from "@mui/material"

export const InputBox = styled('input')`
width: 100%;
height: 100%;
border: none;
outline: none;
padding: 0 3rem;
background-color: #f2f2f2;
font-size: 1.2rem;
`

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)

  const institution = parts[0] || "EduConnect"
  const role = parts[1] || "guest"

  return { institution, role }
}
const Chat = (socket) => {
 socket = socket.socket;
  const { id } = useParams()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)
  //  console.log(currentUser)
  const { institution,role } = getInstitutionAndRoleFromPath()
  const {data:chatData} = useGetChatDetailQuery({
    subdomain: institution,
    role: role,
    chatId: id,})
    const [sendAttachment] = useSendAttachmentsMutation({
      subdomain: institution,
      role: role,
    })
  // console.log("chatDetailData", chatData)
  const isChatSelected = typeof id !== "undefined"
  
  const containerRef = useRef(null);
  const imageRef = useRef();
  const videoRef = useRef();
  const audioRef = useRef();
  const docRef = useRef();
  const typingTimeoutRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [filePreview, setFilePreview] = useState(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileMessage, setFileMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [message, setMessage] = useState("");
  const [iamTyping, setIamTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
 
  
  const {data:oldMessageChunk ,isLoading:oldMessageLoading,isError,error} = useGetMessagesQuery({
    subdomain: institution,
    role: currentUser.role,
    chatId: id,
    page: page,
  }, {
    // skip: !id || !currentUser,
    // refetchOnMountOrArgChange: true,
  })
  
  const {data:oldMessages , setData:setOldMessages,refetch} = useInfiniteScrollTop(
    containerRef,
    oldMessageChunk?.data?.totalPages,
    page,
    setPage,
    oldMessageChunk?.data?.data
  )
    useEffect(() => {
      dispatch(setFileOpen(false))
      dispatch(removeNewMessageAlert({ chatId: id }))
  
      return () => {
        setMessages([]);
        setOldMessages([]);
        setPage(1);
        setFilePreview(null);
        setFileModalOpen(false);
        setFileMessage("");
        setAnchorEl(null);
        setMessage("");
        setIamTyping(false);
        setUserIsTyping(false);
        setTypingUser(null);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },[dispatch, id])
  


  const newMessageAlertHandler = useCallback((data) => {
    if(data.chatId == id) return;
    dispatch(setNewMessageAlert({ chatId: data.chatId }))
  },[dispatch,id])
  
  const startTypingHandler = useCallback((data) => {
    if (data.chatId === id && data.senderId !== currentUser?._id) {
      setUserIsTyping(true);
      setTypingUser({ name: data.sendername, id: data.senderId });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setUserIsTyping(false);
        setTypingUser(null);
      }, 3000);

    }
  }, [id, currentUser._id])

  const stopTypingHandler = useCallback((data) => {
    if (data.chatId === id && data.senderId !== currentUser?._id) {
      setUserIsTyping(false);
      setTypingUser(null);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setUserIsTyping(false);
        setTypingUser(null);
      }, 3000);
    }
  }, [id, currentUser?._id])
  const newMessageHandler = useCallback(
    async (data) => {
      console.log("newMessageHandler", data);
      // early out
      if (!data) return;
      if (data.chatId !== id) return;

      try {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      } catch (error) {
        toast.error("🔐 Decryption/Verification failed:", error);
      }
    },
    [id]
  );

  const alertHandler = useCallback((data) => {
    const messageForAlert = {
      content:data,
      sender:{
        _id:"234234214nj234234",
        username:"Admin",

      },
      // _id:uuid()
    }

    setMessages((prev) => [...prev, messageForAlert]);
    if (data.chatId === id) {
      dispatch(incrementNotification());
      dispatch(setNewMessageAlert({ chatId: data.chatId }));
    }
  }, [dispatch, id])

  

  const socketHandlers = useMemo(() => ({
    ['NEW_MESSAGE']: newMessageHandler,
    // [NEW_REQUEST]: newRequestHandler,
    ['NEW_MESSAGE_ALERT']: newMessageAlertHandler,
    ['START_TYPING']: startTypingHandler,
    ['STOP_TYPING']: stopTypingHandler,
    ['ALERT']: alertHandler,
  }), [
    newMessageHandler,
    // newRequestHandler,
    newMessageAlertHandler,
    startTypingHandler,
    stopTypingHandler,
    alertHandler
  ]);

   useSocketEvents(socket, socketHandlers);


  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, oldMessages]);

  // if(isLoading){
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
  // if(isError){
  //   toast.error(error?.data?.message || "Something went wrong")
  //   return null
  // }

  console.log("oldmessafechunk",oldMessageChunk)
  
  const allMessages = [...oldMessages, messages]
  console.log("allMessages",allMessages)

  const sendMessageHandler = async(event) => {
    event.preventDefault()

    const memebers = chatData?.data?.members;
    const filteredMembers = memebers.filter((member) => member._id !== currentUser._id);
    // console.log("filteredMembers", filteredMembers)
    const encryptedMessage = [];
    for(const memeber of filteredMembers){
      encryptedMessage.push({
        to: memeber._id,
        from: {
          _id: currentUser._id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: currentUser.role,
        },
        encryptedMessage: message,
        chatId: id,
    }
      )
    }

    if(!message) return;

    console.log("encryptedMessage", encryptedMessage)
    socket.emit('NEW_GROUP_MESSAGE',{
      messages:encryptedMessage,
  })
  setMessage("")
  }

  const messageOnChangle = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    if (socket && newMessage.trim() !== "") {
      if (!iamTyping) {
        socket.emit('START_TYPING', { chatId: id, senderId: currentUser?._id,sendername:currentUser?.name });
        setIamTyping(true);
      }
  
      // Clear existing timeout and set a new one
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('STOP_TYPING', { chatId: id, senderId: currentUser?._id,sendername:currentUser?.name });

        setIamTyping(false);
      }, 3000);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilePreview(
      {file,
      url: URL.createObjectURL(file),
      type: file.type,}
    )
    setFileModalOpen(true)
  }
 
  const sendFileMessage = async () => {
    const formData = new FormData();
    formData.append("attachments", filePreview.file);
    formData.append("content", fileMessage);
    formData.append("chatId", id);

    const res = await sendAttachment(formData);
    socket.emit('NEW_MESSAGE', {
      chatId: id,
      message: fileMessage,
      attachments: res?.data?.data?.attachments,
    });
    setFilePreview(null);
    setFileMessage("");
    setFileModalOpen(false);
    setMessage("");
  }


  return (
    <Box
    sx={{
      height: "100%",
      width: "100%",
      p: isChatSelected ? 2 : 0,
      display: "flex",
      justifyContent: isChatSelected ? "flex-start" : "center", // ✅ Fix here
      alignItems: "center",
      backgroundColor: "#f5f7fa",
    }}
  >
      {isChatSelected ? (
       <Box
       sx={{
         backgroundColor: "#fff",
         padding: 3,
         borderRadius: 2,
         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
         width: "100%",
         // REMOVE or comment this ↓
         // maxWidth: "700px",
       }}
     >
      <Stack
        ref={containerRef}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "1rem",
          height: "90%",
          bgcolor: "grey.100",
          borderRadius: "10px",
        }}
        spacing={1}
      >
        {oldMessageLoading? (
          <div>Loading...</div>
        ) : (
          allMessages.length === 0 ? (
            <div>No messages yet</div>
          ) : (
            // console.log("allMessages", allMessages)
          allMessages.map((message) => (
            <MessageCompopnent key={message._id} message={message} />
          ))
        )
        )}
      </Stack>

      <form onSubmit={sendMessageHandler}  style={{ height: "10%" }}>
        <Stack direction="row" padding="1rem" alignItems="center" spacing={1}>
          {/* Attach File Button */}
          <IconButton
            sx={{
              color: "primary.light",
              "&:hover": {
                color: "primary.main",
                backgroundColor: "#f2f2f2",
                transform: "scale(1.1)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AttachFile />
          </IconButton>

          {/* File Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => { setAnchorEl(null); imageRef.current.click(); }}>Image</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); audioRef.current.click(); }}>Audio</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); videoRef.current.click(); }}>Video</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); docRef.current.click(); }}>Document</MenuItem>
          </Menu>

          {/* Hidden File Inputs */}
          <input type="file" hidden accept="image/*" ref={imageRef} onChange={handleFileChange} />
          <input type="file" hidden accept="audio/*" ref={audioRef} onChange={handleFileChange} />
          <input type="file" hidden accept="video/*" ref={videoRef} onChange={handleFileChange} />
          <input type="file" hidden ref={docRef} onChange={handleFileChange} />

         {userIsTyping && (
           <div>

             {typingUser?.name} is typing...
           </div>
         )}
                  <InputBox
                    onChange={messageOnChangle}
                    value={message}
                    placeholder="Type a message"
                    sx={{ flexGrow: 1 }}
                  />
        
          {/* Send Button */}
          <Box ml="auto">
            <IconButton
              type="submit"
              sx={{
                color: "primary.main",
                "&:hover": {
                  color: "primary.light",
                  backgroundColor: "#f2f2f2",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Stack>
      </form>

      <Dialog open={fileModalOpen} onClose={() => setFileModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Send Attachment</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filePreview?.type?.startsWith("image/") ? (
            <img src={filePreview.url} alt="Preview" style={{ width: "100%", borderRadius: 8 }} />
          ) : filePreview?.type?.startsWith("audio/") ? (
            <audio controls src={filePreview.url} style={{ width: "100%" }} />
          ) : filePreview?.type?.startsWith("video/") ? (
            <video controls src={filePreview.url} style={{ width: "100%" }} />
          ) : (
            <p>File: {filePreview?.file?.name}</p>
          )}
          <TextField
            label="Add a message"
            fullWidth
            value={fileMessage}
            onChange={(e) => setFileMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={sendFileMessage}>Send</Button>
        </DialogActions>
      </Dialog>

     </Box>
      ) : (
        <Box sx={{ textAlign: "center", px: 2 }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#333" }}>
            👋 Welcome to <span style={{ color: "#3b82f6" }}>{institution}</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#555" }}>
            Select a chat from the left to start a conversation.
          </p>
        </Box>
      )}
    </Box>
  )
}

const Adminchat = () => {
  const socket = useSocket()
  // console.log("socket", socket)
  const AlertData = useSelector((state) => state.chat)
  const { institution, role } = getInstitutionAndRoleFromPath()
  const [flag, setFlag] = useState(false)

  const { data, isLoading, isError, refetch } = useGetMyChatsQuery({
    subdomain: institution,
    role: role,
  })
   console.log("data", data)

  useEffect(() => {
    if (!socket) return
    if (socket && data?.data) {
      const { groups = [], students = [], teachers = [], parents = [] } = data.data;
    
      const allChats = [...groups, ...students, ...teachers, ...parents];
      const chatIds = allChats.map(chat => chat._id).filter(Boolean); // ensure _id exists
    
      socket.emit("JOIN_CHATS", chatIds);
    }
    if (flag) {
      refetch()
      setFlag(false)
    }
  }, [flag, socket, data])

  const chats = data?.data || []

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    toast.error("Something went wrong")
    return null
  }

  return (
   <Box className="h-screen w-screen flex" >
  <Grid container sx={{ height: "100%" }}>
    {/* LEFT NAVBAR */}
    <Grid item sx={{ width: 80, backgroundColor: "#0e1c2f" }}>
      <Leftbar />
    </Grid>

    {/* CHAT LIST */}
    <Grid
            item
            sm={4}
            md={3}
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
        newMessageAlert={AlertData.newMessageAlert}
      />
    </Grid>

    {/* CHAT AREA */}
    <Grid
            item
            xs={12}
            sm={8}
            md={9}
            sx={{
              bgcolor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
      <Chat 
        socket={socket}
       />
    </Grid>
  </Grid>
</Box>
  )
}

export default Adminchat