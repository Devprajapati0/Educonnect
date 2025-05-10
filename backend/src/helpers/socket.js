import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
export const socketAuthenticator = async (socket, next) => {
  try {
    console.log("Socket authentication started");
    const token =
    socket.handshake?.auth?.token ||
    socket.request?.cookies?.userToken ||
    socket.request?.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    console.log("Socket token:", token);

    const decoded = jwt.verify(token, process.env.USER_SECRET);
    if (!decoded || !decoded._id) {
      return next(new Error("Invalid token"));
    }

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return next(new Error("User not found"));
    }

    // Attach user to socket
    
    // You might want to send subdomain/role via a custom handshake query
    const { subdomain, role } = socket.handshake.query;
    
    if (subdomain !== user.institution.subdomain) {
      return next(new Error("Unauthorized: Invalid subdomain"));
    }
    
    if (role !== user.role) {
      return next(new Error("Unauthorized: Invalid role"));
    }
    socket.user = user;
    next()
    

  } catch (err) {
    console.error("Socket authentication error:", err);
    return next(new Error("Authentication error"));
  }
};