
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs' 
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET  
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new Error("File path is required");

    const fileUploaded = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Safely delete the file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return fileUploaded;
  } catch (error) {
    // Only try to delete if the file exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
