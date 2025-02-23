import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import dotenv from "dotenv";
import { connectDB } from './src/lib/db.js';
import cookieParser from "cookie-parser";
import messageRoutes from './src/routes/message.route.js';
import EventEmitter from 'events';
import cors from 'cors';
import chatRoutes from './src/routes/chat.routes.js';
import userRoutes from './src/routes/user.routes.js';
import {app, server} from './src/lib/soket.js';





dotenv.config();




const PORT = process.env.PORT;

// Add middleware debugging
app.use((req, res, next) => {
    console.log('Raw body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Add post-middleware debugging
app.use((req, res, next) => {
    console.log('Parsed body:', req.body);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);
connectDB();

EventEmitter.defaultMaxListeners = 15;

server.listen(PORT, () => {
    console.log("server is running on port:" + PORT);
});