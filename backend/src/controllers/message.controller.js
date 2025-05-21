import { asynhandler } from "../utils/asynchandler.js"
import { apiresponse } from "../utils/apiresponse.js"
import { uploadOnCloudinary } from "../helpers/cloudinary.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"
import mongoose from "mongoose"

export const detectFileType = (mimetype) => {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("video/")) return "video";
    if (mimetype === "application/pdf") return "pdf";
    if (
      mimetype === "application/msword" ||
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "doc";
    return "other";
};  
const sendMessageController = asynhandler(async (req, res) => {
    const { content, chatId,receiver } = req.body;
    // console.log("req.body", req.body);
    // console.log("3223222222",req.user)
    const senderId = req.user?._id;
    // console.log("senderId", senderId);
    //  console.log("req.body", req.body);
  
    if (!chatId) {
      return res.json(new apiresponse(400, null, "Chat ID is required"));
    }
    if(!receiver) {
      return res.json(new apiresponse(400, null, "Receiver ID is required"));
    }
  
    // 1. 🔒 Chat validation
    const chat = await Chat.findById(chatId).lean();
    // console.log("chat", chat);
  
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }
    // console.log(chat.institute, req.user.institute);
    if (chat.institution.toString() !== req.user.institution._id.toString()) {
      return res.json(new apiresponse(403, null, "Access denied: Different institute"));
    }
  
    const isMember = chat.members.some((member) =>
      member._id.toString() === senderId.toString()
    );
  
    if (!isMember) {
      return res.json(new apiresponse(403, null, "You are not a member of this chat"));
    }
    
    // let attachments = [];

    // console.log(req.files);
    let attachments = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(async (file) => {
          // console.log("File", file);
          const uploadResult = await uploadOnCloudinary(file.path);
          console.log("skmsks,sls",uploadResult)
           // return { public_id, url }
          return {
            url: uploadResult.url,
            fileType:(uploadResult.format === 'pdf')?'pdf': (uploadResult.resource_type),
          };
        })
      );
      attachments = uploads;
    }
    
    // 3. 💬 Create and store message
     await Message.create({
      institution: chat.institution,
      sender: {
        _id: senderId,
      },
      chat: chatId,
      content: content || "",
      attachments,
      receiver: receiver,
    });

    const user = req.user
    const message = {
    content: content||"",
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
    receiver: receiver,
  
   }
  
    // const populatedMessage = await message
    //   .populate("sender", "name avatar role")
    //   .execPopulate?.() || message;
  
    // 4. 📩 Response
    return res.json(
      new apiresponse(200, message, "Message sent successfully")
    );
});
const getIndividualMessageController = asynhandler(async (req, res) => {
  const chatId = req.params.chatId;
  const { page = 1 } = req.query;
  const user = req.user;

  if (!chatId || chatId === 'undefined') {
    return res.json(new apiresponse(400, null, "Chat ID is required"));
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.json(new apiresponse(400, null, "Invalid Chat ID format"));
  }

  if (!user) {
    return res.json(new apiresponse(401, null, "Unauthorized"));
  }

  const resultPerPage = 7;
  const skip = (page - 1) * resultPerPage;

  // Step 1: Fetch Chat
  const chat = await Chat.findById(chatId).lean();

  if (!chat) {
    return res.json(new apiresponse(404, null, "Chat not found"));
  }

  // Step 2: Institute Check
  if (chat.institution?.toString() !== user.institution?._id?.toString()) {
    return res.json(new apiresponse(403, null, "Access denied"));
  }

  // Step 3: Membership Check
  const isMember = chat.members.some(
    (member) => member._id.toString() === user._id.toString()
  );

  if (!isMember) {
    return res.json(new apiresponse(403, null, "You are not a member of this chat"));
  }

  // Step 4: Fetch Paginated Messages where user is the receiver only
  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({
      chat: chatId,
      receiver: user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name avatar role publicKey")
      .lean(),
       Message.countDocuments({
      chat: chatId,
      receiver: user._id,
    }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;
  const hasNextPage = page < totalPages;

  return res.json(
    new apiresponse(
      200,
      {
        data: messages.reverse(), // Oldest first
        totalPages,
        hasNextPage,
      },
      "Messages fetched successfully"
    )
  );
});

const getChatMediaController = asynhandler(async (req, res) => {
  const {chatId} = req.body
  const user = req.user;

  if (!chatId || chatId === 'undefined') {
    return res.json(new apiresponse(400, null, "Chat ID is required"));
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.json(new apiresponse(400, null, "Invalid Chat ID format"));
  }

  if (!user) {
    return res.json(new apiresponse(401, null, "Unauthorized"));
  }

  // Step 1: Fetch Chat
  const chat = await Chat.findById(chatId).lean();
  if (!chat) {
    return res.json(new apiresponse(404, null, "Chat not found"));
  }

  // Step 2: Institute Check
  if (chat.institution._id?.toString() !== user.institution?._id?.toString()) {
    return res.json(new apiresponse(403, null, "Access denied"));
  }

  // Step 3: Membership Check
  const isMember = chat.members.some(
    (member) => member._id.toString() === user._id.toString()
  );

  if (!isMember) {
    return res.json(new apiresponse(403, null, "You are not a member of this chat"));
  }

  // Step 4: Fetch messages with media attachments
  const mediaMessages = await Message.find({
    chat: chatId,
    receiver: user._id,
    attachments: { $exists: true, $ne: [] }  // non-empty attachments
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name avatar role publicKey")
    .lean();

  return res.json(new apiresponse(200, mediaMessages, "Media messages fetched successfully"));
});

// Step 5: Delete Message
const deleteMessageController = asynhandler(async (req, res) => {
  try {
    const { messageId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json(new apiresponse(401, null, "Unauthorized"));
    }

    if (!messageId || messageId === 'undefined') {
      return res.status(400).json(new apiresponse(400, null, "Message ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json(new apiresponse(400, null, "Invalid Message ID format"));
    }

    // Step 1: Fetch the message along with chat and institution references
    const message = await Message.findById(messageId)
      .populate("chat", "members") // only fetch members from chat
      .populate("institution", "_id")
      .lean();

    if (!message) {
      return res.status(404).json(new apiresponse(404, null, "Message not found"));
    }

    // Step 2: Institution Check
    if (
      message.institution?._id?.toString() !== user.institution?._id?.toString()
    ) {
      return res.status(403).json(new apiresponse(403, null, "Access denied"));
    }

    // Step 3: Membership Check
    const isMember = message.chat.members.some(
      (member) => member.toString() === user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json(new apiresponse(403, null, "You are not a member of this chat"));
    }

    // Step 4: Delete the message
    await Message.findByIdAndDelete(messageId);

    return res.status(200).json(new apiresponse(200, null, "Message deleted successfully"));
  } catch (error) {
    console.error("deleteMessageController error:", error);
    return res.status(500).json(new apiresponse(500, null, "Internal Server Error"));
  }
});

export {
    sendMessageController,
    getIndividualMessageController,
    getChatMediaController
}

