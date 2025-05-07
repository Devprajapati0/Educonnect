import { asynhandler } from "../utils/asynchandler.js"
import { apiresponse } from "../utils/apiResponse.js"
import { uploadOnCloudinary } from "../helpers/cloudinary.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"

const detectFileType = (mimetype) => {
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
    const { content, chatId } = req.body;
    const senderId = req.user?._id;
  
    if (!chatId) {
      return res.json(new apiresponse(400, null, "Chat ID is required"));
    }
  
    // 1. 🔒 Chat validation
    const chat = await Chat.findById(chatId).lean();
  
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }
  
    if (chat.institute.toString() !== req.user.institute.toString()) {
      return res.json(new apiresponse(403, null, "Access denied: Different institute"));
    }
  
    const isMember = chat.members.some((member) =>
      member._id.toString() === senderId.toString()
    );
  
    if (!isMember) {
      return res.json(new apiresponse(403, null, "You are not a member of this chat"));
    }
    
    let attachments = [];
  
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await uploadOnCloudinary(file.path);
          return {
            url: uploadResult.secure_url,
            fileType: detectFileType(uploadResult.resource_type),
          };
        })
      );
      attachments = uploads;
    }
  
    // 3. 💬 Create and store message
    const message = await Message.create({
      sender: senderId,
      chat: chatId,
      content: content || "",
      attachments,
    });
  
    const populatedMessage = await message
      .populate("sender", "username avatar role")
      .populate("replyTo")
      .execPopulate?.() || message;
  
    // 4. 📩 Response
    return res.json(
      new apiresponse(200, populatedMessage, "Message sent successfully")
    );
  });

const getIndividualMessageController = asynhandler(async (req, res) => {
    const chatId = req.params.chatId;
    const { page = 1 } = req.query;
    const user = req.user;
    console.log("user..",user)
  
    const resultPerPage = 10;
    const skip = (page - 1) * resultPerPage;
  
    // Step 1: Fetch Chat
    const chat = await Chat.findById(chatId).lean();
  
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }
  
    // Step 2: Check Institute Context
    if (chat.institute.toString() !== user.institute.toString()) {
      return res.json(new apiresponse(403, null, "Access denied"));
    }
  
    // Step 3: Check if User is a Member
    const isMember = chat.members.some((member) =>
      member._id.toString() === user._id.toString()
    );
  
    if (!isMember) {
      return res.json(new apiresponse(403, null, "You are not a member of this chat"));
    }
  
    // Step 4: Fetch Paginated Messages
    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "username avatar role") // Adjust fields as per your user schema
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);
  
    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;
    const hasNextPage = page < totalPages;
  
    return res.json(
      new apiresponse(
        200,
        {
          data: messages.reverse(), // Show oldest first
          totalPages,
          hasNextPage,
        },
        "Messages fetched successfully"
      )
    );
});

export {
    sendMessageController,
    getIndividualMessageController
}