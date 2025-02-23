import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";
import { getReceiverSocketId, io } from "../lib/soket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        // Log incoming request data
        console.log('Request body:', req.body);
        console.log('Request params:', req.params);
        console.log('Authenticated user:', req.user);

        const { content } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Validate required fields
        if (!content || !receiverId || !senderId) {
            console.log('Missing required fields:', { content, receiverId, senderId });
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { content, receiverId, senderId }
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            timestamp: new Date()
        });

        // Log message before saving
        console.log('Attempting to save message:', newMessage);

        const savedMessage = await newMessage.save();
        console.log('Message saved successfully:', savedMessage);

        // Get receiver socket id and emit message
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", savedMessage);
            console.log('Message emitted to socket:', receiverSocketId);
        }

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Detailed error in sendMessage:", {
            message: error.message,
            stack: error.stack,
            details: error
        });
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message
        });
    }
};
