import express from 'express';
import User from '../models/user.model.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/search', protectRoute, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('fullName email profilePic')
    .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});


router.get('/', protectRoute, async (req, res) => {
  try {
    const users = await User.find({})
      .select('fullName email profilePic isOnline lastSeen')
      .sort({ isOnline: -1, fullName: 1 }); 

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router; 