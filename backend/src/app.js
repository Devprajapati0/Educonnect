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



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// Import routes


export {app}