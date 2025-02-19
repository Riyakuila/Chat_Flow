import { User } from "../models/user.model.js";
import Message from "../model/message.model.js";
import cloudinary from "cloudinary";

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
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const { message, image } = req.body;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "messages",
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId: userToChatId,
            message: message,
            image: image,
        });

        await newMessage.save();
        
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log("Error in sendMessage", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
