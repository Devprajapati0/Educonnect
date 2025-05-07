import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateAccessToken = ({_id,username,email}) => {
    // console.log("generateAccessToken",_id,username,email)
    // console.log("generateAccessToken",process.env.INSTITUTE_SECRET)
    // console.log("generateAccessToken",process.env.INSTITUT_EXPIRY)
    return jwt.sign(
        {
          _id: _id,
          username: username,
          email: email,
        },
        process.env.INSTITUTE_SECRET,
        {
          expiresIn: process.env.INSTITUT_EXPIRY,
        }
      );
}

export const generateAccessTokenofUser = ({_id,username,email,role,subdomain}) => {
    // console.log("generateAccessToken",_id,username,email)
    // console.log("generateAccessToken",process.env.INSTITUTE_SECRET)
    // console.log("generateAccessToken",process.env.INSTITUT_EXPIRY)
    return jwt.sign(
        {
          _id: _id,
          username: username,
          email: email,
          role:role,
          subdomain:subdomain
        },
        process.env.USER_SECRET,
        {
          expiresIn: process.env.USER_EXPIRY,
        }
      );
}

