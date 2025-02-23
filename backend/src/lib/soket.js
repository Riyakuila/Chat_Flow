import {Server} from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["my-custom-header"],
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
        console.log("User setup complete:", userData._id);
    });

    socket.on("disconnect", async () => {
        console.log("a user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        if (userId) {
            await User.findByIdAndUpdate(userId, { 
                isOnline: false,
                lastSeen: new Date()
            });
            io.emit("userOffline", userId);
        }
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });

    // Handle user coming online
    socket.on('setUserOnline', async (userId) => {
        try {
            // Update user's online status in database
            await User.findByIdAndUpdate(userId, { 
                isOnline: true,
                lastSeen: new Date()
            });
            
            // Broadcast to all clients that user is online
            io.emit('userOnline', userId);
        } catch (error) {
            console.error('Error setting user online:', error);
        }
    });

    // Handle user going offline
    socket.on('setUserOffline', async (userId) => {
        try {
            // Update user's online status in database
            await User.findByIdAndUpdate(userId, { 
                isOnline: false,
                lastSeen: new Date()
            });
            
            // Broadcast to all clients that user is offline
            io.emit('userOffline', userId);
        } catch (error) {
            console.error('Error setting user offline:', error);
        }
    });
});

export {io, server, app};