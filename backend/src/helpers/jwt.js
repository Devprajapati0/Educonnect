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

