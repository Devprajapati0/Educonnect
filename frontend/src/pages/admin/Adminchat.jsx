import React, { useCallback, useEffect, useRef, useState ,useMemo, Fragment} from "react"
import { Box, Grid, CircularProgress, Stack,Avatar,Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle,Button, DialogContent, TextField, DialogActions } from "@mui/material"
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
import { Loader, SendIcon } from "lucide-react"
import {styled} from "@mui/material"
import { GroupIcon } from "lucide-react"
import ChatInfoDialog from "../common/ChatInfoDialog.jsx"

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
const Chat = (
  { socket, refetch }
) => {
  // console.log("socket", socket)
  const { id } = useParams()
  
  const avatars = useSelector((state) => state.chat.avatar)
  //  console.log("avatars", avatars)
  // const avatarArray = useSelector((state) => state.chat.avatar || []);
  // console.log("avatarArray", avatarArray)

  // const avatarObj = avatarArray.reduce((acc, item) => {
  //   if (item.chatId) {
  //     acc[item.chatId] = {
  //       image: item.image,
  //       alt: item.alt,
  //       name: item.name,
  //     };
  //   }
  //   return acc;
  // }, {});
  // console.log("avatarObj", avatarObj)
  // console.log("id", id)
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)
 
  // console.log(currentUser)
  const { institution,role } = getInstitutionAndRoleFromPath()
  // console.log("institution", institution)
  const {data:chatData,isLoading:chatfetchLoading} = useGetChatDetailQuery({
    subdomain: institution,
    role: role,
    chatId: id,},{
    skip: !id || !currentUser,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    }
  )
  // console.log("chatData", chatData)
  // console.log("currentUser", currentUser)
  const isAdmin = chatData?.data?.isAdmin?.includes(currentUser?._id) || false;
  // console.log("isAdmin", isAdmin)
const isInputDisabled = chatData?.data?.sendmessageallowed === false && !isAdmin;
// console.log("isInputDisabled", isInputDisabled)

    const [sendAttachment,
    {isLoading:sendAttachmentLoading}
    ] = useSendAttachmentsMutation()
    // console.log("chatDetailData", chatData)
  const isChatSelected = typeof id !== "undefined"
  
  const containerRef = useRef(null);
  const imageRef = useRef();
  const videoRef = useRef();
  const audioRef = useRef();
  const docRef = useRef();
  const typingTimeoutRef = useRef(null);
  // const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [page, setPage] = useState(1);
  const [filePreview, setFilePreview] = useState(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileMessage, setFileMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [message, setMessage] = useState("");
  const [iamTyping, setIamTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  
  
  const {data:oldMessageChunk ,isLoading:oldMessageLoading,refetch:chatsrefetch} = useGetMessagesQuery({
    subdomain: institution,
    role: currentUser.role,
    chatId: id,
    page: page,
  }, {
    // skip: !id || !currentUser,
    // refetchOnMountOrArgChange: true,
  })
  useEffect(() => {
    const refetch = async () => {
      if (id) {
        await chatsrefetch();
      }
    };
    refetch();
  }, [id, chatsrefetch]);




  // console.log("page", page)
  
  const {data:oldMessages ,
    isLoading:oldMessagesLoading,
    // isError:oldMessagesError,
     setData:setOldMessages,refetch:refetchOldMessages} = useInfiniteScrollTop(
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
  
    // useEffect(() => {
    //   if (bottomRef.current)
    //     bottomRef.current.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

  const newMessageAlertHandler = useCallback((data) => {
    console.log("newMessageAlertHandler", data)
    if (!data) return;
    if(data.chatId == id) return;
    dispatch(setNewMessageAlert({ chatId: data.chatId }))
  },[dispatch,id])
  
  const startTypingHandler = useCallback((data) => {
    // console.log("startTypingHandler", data)
    if (data.chatId === id && data.senderId !== currentUser?._id) {
      setUserIsTyping(true);
      setTypingUser({ name: data.sendername, id: data.senderId });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setUserIsTyping(false);
        setTypingUser(null);
      }, 6000);
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
      }, 4000);
    }
  }, [id, currentUser?._id])
  const newMessageHandler = useCallback(
    async (data) => {
      if (!data) return;
      if (data.chatId !== id) return;
  
      const isReceiver = data.message.receiver === currentUser._id;
      const isSender = data.message.sender._id === currentUser._id;
  
      if (!isReceiver && !isSender) return;
      if(isReceiver){
      setMessages((prevMessages) => [...prevMessages, data.message]);}
    },
    [id, currentUser._id]
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

  // if(oldMessageLoading){
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

    // console.log("oldmessafechunk",oldMessageChunk)

  // if(oldMessageChunk?.success == false){
  //   toast.error(oldMessageChunk.message)
  //   return null
  // }
  
  
  const allMessages = useMemo(() => [...oldMessages, ...messages], [oldMessages, messages]);
  // console.log("allMessages",allMessages)

  const sendMessageHandler = async(event) => {
    event.preventDefault()
    // console.log("sendMessageHandler",message)
    if(!message) return;

    const memebers = chatData?.data?.members;
    // console.log("memebers", memebers)
    // const filteredMembers = memebers.filter((member) => member._id !== currentUser._id);
    // console.log("filteredMembers", filteredMembers)
    const encryptedMessage = [];
    for(const memeber of memebers){
      encryptedMessage.push({
        to: memeber._id,
        from: {
          _id: currentUser._id,
          name: currentUser.username,
          avatar: currentUser.avatar,
          role: currentUser.role,
        },
        encryptedMessage: message,
        chatId: id,
    }
      )
    }

    if(!message) return;

    //  console.log("encryptedMessage", encryptedMessage)
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
        socket.emit('START_TYPING', {
          chatId: id,
          senderId: currentUser?._id,
          sendername: currentUser?.username
        });
        setIamTyping(true);
      }
  
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('STOP_TYPING', {
          chatId: id,
          senderId: currentUser?._id,
          sendername: currentUser?.username // use correct key
        });
        setIamTyping(false);
      }, 2000); // shorter delay = faster stop
    } else {
      // Handle the case when the input is cleared
      if (iamTyping) {
        socket.emit('STOP_TYPING', {
          chatId: id,
          senderId: currentUser?._id,
          sendername: currentUser?.username
        });
        setIamTyping(false);
        clearTimeout(typingTimeoutRef.current);
      }
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
    // const formData = new FormData();
    // console.log("filePreview",filePreview)
    // const data ={
    //   chatId: id,
    //   content: fileMessage,
    //   attachments:[
    //     {
    //       url: filePreview.url,
    //       fileType: filePreview.type,
    //     },
    //   ]
    // }

 

    // const res = await sendAttachment({
    //   subdomain: institution,
    //   role: role,
    //   data,
    // });
    // console.log("res",res)
    const memebers = chatData?.data?.members;
    // console.log("memebers", memebers)
    for(const memeber of memebers){
      const formData = new FormData();
     formData.append("attachments", filePreview.file);
    formData.append("content", fileMessage||"");
    formData.append("chatId", id)
    formData.append("receiver", memeber._id)


   
    
    const res = await sendAttachment({formData,subdomain:institution,role})
   

    const data = res.data.data;

    socket.emit('NEW_MESSAGE', {
      chatId: id,
      message: {
        content:data.content,
        sender: {
          _id: currentUser._id,
          name: currentUser.username,
          avatar: currentUser.avatar,
          role: currentUser.role,
        },
        chat: id,
        createdAt: new Date().toISOString(),
        receiver: data.receiver,
      },
      attachments: res?.data?.data?.attachments,
      
    });
    setFilePreview(null);
    setFileMessage("");
    setFileModalOpen(false);
    setMessage("");
  }
  }

  // if(!isAdmin && isInputDisabled){
  //   toast.error("Only Admins can send")
  //   return null
  // }


  return (
   <>
 {isChatSelected && (
  <Box
    display="flex"
    alignItems="center"
    padding={1}
    bgcolor="#111827"
    onClick={() => setOpenInfo(true)} // ✅
    sx={{ cursor: "pointer" }}
  >
    {!chatfetchLoading ? (
      <>
        <Avatar src={avatars.image || ""} sx={{ width: 35, height: 35, mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          {avatars.name || "unidentified"}
        </Typography>
      </>
    ) : (
      <Loader />
    )}
  </Box>
)}

<ChatInfoDialog
  open={openInfo}
  onClose={() => setOpenInfo(false)}
  isGroup={avatars.isGroup}
  avatar={avatars.image}
  name={avatars.name}
  _id={id}
  refetch={refetch}
/>
    <Fragment>
      {isChatSelected ? (
      <>
      {oldMessagesLoading?
      <div>Loading...</div>
       :<Stack
       ref={containerRef}
       boxSizing={"border-box"}
       padding={"1rem"}
       spacing={"1rem"}
       bgcolor={"#f5f5f5"}
       height={"90%"}
       sx={{
         overflowX: "hidden",
         overflowY: "auto",
       }}
     >
        {oldMessagesLoading || oldMessageLoading? (
          <div>Loading...</div>
        ) : (
          allMessages.length === 0 ? (
            <div>No messages yet</div>
          ) : (
            // console.log("allMessages", allMessages)
            <>
            {allMessages.map((message) => (
              <MessageCompopnent key={message._id} message={message} />
            ))}
            {/* <div ref={bottomRef} style={{ height: "1px" }}></div> */}
          </>
          
        )
        )}
      </Stack>}

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

          {userIsTyping && typingUser && (
  <Typography variant="body2" sx={{ color: "gray", ml: 2, mb: 1 }}>
    {typingUser.name} is typing...
  </Typography>
)}

                  <InputBox
  onChange={messageOnChangle}
  value={message}
  placeholder={(isInputDisabled)?"Only Admins can Send":"Type a message"}
  sx={{ flexGrow: 1 }}
  disabled={isInputDisabled}
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
          <Button variant="contained" disabled={sendAttachmentLoading} onClick={sendFileMessage}>
            {sendAttachmentLoading ? 
  <Loader className="animate-spin text-blue-600" size={48} />: "Send"}
          </Button>
        </DialogActions>
      </Dialog>

      </>

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
    </Fragment>

   </>
  )
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
   <Box className="h-screen w-screen flex" >
  <Grid container sx={{ height: "100%" }}>

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