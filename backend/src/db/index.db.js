import mongoose from 'mongoose';

const connect_DB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`mongodb://localhost:27017`);
        console.log(`\n mongodb connected || DB: || ${connectionInstance.Connection.host}`);
    } catch (error) {
        console.log("database connection || DB || index.db.js ||",error);
        process.exit(1)
    }
}

export  {connect_DB};
