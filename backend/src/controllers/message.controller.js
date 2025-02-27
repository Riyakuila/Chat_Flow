import User from "../models/user.model.js";
import Message from "../models/message.model.js";



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
        const { content } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!content || !receiverId) {
            return res.status(400).json({ message: "Content and receiver ID are required" });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            timestamp: new Date()
        });

        const savedMessage = await newMessage.save();
        
        // Just send the response, socket emission is handled separately
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
