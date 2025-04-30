import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));


app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({limit:'16kb',extended:true}))
app.use(cookieParser())
app.use(express.static("public"))


// Import routes
import institutionRoutes from './routes/institution.route.js';

app.use('/api/v1/institution', institutionRoutes);


export {app}