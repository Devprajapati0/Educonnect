
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs' 
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET  
});


export const uploadOnCloudinary = async(loacllink)=>{
try {
        if(!loacllink)
        return "File cannot  be Found"
    
       const fileuploaded = await cloudinary.uploader.upload(loacllink,{
            resource_type: "auto"
        })

        fs.unlinkSync(loacllink)
        //  console.log("fileuploadedwwww",fileuploaded)
        return fileuploaded
} catch (error) {
    fs.unlinkSync(loacllink)
    throw error
}
}
