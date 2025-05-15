import { asynhandler } from "../utils/asynchandler.js"
import { apiresponse } from "../utils/apiResponse.js"
import { Institution } from "../models/institution.model.js"
import { createGroupSchema, updatechatSchema } from "../schemas/chat.schema.js"
import { Chat } from "../models/chat.model.js"
import { uploadOnCloudinary } from "../helpers/cloudinary.js"
import mongoose from "mongoose"
import { parse } from "path"



const createGroupChat = asynhandler(async (req, res) => {
  try {
    // console.log("vhgvb ",req.user)
    if (!req.user) {
      return res.json(
        new apiresponse(401, null, "Unauthorized Access")
      )
    }
    const {_id,role} = req.user
     console.log('req.body', req.body)
    const pareseData = createGroupSchema.safeParse(req.body)
    if (!pareseData.success) {
        const errorMessage = pareseData.error.errors[0].message
        console.error("Error parsing data:", errorMessage)
        return res.json(
            new apiresponse(400, null, "Invalid request data", errorMessage)
        )
    }
    const { name, description, members, addmembersallowed,subdomain, sendmessageallowed ,groupchat,avatar} = pareseData.data
    
   
    //  console.log("userExisted", userExisted)

    
    const institution = await Institution.findOne({ subdomain })
    if (!institution) {
      return res.json(
        new apiresponse(400, null, "Institution not found")
      )
    }
    //  console.log("institution", institution)
    let image = null;
    if(avatar){
      const uploadResult = await uploadOnCloudinary(avatar);
      if (!uploadResult) {
        return res.status(400).json(new apiresponse(400, null, "Error uploading image"))
      }
      image = uploadResult.url;
      
      
    }
    console.log("image", image)

    const allmembers=[...members, {_id,role,name:req.user.name,avatar:req.user.avatar,publicKey:req.user.publicKey}]
      console.log("allmembers", allmembers)
    
    const chatData = {
     institution: institution._id,
     creator:{
         _id,
         role,
         fullname: req.user.name,
     },
     avatar: image || null,
     addmembersallowed,
        sendmessageallowed,
        iaAdmin:_id,
        name,
        description:description || null,
        members: allmembers,
        groupchat:groupchat || false,
        isAdmin:(groupchat == true)? _id:null,
    }
    const chat = await Chat.create(chatData);
     console.log("chat", chat)
    if (!chat) {
        return res.json(
            new apiresponse(400, null, "Chat not created")
        )
    }

    return  res.json(
        new apiresponse(200, chat,  `${groupchat ? "Group" : "Private"} chat created successfully`)
    )   
 


  } catch (error) {
    console.error(error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`;
            return res.json(new apiresponse(400, null, message));
        }
        return res.json(
            new apiresponse(500, null, "Server error during login")
        ); 
  }
});

const getMyChats = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { _id, role } = req.user;
    // console.log("sdedseed",req.user);

    const data = {
      students: [],
      parents: [],
      teachers: [],
      groups: [],
      admins:[],
    };

    // Fetch only chats where this user is a member
    const chats = await Chat.find({
      "members._id": _id, // Ensure the current user is in the chat
      institution: req.user.institution,
    });

    //  console.log("chats", chats);

    if (!chats || chats.length === 0) {
      return res.json(new apiresponse(404, null, "No chats found"));
    }

    chats.forEach((chat) => {
      const isCurrentUserInChat = chat.members.some((m) => m._id.toString() === _id.toString());
      if (!isCurrentUserInChat) return;
      // console.log("isCurrentUserInChat", isCurrentUserInChat);

      if (chat.groupchat) {
        const rolesInGroup = new Set(chat.members.map((m) => m.role));
        console.log("rolesInGroup", rolesInGroup);
        // const hasNoStudent = !rolesInGroup.has("student");
        // const hasTeacherOrParent = rolesInGroup.has("teacher") || rolesInGroup.has("parent");
          data.groups.push(chat);
      } else {
        chat.members.forEach((member) => {
          if (member._id.toString() === _id.toString()) return;
      
          const customChat = {
            ...chat.toObject(), // convert Mongoose doc to plain object
            name: member.name, // override name with the other member
            avatar: member.avatar, // override avatar
          };
      
          if (role === "admin") {
            data[member.role + "s"].push(customChat);
          }
      
          if (role === "parent") {
            data[member.role + "s"].push(customChat);
          }
      
          if (role === "teacher" ) {
            data[member.role + "s"].push(customChat);
          }
      
          if (role === "student") {
            data[member.role + "s"].push(customChat);
          }
        });
      }
    });

    return res.json(new apiresponse(200, data, "All chats fetched successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});

const deleteChat = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { chatId } = req.body;

    // Check if chatId exists and is a valid ObjectId
    if (!chatId || chatId === "undefined") {
      return res.json(new apiresponse(400, null, "Chat ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.json(new apiresponse(400, null, "Invalid Chat ID format"));
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }
   console.log("chat", chat)
    if (chat.institution.toString() !== req.user.institution._id.toString()) {
      return res.json(new apiresponse(403, null, "Access denied"));
    }

    if (chat.creator._id.toString() !== req.user._id.toString()) {
      return res.json(new apiresponse(403, null, "Only the creator can delete this chat"));
    }

    await Chat.findByIdAndDelete(chatId);
    return res.json(new apiresponse(200, null, "Chat deleted successfully"));
  } catch (error) {
    console.error("Delete Chat Error:", error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});
// const getChatForGroup = asynhandler(async (req, res) => {
const getChatDetails = asynhandler(async(req,res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }
    const { chatId } = req.params;
    console.log("chatId", chatId);
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }
    return res.json(new apiresponse(200, chat, "Chat fetched successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
})

const updateChatDetail = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    console.log("req.body", req.body);

    const parsedData = updatechatSchema.safeParse(req.body);
    if (!parsedData.success) {
      const errorMessage = parsedData.error.errors[0].message;
      console.error("Error parsing data:", errorMessage);
      return res.json(new apiresponse(400, null, "Invalid request data", errorMessage));
    }
    const {
      chatId,
      name,
      description,
      avatar,
      members,
      addmembersallowed,
      sendmessageallowed,
      isAdmin
    } = parsedData.data;

    const { _id } = req.user;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }

    const institution = await Institution.findById(chat.institution._id);
    if (!institution) {
      return res.json(new apiresponse(404, null, "Institution not found"));
    }

    const isMember = chat.members.some((member) => member._id.toString() === _id.toString());
    if (!isMember) {
      return res.json(new apiresponse(403, null, "You are not a member of this chat"));
    }

    // Only update fields if provided
    if (name) chat.name = name;
    if (description) chat.description = description;
    if (typeof addmembersallowed === "boolean") chat.addmembersallowed = addmembersallowed;
    if (typeof sendmessageallowed === "boolean") chat.sendmessageallowed = sendmessageallowed;
    if (Array.isArray(members)) {
      chat.members = members;
    }

    // Handle avatar upload
    if (avatar) {
      const uploaded = await uploadOnCloudinary(avatar);
      if (!uploaded?.url) {
        return res.json(new apiresponse(400, null, "Error uploading image"));
      }
      chat.avatar = uploaded.url;
    }

    if (Array.isArray(isAdmin)) {
      isAdmin.forEach((id) => {
        if (!chat.isAdmin.includes(id)) {
          chat.isAdmin.push(id);
        }
      });
    }

    await chat.save();

    return res.json(new apiresponse(200, chat, "Chat updated successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});

const exitGroup = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { chatId } = req.body;
    if (!chatId) {
      return res.json(new apiresponse(400, null, "Chat ID is required"));
    }
    const { _id } = req.user;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }
    // console.log("dsdsdsds",chat, req.user)
    if(chat.institution._id.toString() !== req.user.institution._id.toString()){
      return res.json(new apiresponse(403, null, "You are not a member of this chat"));
    }

    const userIndex = chat.members.findIndex(
      (member) => member._id.toString() === _id.toString()
    );

    if (userIndex === -1) {
      return res.json(new apiresponse(403, null, "You are not a member of this chat"));
    }

    const isAdmin = chat.isAdmin.some((adminId) => adminId.toString() === _id.toString());

    if (isAdmin) {
      const totalAdmins = chat.isAdmin.length;

      if (totalAdmins === 1) {
        return res.json(
          new apiresponse(
            403,
            null,
            "You are the only admin. Please assign another admin before exiting the group."
          )
        );
      }

      // Remove from admins
      chat.isAdmin = chat.isAdmin.filter((adminId) => adminId.toString() !== _id.toString());
    }

    // Remove from members
    chat.members = chat.members.filter((member) => member._id.toString() !== _id.toString());

    await chat.save();

    return res.json(new apiresponse(200, null, "Exited group successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});

const getAllChatsOfAllUsers = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { role } = req.user;
    

    if (role !== "admin") {
      return res.json(new apiresponse(403, null, "Only admins can access all chats"));
    }

    const allChats = await Chat.find({
      institution: req.user.institution._id,
    })
      .populate("members._id", "name avatar publicKey role")
      .populate("institution", "name subdomain")
      .lean();

      console.log("allChats", allChats);

    if (!allChats || allChats.length === 0) {
      return res.json(new apiresponse(404, null, "No chats found"));
    }

    const data = {
      chats: [],
      groups: [],
    };

    for (const chat of allChats) {
      if (chat.groupchat) {
        data.groups.push(chat);
      } else {
        data.chats.push(chat);
      }
    }

    return res.json(new apiresponse(200, data, "All chats fetched successfully"));
  } catch (error) {
    console.error("getAllChatsOfAllUsers error:", error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});

const deleteanyChatForAdmin = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { chatId } = req.body;
    console.log("chatId", chatId);

    // Check if chatId exists and is a valid ObjectId
    if (!chatId || chatId === "undefined") {
      return res.json(new apiresponse(400, null, "Chat ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.json(new apiresponse(400, null, "Invalid Chat ID format"));
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }

    await Chat.findByIdAndDelete(chatId);
    return res.json(new apiresponse(200, null, "Chat deleted successfully"));
  } catch (error) {
    console.error("Delete Chat Error:", error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
}
);

const removeMemeberFromGroupChat = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { chatId, memberId } = req.body;

    if (!chatId || chatId === "undefined") {
      return res.json(new apiresponse(400, null, "Chat ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.json(new apiresponse(400, null, "Invalid Chat ID format"));
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json(new apiresponse(404, null, "Chat not found"));
    }

    const userIndex = chat.members.findIndex(
      (member) => member._id.toString() === memberId.toString()
    );

    if (userIndex === -1) {
      return res.json(new apiresponse(403, null, "User not found in this chat"));
    }

    const isAdmin = chat.isAdmin?.includes(memberId);

    if (isAdmin) {
      // Check if they are the only admin
      if (chat.isAdmin.length === 1) {
        return res.json(
          new apiresponse(
            403,
            null,
            "Cannot remove the only admin from this group chat"
          )
        );
      }

      // Remove from isAdmin array too
      chat.isAdmin = chat.isAdmin.filter(
        (adminId) => adminId.toString() !== memberId.toString()
      );
    }

    // Remove from members array
    chat.members.splice(userIndex, 1);
    await chat.save();

    return res.json(new apiresponse(200, null, "Member removed successfully"));
  } catch (error) {
    console.error("Remove Member Error:", error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});


export { createGroupChat,getMyChats,getChatDetails,updateChatDetail,exitGroup,deleteChat,deleteanyChatForAdmin ,getAllChatsOfAllUsers,removeMemeberFromGroupChat}