import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { Chat } from '../models/chat.model.js';

const router = express.Router();


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


router.post('/', protectRoute, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    
    const existingChat = await Chat.findOne({
      participants: {
        $all: [req.user._id, participantId],
        $size: 2
      }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    
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


router.delete('/:chatId', protectRoute, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: { $in: [req.user._id] }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    
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


router.put('/:chatId/read', protectRoute, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: { $in: [req.user._id] }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    
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