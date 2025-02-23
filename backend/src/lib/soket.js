import {Server} from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

//used to store online users
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Handle joining a chat
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log("User joined chat:", chatId);
    });

    // Handle new message - ONLY emit to receiver, don't save to DB
    socket.on("sendMessage", async (messageData) => {
        try {
            const { receiverId, content, _id } = messageData;
            
            // Get receiver's socket id
            const receiverSocketId = userSocketMap[receiverId];
            
            // Only emit to receiver if they're online
            if (receiverSocketId) {
                const messageWithSender = {
                    _id,
                    senderId: userId,
                    receiverId,
                    content,
                    timestamp: new Date(),
                    senderInfo: await User.findById(userId).select('username profilePic')
                };
                
                io.to(receiverSocketId).emit("newMessage", messageWithSender);
            }
        } catch (error) {
            console.error("Error in socket message:", error);
            socket.emit("messageError", { error: "Failed to process message" });
        }
    });

    // Handle typing status
    socket.on("typing", (data) => {
        const receiverSocketId = userSocketMap[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", {
                senderId: userId,
                isTyping: data.isTyping
            });
        }
    });

    socket.on("disconnect", async () => {
        console.log("user disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            await User.findByIdAndUpdate(userId, { 
                isOnline: false,
                lastSeen: new Date()
            });
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
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