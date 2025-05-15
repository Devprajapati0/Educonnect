import jwt from 'jsonwebtoken';
import {asynhandler} from '../utils/asynchandler.js';
import {apiresponse} from '../utils/apiResponse.js';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';

dotenv.config();

const userAuthenticator = asynhandler(async(req,res,next) => {
    try {
        const userToken = await req.cookies.userToken || req.headers['Authorization']?.replace('Bearer ','');
        // console.log("accessToken",accessToken)
        // console.log("1111111111111111111111111111111111111n b bha sbhxhsgchdbhjxbhxbhdchbhbbchbdxhdhjjhdxbbhdcbhjhahbhscbd chbhcdhbc jdbchjbdjch dhcbijdcjhbdhjchdcbdjcbdcindjd jcdjcjdcbjdc")
        // console.log("🚀 REQ URL:", req.url);
        // console.log("🚀 REQ PARAMS:", req.params);
        // console.log("🚀 REQ PATH:", req.path);
        //  console.log("userToken",userToken)
        if(!userToken) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
    
        const decode = jwt.verify(userToken,process.env.USER_SECRET);
        //  console.log("decode",decode)
        if(!decode) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
        // console.log("3")

        const user = await User.findById(decode._id).select('-password');
        // console.log("user",user)
        if(!user) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
        // console.log("ddkl fkv ",req.params)
        req.subdomain = req.params.subdomain;
        //  console.log("req.subdomain",req.subdomain)
        // console.log("req.subdomain",req.params.subdomain)
        // console.log("user.institution.subdomain",user.institution.subdomain)
        
        if(req.subdomain != user.institution.subdomain) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
        // console.log("req.params.role",req.params.role)
        // console.log("user.role",user.role)

        if(req.params.role != user.role) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
        req.user = user;
        next();
    } catch (error) {
        return res.json(
            new apiresponse(401, null,"Unauthorized Access login again")
        )
    }
})
export default userAuthenticator;