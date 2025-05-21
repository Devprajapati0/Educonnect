import jwt from 'jsonwebtoken';
import {asynhandler} from '../utils/asynchandler.js';
import {apiresponse} from '../utils/apiresponse.js';
import dotenv from 'dotenv';
import { Institution } from '../models/institution.model.js';
dotenv.config();

const instituteAuthenticator = asynhandler(async(req,res,next) => {
    try {
        const instituteToken = await req.cookies.institutetoken || req.headers['Authorization']?.replace('Bearer ','');
        // console.log("accessToken",accessToken)
        // console.log("1111111111111111111111111111111111111n b bha sbhxhsgchdbhjxbhxbhdchbhbbchbdxhdhjjhdxbbhdcbhjhahbhscbd chbhcdhbc jdbchjbdjch dhcbijdcjhbdhjchdcbdjcbdcindjd jcdjcjdcbjdc")
        if(!instituteToken) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
    
        const decode = jwt.verify(instituteToken,process.env.INSTITUTE_SECRET);
        // console124_DEV.log("decode",decode)
        if(!decode) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
        // console.log("3")

        const user = await Institution.findById(decode._id).select('-password -refreshToken');
        if(!user) {
            return res.json(
                new apiresponse(401, null,"Unauthorized Access login again")
            )
        }
        req.institute = user;
        next();
    } catch (error) {
        return res.json(
            new apiresponse(401, null,"Unauthorized Access login again")
        )
    }
})
export default instituteAuthenticator;