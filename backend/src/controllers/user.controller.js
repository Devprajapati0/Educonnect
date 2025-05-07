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
    console.log("userToken", userToken)

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
      console.log("instituteData", instituteData)
      const userData = new User({
        name,
        email,
        password: hashedPassword,
        rollnumber,
        role,
        avatar:avatar,
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
    console.log(req.body);
    const parseData = userLoginSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.json(
        new apiresponse(400, null, "All fields are required")
      );
    }

    const { email, password, role } = parseData.data;
    const user = await User.findOne({
      email,
      role,
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
    console.log("token", token);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.cookie("userToken", token, options).json(
      new apiresponse(200, user, "Login successful")
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
     console.log("updatePublicKey",req.body)
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
    console.log("updateUserPasssword",req.body)
    const parseData =  userPasswordUpdateSchema.safeParse(req.body)
    if (!parseData.success) {
        console.log("Validation error:", parseData.error.format?.())
        return res.json(new apiresponse(400, null, "Invalid input fields"))
      }
     const {role,subdomain,email,oldPassword,newPassword,confirmPassword} = parseData.data
    const user = await User.findOne({email,role, "institution.subdomain": subdomain}) 
    if (!user) {
      return res.json(new apiresponse(404, null, "User not found"))
    }
    if(newPassword !== confirmPassword){
      return res.json(new apiresponse(400, null, "New password and confirm password do not match"))
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.json(new apiresponse(400, null, "Invalid old password"))
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
    console.log("getAllUsersBasedOnRole",req.body)
    if (!req.user) {
      return res.json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { _id, role } = req.user;
    // console.log("User ID:", _id);
    // console.log("User Role:", role);

    const data = {
      students: [],
      parents: [],
      teachers: [],
    };

    // 1. Get all users except the current user
    const allUsers = await User.find({ _id: { $ne: _id } }).select("_id name role email avatar");
    // console.log("All Users:", allUsers);

    // 2. Get all *non-group* chats where the current user is a member
    const userChats = await Chat.find({
      groupchat: false,
      "members._id": _id,
    }).select("members");

    // 3. Collect all user IDs that this user is already chatting with
    const chattingWithUserIds = new Set();
    userChats.forEach((chat) => {
      chat.members.forEach((member) => {
        if (member._id.toString() !== _id.toString()) {
          chattingWithUserIds.add(member._id.toString());
        }
      });
    });

    // 4. Filter users NOT in chat and based on role logic
    allUsers.forEach((user) => {
      const userId = user._id.toString();

      if (chattingWithUserIds.has(userId)) return; // Already in chat

      if (role === "admin") {
        data[user.role + "s"]?.push(user);
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
    });
    if(!data.students.length && !data.parents.length && !data.teachers.length){
      return res.json(new apiresponse(404, data, "No users found"));
    }

    return res.json(new apiresponse(200, data, "Available users to start new chat"));
  } catch (error) {
    console.error(error);
    return res.json(new apiresponse(500, null, "Internal Server Error"));
  }
});
const getUserForGroups = asynhandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json(new apiresponse(401, null, "Unauthorized Access"));
    }

    const { _id, role } = req.user;
    // console.log("User ID:", _id);

    let filter = { _id: { $ne: _id } };

    if (role === "Admin") {
    } else if (role === "Teacher") {

      filter.role = { $in: ["Student", "Teacher"] };
    } else if (role === "Student") {

      filter.role = "Teacher";
    } else if (role === "Parent") {
      filter.role = "Teacher";
    } 
    console.log("Filter:", filter);

    const users = await User.find(filter).select("_id name role email avatar");
    console.log("Filtered Users:", users);

    if (!users || users.length === 0) {
      return res.status(404).json(new apiresponse(404, null, "No users found"));
    }

    return res.status(200).json(new apiresponse(200, users, "Available users to start new chat"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new apiresponse(500, null, "Internal Server Error"));
  }
});
export {
    userSignup,
    loginUser,
    updatePublicKey,
    updateUserPasssword,
    getAllUsersBasedOnRole,
    getUserForGroups
}