import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { Chat } from '../models/chat.model.js';

const router = express.Router();

// Get all chats with pagination
router.get('/', protectRoute, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const chats = await Chat.find({
      participants: { $in: [req.user._id] }
    })
      .populate('participants', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Chat.countDocuments({
      participants: { $in: [req.user._id] }
    });

    res.status(200).json({
      chats,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get single chat details
router.get('/:chatId', protectRoute, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: { $in: [req.user._id] }
    })
      .populate('participants', '-password')
      .populate('lastMessage');

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat details' });
  }
});

// Create a new chat
router.post('/', protectRoute, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    // Check if chat already exists between these users
    const existingChat = await Chat.findOne({
      participants: {
        $all: [req.user._id, participantId],
        $size: 2
      }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create new chat
    const newChat = await Chat.create({
      participants: [req.user._id, participantId],
      messages: []
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Archive/Delete chat
router.delete('/:chatId', protectRoute, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: { $in: [req.user._id] }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Instead of deleting, we'll archive it for the user
    chat.archivedFor = chat.archivedFor || [];
    if (!chat.archivedFor.includes(req.user._id)) {
      chat.archivedFor.push(req.user._id);
      await chat.save();
    }

    res.status(200).json({ message: 'Chat archived successfully' });
  } catch (error) {
    console.error('Error archiving chat:', error);
    res.status(500).json({ error: 'Failed to archive chat' });
  }
});

// Mark chat as read
router.put('/:chatId/read', protectRoute, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: { $in: [req.user._id] }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Update last read timestamp for the user
    chat.readBy = chat.readBy || {};
    chat.readBy[req.user._id] = new Date();
    await chat.save();

    res.status(200).json({ message: 'Chat marked as read' });
  } catch (error) {
    console.error('Error marking chat as read:', error);
    res.status(500).json({ error: 'Failed to mark chat as read' });
  }
});

export default router; 