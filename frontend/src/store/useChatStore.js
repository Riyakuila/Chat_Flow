import { create } from 'zustand';
import axiosInstance from '../lib/axiosInstance';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  selectedChat: null,
  chats: [],
  messages: [],
  isLoadingChats: false,
  isLoadingMessages: false,

  // Get user's chats
  fetchChats: async () => {
    set({ isLoadingChats: true });
    try {
      const response = await axiosInstance.get('/api/chats');
      set({ chats: response.data.chats || [] });
    } catch (error) {
      console.log('Error fetching chats:', error);
      toast.error('Failed to load chats');
      set({ chats: [] });
    } finally {
      set({ isLoadingChats: false });
    }
  },

  // Get messages for a specific chat
  fetchMessages: async (chatId) => {
    set({ isLoadingMessages: true });
    try {
      const response = await axiosInstance.get(`/api/messages/${chatId}`);
      set({ messages: response.data });
    } catch (error) {
      console.log('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // Send a message
  sendMessage: async (chatId, content) => {
    try {
      const response = await axiosInstance.post(`/api/messages/${chatId}`, { content });
      set(state => ({
        messages: [...state.messages, response.data]
      }));
      return response.data;
    } catch (error) {
      console.log('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  },

  // Select a chat
  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    if (chat) {
      get().fetchMessages(chat._id);
    }
  },

  // Create a new chat
  createChat: async (userId) => {
    try {
      const response = await axiosInstance.post('/api/chats', { participantId: userId });
      
      // Update chats list with new chat
      set(state => ({
        chats: [response.data, ...state.chats],
        selectedChat: response.data // Automatically select the new chat
      }));

      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
      throw error;
    }
  }
})); 