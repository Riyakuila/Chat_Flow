import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  archivedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  readBy: {
    type: Map,
    of: Date,
    default: {}
  }
}, {
  timestamps: true
});


chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

export const Chat = mongoose.model('Chat', chatSchema);