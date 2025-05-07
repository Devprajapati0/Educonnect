import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { NEW_GROUP_MESSAGE, NEW_MESSAGE,NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from './helpers/events.js';
import { Message } from './models/message.model.js';
//socket
import {Server} from 'socket.io'
import http from 'http';
import { socketAuthenticator } from './helpers/socket.js';


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
    }
})  

app.use(express.json({limit:'500mb'}))
app.use(express.urlencoded({limit:'500mb',extended:true}))
app.use(cookieParser())
app.use(express.static("public"))

//socket middleware
io.use((socket,next) => {
    cookieParser()(socket.request,socket.request.resume,async(err) => {
        await socketAuthenticator(err, socket.request, next);
        next();
    })
})

//socket connection
io.on("connection",(socket) => {
    const user = socket.user;

    socket.on("JOIN_CHATS",(chatIds) => {
        chatIds.forEach((chatId) => {
            socket.join(chatId);
        })
    })

    socket.on(NEW_GROUP_MESSAGE,async ({messages=[]}) =>{
        
    })

    socket.on(NEW_MESSAGE,async ({chatId,message="",attachments=[]}) =>{
        const messageForRealtime = {
            message,
            chatId,
            createdAt: new Date().toISOString(),
            attachments :attachments|| [],
        }

      
        const messageForDB={
            sender:user._id,
            chat:chatId,
            content:message,
            attachments:attachments|| [],
        }

        io.to(chatId).emit(NEW_MESSAGE,{
            chatId,
            message:messageForRealtime,})
        
        io.to(chatId).emit(NEW_MESSAGE_ALERT,{chatId})

        if (!message.attachments || message.attachments.length === 0) {
            try {
            const savedMessage = await Message.create(messageForDB);
            console.log("Message saved to DB:", savedMessage);
            // Emit to all users in the room (including sender)
            } catch (error) {
            console.error("Error saving message to DB:", error);
            }
        }

        socket.on(START_TYPING,({chatId,senderId,sendername}) => {
            socket.to(chatId).emit(START_TYPING,{
                chatId,
                senderId,
                sendername,
            })
        })

        socket.on(STOP_TYPING,({chatId,senderId,sendername}) => {
            socket.to(chatId).emit(STOP_TYPING,{
                chatId,
                senderId,
                sendername,
            })
        })

        socket.on("disconnect",() => {
            console.log("User disconnected");
        })
        socket.on("error",(error) => {
            console.error("Socket error:", error);
        })

    })
})


// Import routes
import institutionRoutes from './routes/institution.route.js';
import userRoutes from './routes/user.route.js';

app.use('/api/v1/institution', institutionRoutes);
app.use('/api/v1/:subdomain/:role',userRoutes)


export {app}