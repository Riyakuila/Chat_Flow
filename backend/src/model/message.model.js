import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: null,
    },
    video: {
        type: String,
        default: null,
    },
    audio: {
        type: String,
        default: null,
    },
    location: {
        type: String,
        default: null,
    },
    reactions: {
        type: [String],
        default: [],
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    isForwarded: {
        type: Boolean,
        default: false,
    },
    forwardedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isStarred: {
        type: Boolean,
        default: false,
    },
    isTyping: {
        type: Boolean,
        default: false,
    },
    
},
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
