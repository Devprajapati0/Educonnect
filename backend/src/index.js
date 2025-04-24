import { app } from "./app.js";
import dotenv from "dotenv";
import { connect_DB } from "./db/index.db.js";

dotenv.config();
connect_DB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`🧿 Server is running at port : ${process.env.PORT}`)
    })  
})
.catch((error)=>{ 
    console.log("Mongo DB connection failed || index.js ",console.error())
}) 