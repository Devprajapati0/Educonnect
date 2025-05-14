import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { NEW_GROUP_MESSAGE, NEW_MESSAGE,NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from './helpers/events.js';
import userAuthenticator from './middlewares/jwt.middleware.js';
import { upload } from './middlewares/multer.middleware.js';
import { Message } from './models/message.model.js';
//socket
import {Server} from 'socket.io'
import http from 'http';
 import { socketAuthenticator } from './helpers/socket.js';
 import { sendMessageController } from './controllers/message.controller.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

export const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST"],

    },
    maxHttpBufferSize: 100e6 // 100 MB, for example
})  
app.use(express.urlencoded({limit:'500mb',extended:true}))
app.use(cookieParser())
app.use(express.static("public"))
app.post('/api/v1/:subdomain/:role/send-message',userAuthenticator,
    upload.array('attachments', 10)
    ,sendMessageController)
app.use(express.json({limit:'500mb'}))

io.use(async(socket, next) => {
    try {
        await new Promise((resolve, reject) => {
          cookieParser()(socket.request, {}, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
    
        await socketAuthenticator(socket, next);
      } catch (err) {
        console.error("Socket auth failed:", err.message);
        next(new Error("Authentication failed"));
      }
  });

//socket connection
const onlineUsers = new Map();
io.on("connection", (socket) => {
    const user = socket.user;
    socket.on("connect", () => {
        console.log("✅ Socket connected", socket.id);
      });
      onlineUsers.set(user._id, socket.id);
      socket.broadcast.emit("USER_ONLINE", { userId: user._id });
  
    console.log("User connected:", user._id);
  
    socket.on("JOIN_CHATS", (chatIds) => {
      chatIds.forEach((chatId) => {
        socket.join(chatId);
      });
    });
    
    socket.on(NEW_GROUP_MESSAGE, async ({ messages = [] }) => {
          console.log("New group message received:", messages);
      for (const msg of messages) {
        const messageForRealTime = {
          content: msg.encryptedMessage,
          sender: msg.from,
          chat: msg.chatId,
          createdAt: new Date().toISOString(),
          attachments: msg.attachments || [],
          receiver: msg.to,
        };
        const messageForDB = {
          institution: msg.institution,
          sender: msg.from,
          chat: msg.chatId,
          content: msg.encryptedMessage,
          attachments: msg.attachments || [],
          receiver: msg.to,
        };
        try {
          const savedMessage = await Message.create(messageForDB);
           console.log("Message saved to DB:", savedMessage);
        } catch (error) {
          console.error("Error saving message to DB:", error);
        }

        console.log("messafe ec",messageForRealTime)

        
        io.to(msg.chatId).emit(NEW_MESSAGE, {
          chatId: msg.chatId,
          message: messageForRealTime,
        });
      }
      io.to(messages[0].chatId).emit(NEW_MESSAGE_ALERT, { chatId: messages[0].chatId });
    });
  
    socket.on(NEW_MESSAGE, async ({ chatId, message = "", attachments = [] }) => {
      // console.log("message", message, chatId, attachments);
  
      const messageForRealtime = {

          content: message.content || "",
          sender: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            publicKey: user.publicKey,
          },
          chat: chatId,
        createdAt: new Date().toISOString(),
        attachments: attachments || [],
        receiver: message.receiver || "",
      };

      io.to(chatId).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealtime,
      });
      
      io.to(chatId).emit(NEW_MESSAGE_ALERT, { chatId });
  
    });
  
    // ✅ Move these here — global event listeners
    socket.on(START_TYPING, ({ chatId, senderId, sendername }) => {
        // console.log("User started typing:", senderId);
      socket.to(chatId).emit(START_TYPING, {
        chatId,
        senderId,
        sendername,
      });
    });
  
    socket.on(STOP_TYPING, ({ chatId, senderId, sendername }) => {
      socket.to(chatId).emit(STOP_TYPING, {
        chatId,
        senderId,
        sendername,
      });
    });

    socket.on("GET_ONLINE_USERS", () => {
      socket.emit("ONLINE_USERS", Array.from(onlineUsers.keys()));
    });
  
    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", user._id, "Reason:", reason);
        onlineUsers.delete(user._id);
        socket.broadcast.emit("USER_OFFLINE", { userId: user._id });
      });
  
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });


// Import routes
import institutionRoutes from './routes/institution.route.js';
import userRoutes from './routes/user.route.js';


app.use('/api/v1/institution', institutionRoutes);
app.use('/api/v1/:subdomain/:role',userRoutes)


export {app}