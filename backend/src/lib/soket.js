import {Server} from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

const userSocketMap = new Map(); 

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId);
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);

    if (userId) {
        
        userSocketMap.set(userId, socket.id);
        
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    }

    
    const pingInterval = setInterval(() => {
        socket.emit("ping");
    }, 5000);

    socket.on("pong", () => {
        
        console.log("Pong received from user:", userId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
        clearInterval(pingInterval);
        
        if (userId) {
        
            userSocketMap.delete(userId);
        
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    });

    socket.on("error", () => {
        console.log("Socket error for user:", userId);
        clearInterval(pingInterval);
        
        if (userId) {
            userSocketMap.delete(userId);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    });

    
    socket.on("disconnecting", () => {
        console.log("User disconnecting:", userId);
        if (userId) {
            userSocketMap.delete(userId);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    });


    socket.on("callUser", (data) => {
        console.log("Call request received:", data);
        const receiverSocketId = userSocketMap.get(data.userToCall);
        
        if (receiverSocketId) {
            console.log("Emitting call to receiver:", receiverSocketId);
            io.to(receiverSocketId).emit("callIncoming", {
                signal: data.signalData,
                from: data.from,
                name: data.name,
                isVideo: data.isVideo
            });
        } else {
            console.log("Receiver not found:", data.userToCall);
            socket.emit("callError", { 
                message: "User is not online",
                error: "USER_OFFLINE"
            });
        }
    });

    socket.on("answerCall", (data) => {
        console.log("Call answered:", data);
        const receiverSocketId = userSocketMap.get(data.to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callAccepted", data.signal);
        }
    });

    socket.on("declineCall", (data) => {
        console.log("Call declined:", data);
        const receiverSocketId = userSocketMap.get(data.to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callDeclined");
        }
    });

    socket.on("endCall", (userId) => {
        console.log("Call ended by:", socket.id);
        const receiverSocketId = userSocketMap.get(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callEnded");
        }
    });

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
            const receiverSocketId = userSocketMap.get(receiverId);
            
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
        const receiverSocketId = userSocketMap.get(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", {
                senderId: userId,
                isTyping: data.isTyping
            });
        }
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

    // Handle manual logout
    socket.on("logout", () => {
        console.log("User logged out:", userId);
        if (userId) {
            userSocketMap.delete(userId);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    });
});


setInterval(() => {
    for (const [userId, socketId] of userSocketMap.entries()) {
        const socket = io.sockets.sockets.get(socketId);
        if (!socket || !socket.connected) {
            console.log("Cleaning up stale connection for user:", userId);
            userSocketMap.delete(userId);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    }
}, 10000);

export {io, server, app};