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
    console.log("a user connected", socket.id);

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

    // Handle new message
    socket.on("sendMessage", async (messageData) => {
        try {
            const { receiverId, content } = messageData;
            
            // Save message to database
            const newMessage = new Message({
                senderId: userId,
                receiverId: receiverId,
                content: content,
                timestamp: new Date()
            });
            await newMessage.save();

            // Get receiver's socket id
            const receiverSocketId = userSocketMap[receiverId];

            // Emit message to both sender and receiver
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            socket.emit("messageSent", newMessage);

            console.log("Message sent:", newMessage);
        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("messageError", { error: "Failed to send message" });
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