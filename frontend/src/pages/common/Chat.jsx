import React, { useCallback, useEffect, useRef, useState ,useMemo, Fragment} from "react"
import { Box,Stack,Avatar,Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle,Button, DialogContent, TextField, DialogActions } from "@mui/material"
import { useGetChatDetailQuery, useGetMessagesQuery, useSendAttachmentsMutation } from "../../store/api/api.js"
import toast from "react-hot-toast"
import { useSelector,useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import {useInfiniteScrollTop} from "6pp"
import { setFileOpen } from "../../store/slice/authSlice.js"
import { incrementNotification, removeNewMessageAlert, setNewMessageAlert } from "../../store/slice/chatSlice.js"
import { useSocketEvents } from "../../helpers/hooks.js"
import MessageCompopnent from "../common/MessageCompopnent.jsx"
import { AttachFile } from "@mui/icons-material"
import { Loader, SendIcon } from "lucide-react"
import {styled} from "@mui/material"
import ChatInfoDialog from "../common/ChatInfoDialog.jsx"
import {encryptAndSign} from "../../helpers/cryptoutils.js"
import * as openpgp from "openpgp";
import { getKey } from "../../helpers/key.js"
// import { setPublicKey } from "../../store/slice/publicSlice.js"


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
  const idData = useSelector((state)=>state.publicKey)
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
  // const {getPublicKey} =useGetPublicKeyQuery()
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
   const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  // const [openInfoDialog, setOpenInfoDialog] = useState(false);
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
  const [isSending, setIsSending] = useState(false);
const [isReceiving, setIsReceiving] = useState(false);


  
  
  const {data:oldMessageChunk ,isLoading:oldMessageLoading,refetch:chatsrefetch} = useGetMessagesQuery({
    subdomain: institution,
    role: currentUser.role,
    chatId: id,
    page: page,
  }, {
    skip: !id || !currentUser,
    refetchOnMountOrArgChange: true,
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
     setData:setOldMessages} = useInfiniteScrollTop(
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
    },[dispatch, id, setOldMessages]) //1 change 
  
    useEffect(() => {
      if (bottomRef.current) {
        setTimeout(() => {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }, [messages]); // Make sure this includes messages

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

  const getRecipentPrivateKey = async () => {
    const privateKey = await getKey("privateKey");
    console.log("privateKey", privateKey)
    if(!privateKey) {
      toast.error("Private key not found");
      return null;
    }
    return privateKey;
  }

  const newMessageHandler = useCallback(
    async (data) => {
      if (!data) return;
      if (data.chatId !== id) return;
  
      const isReceiver = data.message.receiver === currentUser._id;
      const isSender = data.message.sender._id === currentUser._id;
  
      if (!isReceiver && !isSender) return;
      setIsReceiving(true);
    try {
        const encryptedAndSignedMessage = data.message.content;
        const recipientPrivateKey = await getRecipentPrivateKey();
         console.log("recipientPrivateKey",recipientPrivateKey)
  
        // STEP 1 Load your privat key
        console.log("dataa",data)
        const privateKey = await openpgp.readPrivateKey({ armoredKey: recipientPrivateKey });
        console.log("privateKey", privateKey)
        if(privateKey.isDecrypted && !privateKey.isDecrypted()){
          await privateKey.decrypt("");
        }
        // STEP 2 Load the encryptedmesages
        const message = await openpgp.readMessage({
          armoredMessage: encryptedAndSignedMessage,
        });
        // console.log("messageeeeee", message)
        // STEP 3 load the sender public key
       
        console.log("data.message.sender.publicKey", data.message.sender.publicKey)
        const senderPublicKeyArmored = data.message.sender.publicKey;
        console.log("senderPublicKeyArmored", senderPublicKeyArmored)
        const senderPublicKey = await openpgp.readKey({ armoredKey: senderPublicKeyArmored });
        console.log("senderPublicKey", senderPublicKey)
        // STEP 4 Decrypt the message and verify
        // console.log("encryptedAndSignedMessage", encryptedAndSignedMessage)
        const { data: decryptedText, signatures } = await openpgp.decrypt({
          message : await openpgp.readMessage({ armoredMessage: encryptedAndSignedMessage }),
          decryptionKeys: privateKey,
          verificationKeys: senderPublicKey,
        });
        console.log("signatures", signatures)
        console.log("decryptedText", decryptedText)
  
        const {verified,keyID} = signatures[0];
        console.log("verified", verified)
  
        try {
          await verified;
          console.log("✅ Signature is valid. Signed by key ID:", keyID.toHex());
        } catch (error) {
          console.error("❌ Signature verification failed:", error);
          toast.error("Signature verification failed");
          return;
        }
          console.log("decryptedTextnnnnnnnnnnnnnnnnnnn", decryptedText)
        const newData = {
         chatId: data.chatId,
         message: {
          content: decryptedText,
          sender: {
            _id: data.message.sender._id,
            name: data.message.sender.name,
            avatar: data.message.sender.avatar,
            role: data.message.sender.role,
            publicKey: data.message.sender.publicKey,
          },
          chat: data.message.chat,
          createdAt: data.message.createdAt,
          attachments: data.message.attachments || [],
          receiver: data.message.receiver,
        }
        }
        console.log("newData", newData)
        if(isReceiver){
        setMessages((prevMessages) => [...prevMessages, newData.message]);}
    } catch (error) {
        console.error("Error decrypting message", error);
        // toast.error("Error decrypting message");
      }
      finally {
        setIsReceiving(false);
      }
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
   setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    , 1);
  }, [containerRef, messages]);


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

  const decryptoldmessage = async(oldMessages) => {
    if(!oldMessages) return "";
    if(oldMessages.length === 0) return "";
    console.log("oldMessages", oldMessages)
    const privateKeyArmored = await getKey("privateKey");
    console.log("privateKeyArmored", privateKeyArmored)
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
    console.log("privateKey", privateKey)

    if(privateKey.isDecrypted && !privateKey.isDecrypted()){
      await privateKey.decrypt("");
    }

    const decrypted = [];

    for(const msg of oldMessages){
       console.log("msg", msg)
      try {
        
        let senderPublicKeyArmored = msg.sender.publicKey;
         console.log("senderPublicKeyArmored........", senderPublicKeyArmored)
       
        const senderPublicKey = await openpgp.readKey({armoredKey: senderPublicKeyArmored});
         console.log("senderPublicKey", senderPublicKey)

        const { data: decryptedText, signatures } = await openpgp.decrypt({
          message: await openpgp.readMessage({ armoredMessage: msg.content }),
          decryptionKeys: privateKey,
          verificationKeys: senderPublicKey,
        });
        console.log("decryptedText", decryptedText)
        console.log("signatures", signatures)
        await signatures[0].verified;

        decrypted.push({
          ...msg,
          content: decryptedText,
        })
       
      } catch (error) {
        // toast.error("Error decrypting message");
        console.error("Error decrypting message", error);
      }
    }
    console.log("decryptedText", decrypted)
    return decrypted;
  }
    // console.log("olmessagchunf",oldMessageChunk)
   console.log("oldMessages", oldMessages) 
  // let newmessages = []
  // newmessages =await decryptoldmessage(oldMessages)
  // console.log("newmessages", newmessages)
  useEffect(() => {
    const fetchDecryptedMessages = async () => {
      const meesageeeec = await decryptoldmessage(oldMessages);
      console.log("meesageeeec", meesageeeec);

      setAllMessages([...(meesageeeec || []),...(messages || [])]);
    };

    fetchDecryptedMessages();
  }, [oldMessages, messages]);

  const [allMessages, setAllMessages] = useState([]);
  // const allMessages = useMemo(async() => {
  //   const decryptedMessages =await decryptoldmessage(oldMessages);
  //   console.log("decryptedMessages", decryptedMessages)
  //   return [...decryptedMessages, ...messages];
  // }, [oldMessages, messages]);
  console.log("allMessages",allMessages)

  const sendMessageHandler = async(event) => {
    event.preventDefault()
    //  console.log("sendMessageHandler",message)
    if(!message) return;
    setIsSending(true);
    const memebers = chatData?.data?.members;
    const privateKey = await getKey("privateKey");
    // console.log("message",message)
    //  console.log("privateKey", privateKey)
    //  console.log("memebers", memebers)
    // const filteredMembers = memebers.filter((member) => member._id !== currentUser._id);
    // console.log("filteredMembers", filteredMembers)
    const encryptedMessage = [];
    for(const memeber of memebers){
      //  console.log("memeber", memeber)
      // console.log("messagessss",message)
      // if (member._id.toString() === currentuser.user._id) continue;
      const passphrase = ""; // Replace with the passphrase if your private key is encrypted
      console.log(memeber.publicKey)
      const signedMessage = await encryptAndSign(message,memeber.publicKey,privateKey,passphrase)
      //  console.log("signedMessage", signedMessage)
      // console.log("message", message)
      // console.log("cyruunueneneeeeeee",currentUser)
      encryptedMessage.push({
        to: memeber._id,
        from: {
          _id: currentUser._id,
          name: currentUser.username,
          avatar: currentUser.avatar,
          role: currentUser.role,
          publicKey: currentUser.publicKey,
        },
        encryptedMessage: signedMessage,
        chatId: id,
        institution:chatData.data.institution,
    }
      )
    }
    // console.log("iddata",)

    if(!message) return;

     console.log("encryptedMessage", encryptedMessage)
    socket.emit('NEW_GROUP_MESSAGE',{
      messages:encryptedMessage,
  })
  setTimeout(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);
  setMessage("")
  setIsSending(false);
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
    const privateKey = await getKey("privateKey");
    console.log("privateKeyssssss", privateKey)
 
    // console.log("memebers", memebers)
    for(const memeber of memebers){
    
      // console.log("messagessss",message)
      // if (member._id.toString() === currentuser.user._id) continue;
      const passphrase = ""; // Replace with the passphrase if your private key is encrypted
      console.log("messafed",message)
      const signedMessage = await encryptAndSign(fileMessage,memeber.publicKey,privateKey,passphrase)
      const formData = new FormData();
     formData.append("attachments", filePreview.file);
    formData.append("content", signedMessage||"");
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
          publicKey: currentUser.publicKey,
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
          allMessages.flat().length === 0 ? (
            <div>No messages yet</div>
          ) : (
            // console.log("allMessages", allMessages)
            <>
            {allMessages.flat().map((message) => (
              <MessageCompopnent key={message._id} message={message} />
            ))}
    <div ref={bottomRef} style={{ height: "1px" }}></div>
            {isSending && (
  <div className={`message-bubble outgoing`}>
    <Loader className="animate-spin text-blue-600" size={24} />
    <span className="ml-2">Sending...</span>
  </div>
)}
{isReceiving && (
  <div className={`message-bubble incoming`}>
    <Loader className="animate-spin text-blue-600" size={24} />
    <span className="ml-2">Receiving...</span>
  </div>
)}
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

export default Chat