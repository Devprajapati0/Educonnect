import { User } from "../models/user.model.js";

export const socketAuthenticator = async (err, socket, next) => {
    try {
      // Extract token from cookie or authorization header
      const token =
        socket.request?.cookies?.userToken ||
        socket.request?.headers?.authorization?.replace("Bearer ", "");
  
      if (!token) {
        return next(new Error("Authentication token missing"));
      }
      console.log("token",token)
  
      // Verify token
      const decoded = jwt.verify(token, process.env.USER_SECRET);
      if (!decoded || !decoded._id) {
        return next(new Error("Invalid token"));
      }
      console.log("decoded",decoded)
  
      // Find user
      const user = await User.findById(decoded._id).select("-password");
      if (!user) {
        return next(new Error("User not found"));
      }
      console.log("user",user)
      // Attach user to socket
      req.subdomain = req.params.subdomain;
        //  console.log("req.subdomain",req.subdomain)
        console.log("req.subdomain",req.params.subdomain)
        console.log("user.institution.subdomain",user.institution.subdomain)
        
        if(req.subdomain != user.institution.subdomain) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
        console.log("req.params.role",req.params.role)
        console.log("user.role",user.role)

        if(req.params.role != user.role) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket authentication error:", err);
      return next(new Error("Authentication error"));
    }
  };