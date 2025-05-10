import { asynhandler } from "../utils/asynchandler.js"
import { apiresponse } from "../utils/apiResponse.js"
import { Institution } from "../models/institution.model.js"
import { createGroupSchema } from "../schemas/chat.schema.js"
import { Chat } from "../models/chat.model.js"
import { uploadOnCloudinary } from "../helpers/cloudinary.js"


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
    const { name, description, members, addmembersallowed,subdomain, sendmessageallowed ,groupchat} = pareseData.data
    
   
    //  console.log("userExisted", userExisted)

    
    const institution = await Institution.findOne({ subdomain })
    if (!institution) {
      return res.json(
        new apiresponse(400, null, "Institution not found")
      )
    }
    //  console.log("institution", institution)
    let image=null;
    if(req.file){
      const url = await uploadOnCloudinary(req.file.path);
      console.log("url", url)
      if (!url) {
        return res.json(
          new apiresponse(400, null, "Error uploading image")
        )
      }
      image = url.url;
    }
    console.log("req.file", req.file)
    console.log("image", image)

    const allmembers=[...members, {_id,role,name:req.user.name,avatar:req.user.avatar}]
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
        new apiresponse(200, chat, "Group chat created successfully")
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
        const hasNoStudent = !rolesInGroup.has("student");
        const hasTeacherOrParent = rolesInGroup.has("teacher") || rolesInGroup.has("parent");

        if (
          role === "admin" ||
          (role === "parent" && hasNoStudent && hasTeacherOrParent) ||
          role === "teacher"
        ) {
          data.groups.push(chat);
        }
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
      
          if (role === "parent" && ["teacher", "parent"].includes(member.role)) {
            data[member.role + "s"].push(customChat);
          }
      
          if (role === "teacher" && ["teacher", "student", "parent", "admin"].includes(member.role)) {
            data[member.role + "s"].push(customChat);
          }
      
          if (role === "student" && ["teacher", "student"].includes(member.role)) {
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


export { createGroupChat,getMyChats,getChatDetails }