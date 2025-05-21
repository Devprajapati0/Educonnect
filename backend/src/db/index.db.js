import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 
const url = process.env.MONGO_URI;
console.log(url);
const connect_DB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(url);
        console.log(`\n mongodb connected || DB: || ${connectionInstance.Connection.host}`);
    } catch (error) {
        console.log("database connection || DB || index.db.js ||",error);
        process.exit(1)
    }
} 
 
export  {connect_DB};
