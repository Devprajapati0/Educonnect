import { loginSchema, signupSchema, uniqueSubdoamin, updateInstituteProfileSchema } from "../schemas/institution.schema.js"
import { asynhandler } from "../utils/asynchandler.js"
import { apiresponse } from "../utils/apiResponse.js"
import { Institution } from "../models/institution.model.js"
import { stripe } from "../helpers/stripe.js"
import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../helpers/cloudinary.js"
import { publicKeyCheck, userLoginSchema, userPasswordUpdateSchema, userSignupSchema } from "../schemas/user.schema.js"
import { generateAccessTokenofUser } from "../helpers/jwt.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"


const generateToken = async(userId) => {
  try {
    const userExisted = await User.findById(userId);
    if (!userExisted) {
      return res.json(
        new apiresponse(400, null, "Signup to have an account")
    );
    }
    // console.log("userExisted", userExisted)

    const userToken = generateAccessTokenofUser({
      _id: userExisted._id,
      username: userExisted.name,
      email: userExisted.email,
      role:userExisted.role,
      subdomain:userExisted.institution.subdomain
    })

    // console.log("institutetoken", institutetoken)
    // console.log("userToken", userToken)

    return userToken;
  } catch (error) {
    console.error("Error generating token:", error);
    return res.json(
      new apiresponse(500, null, "Server error during token generation")
    );
  }
}

const userSignup = asynhandler(async (req, res) => {
    try {
      // console.log("Incoming request:", req.body)
  
      const parseData = userSignupSchema.safeParse(req.body)
      if (!parseData.success) {
        console.log("Validation error:", parseData.error.format?.())
        return res.status(400).json(new apiresponse(400, null, "Invalid input fields"))
      }
  
      const {
        name,
        email,
        password,
        rollnumber,
        subdomain,
        role,
        batch,
        department,
        parentofemail,
        parentofname,
        avatar,
        
      } = parseData.data
  
      // Validate subdomain
      const instituteData = await Institution.findOne({ subdomain })
      if (!instituteData) {
        return res.status(404).json(new apiresponse(404, null, "Institute not found"))
      }
  
      // Check for existing user
      const existingUser = await User.findOne({
        rollnumber,
        email,
        role,
        "institution.subdomain": subdomain,
      })
      if (existingUser) {
        return res.status(409).json(new apiresponse(409, null, "User already exists"))
      }
  
      // Role-based validation
      if (role === "student" && !batch) {
        return res.status(400).json(new apiresponse(400, null, "Batch is required for students"))
      }
  
      if (role === "teacher" && !department) {
        return res.status(400).json(new apiresponse(400, null, "Department is required for teachers"))
      }
  
      if (role === "parent") {
        if (!parentofemail) {
          return res.status(400).json(new apiresponse(400, null, "Student email (parentof) is required"))
        }
        
        const referencedStudent = await User.findOne({
          email: parentofemail,
          role: "student",
          "institution.subdomain": subdomain,
        })
  
        if (!referencedStudent) {
          return res.status(404).json(new apiresponse(404, null, "Referenced student not found"))
        }

        if(!parentofname){
            return res.status(400).json(new apiresponse(400, null, "Student name (parentof) is required"))
        }
        if(referencedStudent.name != parentofname){
            return res.status(400).json(new apiresponse(400, null, "Student name is wrong"))
        }
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
  
     
     
  
  
      // Create new user
      let image = null;
      if(avatar){
        const uploadResult = await uploadOnCloudinary(avatar);
        if (!uploadResult) {
          return res.status(400).json(new apiresponse(400, null, "Error uploading image"))
        }
        image = uploadResult.url;
        
        
      }
      // console.log("instituteData", instituteData)
      const userData = new User({
        name,
        email,
        password: hashedPassword,
        rollnumber,
        role,
        avatar:image,
        batch: role === "student" ? batch : undefined,
        department: role === "teacher" ? department : undefined,
        parentofemail: role === "parent" ? parentofemail : undefined,
        parentofname:role === "parent" ?parentofname:undefined,
        institution: {
          _id: instituteData._id,
          fullname: instituteData.fullname,
          subdomain: instituteData.subdomain,
          logo: instituteData.logo,
          subscription: instituteData.subscription,
          email: instituteData.email,
        },
      })
  
      await userData.save()

      //create a nw indivusla chat
      

      return res.status(201).json(new apiresponse(201, userData, `${role} created successfully`))
    } catch (error) {
      console.error("Signup error:", error)
  
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0]
        const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`
        return res.status(409).json(new apiresponse(409, null, message))
      }
  
      return res.status(500).json(new apiresponse(500, null, "Internal server error"))
    }
})

const loginUser = asynhandler(async (req, res) => {
  try {
    // console.log(req.body);
    const parseData = userLoginSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.json(
        new apiresponse(400, null, "All fields are required")
      );
    }

    const { email, password, role,subdomain } = parseData.data;
    const user = await User.findOne({
      email,
      role,
      "institution.subdomain": subdomain,
      
    });

    if (!user) {
      return res.json(
        new apiresponse(400, null, "No account found with this email and role. Contact supervisor.")
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json(
        new apiresponse(400, null, "Invalid password")
      );
    }

    const token =await generateToken(user._id);
    // console.log("token", token);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.cookie("userToken", token, options).json(
      new apiresponse(200, {user,token}, "Login successful")
    );
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

const updatePublicKey = asynhandler(async(req,res) => {
  try {
    //  console.log("updatePublicKey",req.body)
     const parseData = publicKeyCheck.safeParse(req.body)
     if (!parseData.success) {
        console.log("Validation error:", parseData.error.format?.())
        return res.json(new apiresponse(400, null, "Invalid input fields"))
      }
  
      const { userId, publicKey } = parseData.data
  
      const user = await User.findById(userId)
      if (!user) {
        return res.json(new apiresponse(404, null, "User not found"))
      }
  
      user.publicKey = publicKey
      await user.save()
      // Update the public key in the chat model
      const chats = await Chat.updateMany(
        { "members._id": userId },
        { $set: { "members.$.publicKey": publicKey } }
      )
      if (!chats) {
        return res.json(new apiresponse(500, null, "Failed to update public key in chat"))
      }
  
      return res.json(new apiresponse(200, user, "Public key updated successfully"))
    
  } catch (error) {
    console.error("Error updating public key:", error)
    return res.json(new apiresponse(500, null, "Internal server error"))
  }
})

const updateUserPasssword = asynhandler(async(req,res) => {
  try {
    // console.log("updateUserPasssword",req.body)
    const parseData =  userPasswordUpdateSchema.safeParse(req.body)
    if (!parseData.success) {
        console.log("Validation error:", parseData.error.format?.())
        return res.json(new apiresponse(400, null, "Invalid input fields"))
      }
     const {role,subdomain,email,newPassword,confirmPassword} = parseData.data
    const user = await User.findOne({email,role, "institution.subdomain": subdomain}) 
    if (!user) {
      return res.json(new apiresponse(404, null, "User not found"))
    }
    if(newPassword !== confirmPassword){
      return res.json(new apiresponse(400, null, "New password and confirm password do not match"))
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    return res.status(200).json(new apiresponse(200, user, "Password changed successfully"))
  } catch (error) {
    console.error("Error changing password:", error)
    return res.status(500).json(new apiresponse(500, null, "Internal server error"))
  }
})

const getAllUsersBasedOnRole = asynhandler(async (req, res) => {
  try {
    // console.log("getAllUsersBasedOnRole", req.user);

    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { _id, role, institution } = req.user;

    const data = {
      students: [],
      parents: [],
      teachers: [],
      admins:[]
    };

    // 1. Get all users from the same institution except current user
    const allUsers = await User.find({
      _id: { $ne: _id },
      "institution._id": institution._id,
    }).select("_id name role email avatar publicKey");

    // 2. Get all *non-group* chats where the current user is a member
    const userChats = await Chat.find({
      groupchat: false,
      "members._id": _id,
    }).select("members");

    // 3. Collect user IDs already in chat
    const chattingWithUserIds = new Set();
    userChats.forEach((chat) => {
      chat.members.forEach((member) => {
        if (member._id.toString() !== _id.toString()) {
          chattingWithUserIds.add(member._id.toString());
        }
      });
    });

    // 4. Role-based filtering
    allUsers.forEach((user) => {
      // console.log("User:", user);
      if(user.publicKey != null){
      const userId = user._id.toString();
      if (chattingWithUserIds.has(userId)) return;

      if (role === "admin") {
        data[user.role + "s"]?.push(user); // students, teachers, parents
      }

      if (role === "teacher" && ["student", "parent"].includes(user.role)) {
        data[user.role + "s"]?.push(user);
      }

      if (role === "parent" && ["teacher", "parent"].includes(user.role)) {
        data[user.role + "s"]?.push(user);
      }

      if (role === "student" && ["teacher", "student"].includes(user.role)) {
        data[user.role + "s"]?.push(user);
      }
    }
    });

    if (
      !data.students.length &&
      !data.parents.length &&
      !data.teachers.length &&
      !data.admins.length
    ) {
      return res.json(new apiresponse(404, data, "No users found"));
    }

    // console.log("Filtered Users:", data);

    return res.json(
      new apiresponse(200, data, "Available users to start new chat")
    );
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});

const getUserForGroups = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { _id, role, institution } = req.user;
    console.log("getUserForGroups", req.user);

    // Base filter: exclude self, match institution, ensure publicKey exists
    let filter = {
      _id: { $ne: _id },
      "institution._id": institution._id,
      publicKey: { $ne: null }
    };

    // Role-based filtering logic
    if (role === "admin") {
      // Admins can see all (no role filter)
    } else if (role === "teacher") {
      filter.role = { $in: ["student", "parent","teacher"] };
    } else if (role === "student" ) {
      filter.role = { $in: ["student","teacher"] };
    } 
    else if (role === "parent") {
      filter.role = { $in: ["parent","teacher"] };
    }
    else {
      // fallback: deny if role not recognized
      return res.json(new apiresponse(403, null, "Unauthorized role"));
    }

    const users = await User.find(filter).select("_id name role email avatar publicKey");

    if (!users || users.length === 0) {
      return res.json(new apiresponse(404, null, "No users found"));
    }
    console.log("Filtered Users:", users);

    return res.json(new apiresponse(200, users, "Available users to start new group"));
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});

const getUserProfile = asynhandler(async (req, res) => {
  try {
    if(!req.user){
      return res.json(new apiresponse(401, null, "login to your account"));
    }
    const { _id,role ,institution} = req.user;
    console.log("getUserProfile",req.user)

    const data = await User.findById(
      _id,
    ).select("-password");

    if (!data) {
      return res.json(new apiresponse(404, null, "User not found"));
    }
    if (data?.role !== role) {
      return res.json(new apiresponse(403, null, "Forbidden"));
    }
    if (data?.institution?._id.toString() !== institution?._id.toString()) {
      return res.json(new apiresponse(403, null, "Forbidden"));
    }
    return res.json(new apiresponse(200, data, "User profile fetched successfully"));


  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Failed to fetch profile"));
  }
})

const updateUserProfile = asynhandler(async(req,res) => {
  // console.log("HIT: updateUserProfile controller");
  if(!req.user){
    return res.json(new apiresponse(401, null, "login to your account"));
  }
 try {
   const { _id,role ,institution} = req.user;
  //  console.log("updateUserProfile",req.body)
   const {name,avatar} = req.body;
   const data = await User.findById(
     _id,
   ).select("-password");
 
   if (!data) {
     return res.json(new apiresponse(404, null, "User not found"));
   }
   if (data?.role !== role) {
     return res.json(new apiresponse(403, null, "Forbidden"));
   }
   if (data?.institution?._id.toString() !== institution?._id.toString()) {
     return res.json(new apiresponse(403, null, "Forbidden"));
   }
 
   if(avatar){
     const url = await uploadOnCloudinary(avatar);
     if (!url) {
       return res.json(new apiresponse(400, null, "Error uploading image"))
     }
     data.avatar = url.url;
   }
   if(name){
     data.name = name;
   }
   await data.save();
   await Chat.updateMany(
    { "members._id": _id },
    {
      $set: {
        "members.$[elem].name": data.name,
        "members.$[elem].avatar": data.avatar,
      },
    },
    {
      arrayFilters: [{ "elem._id": _id }],
    }
  );

   return res.json(new apiresponse(200, data, "User profile updated successfully"));
 } catch (error) {
   console.error(error);
   return res.json(new apiresponse(500, null, "Failed to update profile"));
 }


})

const getPublicKey = asynhandler(async(req,res) => {
  const {userId} = req.body;
  console.log("getPublicKey",userId)
  if(!userId){
    return res.json(new apiresponse(400, null, "User ID is required"));
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json(new apiresponse(404, null, "User not found"));
    }
    if (!user.publicKey) {
      return res.json(new apiresponse(404, null, "Public key not found"));
    }
    console.log("Public key:", user.publicKey);
    return res.json(new apiresponse(200, user.publicKey, "Public key fetched successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Failed to fetch public key"));
  }
})

const getAllUsersForAdmin = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Login to your account"));
    }

    const { _id, role, institution } = req.user;

    // Only admin can access this
    if (role !== "admin") {
      return res.json(new apiresponse(403, null, "Forbidden"));
    }

    // Fetch all users from the same institution except the current user
    const users = await User.find({
      _id: { $ne: _id },
      "institution._id": institution._id,
    }).select("_id name role email avatar publicKey");

    if (!users || users.length === 0) {
      return res.json(new apiresponse(404, null, "No users found"));
    }

    // Group users by role
    const datatosend = {
      students: [],
      parents: [],
      teachers: [],
      admins: [],
    };

    users.forEach((user) => {
      const role = user.role?.toLowerCase();
      if (role === "student") datatosend.students.push(user);
      else if (role === "parent") datatosend.parents.push(user);
      else if (role === "teacher") datatosend.teachers.push(user);
      else if (role === "admin") datatosend.admins.push(user);
    });

    return res.json(new apiresponse(200, datatosend, "Users grouped by role"));
  } catch (error) {
    console.error("getAllUsersForAdmin error:", error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});
const deleteUser = asynhandler(async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized access"));
    }

    if (!userId) {
      return res.json(new apiresponse(400, null, "User ID is required"));
    }

    const requester = req.user;

    // Fetch the user to be deleted
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.json(new apiresponse(404, null, "User not found"));
    }

    if (userToDelete.role === "admin") {
      return res.json(new apiresponse(403, null, "Cannot delete admin user"));
    }

    // Institution check
    if (
      requester.role !== "admin" ||
      userToDelete.institution._id.toString() !== requester.institution._id.toString()
    ) {
      return res.json(new apiresponse(403, null, "Forbidden: You can't delete this user"));
    }

    // Check for single-admin groups
    const blockingChats = await Chat.aggregate([
      {
        $match: {
          "members._id": userId,
          groupchat: true,
          institution: requester.institution._id,
        },
      },
      {
        $project: {
          name: 1,
          isOnlyAdmin: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $size: "$isAdmin" }, 1] },
                  { $eq: [{ $arrayElemAt: ["$isAdmin", 0] }, userId] },
                ],
              },
              true,
              false,
            ],
          },
        },
      },
      {
        $match: {
          isOnlyAdmin: true,
        },
      },
    ]);

    if (blockingChats.length > 0) {
      return res.json(
        new apiresponse(
          400,
          blockingChats,
          `Cannot delete user: They are the only admin in these group chats (${blockingChats
            .map((chat) => chat.name)
            .join(", ")})`
        )
      );
    }

    // Remove user from chats in the same institution
    await Chat.updateMany(
      {
        "members._id": userId,
        institution: requester.institution._id,
        members: { $exists: true }, // ensure members array exists
      },
      {
        $pull: {
          members: { _id: userId },
        },
      }
    );
    
    // Remove user from isAdmin
    await Chat.updateMany(
      {
        isAdmin: { $exists: true, $type: "array" },
        institution: requester.institution._id,
      },
      {
        $pull: {
          isAdmin: userId,
        },
      }
    );

    // ✅ Delete all messages where the user is the receiver
    await Message.deleteMany({ receiver: userId });

    // ✅ (Optional) Delete messages where the user is sender too
    // await Message.deleteMany({ sender: userId });

    // Delete the user
    await User.deleteOne({ _id: userId });

    // Clear token (if stored in cookie)
    res
      .json(new apiresponse(200, null, "User deleted and logged out"));
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.json(new apiresponse(500, null, "Failed to delete user"));
  }
});

const getDashboardStats = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized access"));
    }

    const { role, institution } = req.user;

    if (role !== "admin") {
      return res.json(new apiresponse(403, null, "Forbidden"));
    }

    const institutionId = institution._id;

    // Count totals in parallel
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalParents,
      totalAdmins,
      totalGroups,
      totalPrivateChats,
      totalMessages,
    ] = await Promise.all([
      User.countDocuments({ "institution._id": institutionId }),
      User.countDocuments({ "institution._id": institutionId, role: "student" }),
      User.countDocuments({ "institution._id": institutionId, role: "teacher" }),
      User.countDocuments({ "institution._id": institutionId, role: "parent" }),
      User.countDocuments({ "institution._id": institutionId, role: "admin" }),
      Chat.countDocuments({ "institution": institutionId, groupchat: true }),
      Chat.countDocuments({ "institution": institutionId, groupchat: false }),
      Message.countDocuments({ "institution": institutionId }),
    ]);

    // Prepare date ranges: start of today - 6 days to end of today
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Ensure the dates are in UTC
    const startDate = new Date(sevenDaysAgo).toISOString();
    const endDate = new Date(today).toISOString();

    console.log("Start Date (Seven Days Ago):", startDate);
    console.log("End Date (Today):", endDate);

    const messages = await Message.find({
      "institution": institutionId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).select("createdAt");

    console.log("Messages found in the last 7 days:", messages);

    // Build daily counts for the last 7 days
    const messagesLast7Days = new Array(7).fill(0);

    messages.forEach((msg) => {
      const created = new Date(msg.createdAt);
      console.log("Created Date:", created);
      const createdUTC = new Date(
        Date.UTC(created.getFullYear(), created.getMonth(), created.getDate())
      );

      const diffDays = Math.floor((today - createdUTC) / (1000 * 60 * 60 * 24));
      const index = 6 - diffDays;

      console.log("Message Created At:", created);
      console.log("Difference in Days:", diffDays);

      if (index >= 0 && index < 7) {
        messagesLast7Days[index]++;
      }
    });

    console.log("Messages in last 7 days:", messagesLast7Days);

    const stats = {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalParents,
      totalAdmins,
      totalGroups,
      totalPrivateChats,
      totalMessages,
      messagesLast7Days,
    };

    return res.json(new apiresponse(200, stats, "Dashboard stats fetched successfully"));
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.json(new apiresponse(500, null, "Failed to fetch dashboard stats"));
  }
});

const logoutUser = asynhandler(async (req, res) => {
  try {
    if(!req.user){
      return res.json(new apiresponse(401, null, "Unauthorized access"));
    }
    const { _id, role, institution } = req.user;
    // Check if the user is logged in
    if (!req.cookies.userToken) {
      return res.json(new apiresponse(401, null, "No token found"));
    }
    // Clear the cookie
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: true,
    });

    return res.json(new apiresponse(200, null, "Logged out successfully"));
  } catch (error) {
    console.error("Logout error:", error);
    return res.json(new apiresponse(500, null, "Failed to log out"));
  }
}
);

export {
    userSignup,
    loginUser,
    updatePublicKey,
    updateUserPasssword,
    getAllUsersBasedOnRole,
    getUserForGroups,
    getUserProfile,
    updateUserProfile,
    getPublicKey,
    getAllUsersForAdmin,
    deleteUser,
    getDashboardStats,
    logoutUser
}