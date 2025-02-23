import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Only create the text index for fullName
userSchema.index({ fullName: 'text' });

const User = mongoose.model('User', userSchema);
export default User; 