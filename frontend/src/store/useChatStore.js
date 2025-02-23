import { create } from 'zustand';
import axiosInstance from '../lib/axiosInstance';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  selectedChat: null,
  chats: [],
  messages: [],
  isLoadingChats: false,
  isLoadingMessages: false,
  typingUsers: new Set(),

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
      console.error("Error fetching messages:", error);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // Send a message
  sendMessage: async (receiverId, content) => {
    try {
      console.log('Sending message:', { receiverId, content });
      const socket = useAuthStore.getState().socket;
      
      // Log socket status
      console.log('Socket status:', {
        exists: !!socket,
        connected: socket?.connected,
        id: socket?.id
      });

      // Send through HTTP first
      const response = await axiosInstance.post(`/api/messages/${receiverId}`, {
        content
      });

      console.log('Message sent successfully:', response.data);

      // Then emit through socket
      if (socket?.connected) {
        socket.emit("sendMessage", {
          receiverId,
          content,
          _id: response.data._id
        });
        console.log('Message emitted through socket');
      }

      set(state => ({
        messages: [...state.messages, response.data]
      }));

      return response.data;
    } catch (error) {
      console.error("Detailed send message error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  // Select a chat
  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    if (chat) {
      get().fetchMessages(chat._id);
      // Join chat room
      const socket = useAuthStore.getState().socket;
      socket?.emit("joinChat", chat._id);
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

      // Fetch messages for the new chat
      await get().fetchMessages(response.data._id);

      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
      throw error;
    }
  },

  handleNewMessage: (message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  setTypingStatus: (userId, isTyping) => {
    set(state => {
      const newTypingUsers = new Set(state.typingUsers);
      if (isTyping) {
        newTypingUsers.add(userId);
      } else {
        newTypingUsers.delete(userId);
      }
      return { typingUsers: newTypingUsers };
    });
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (message) => {
      get().handleNewMessage(message);
    });

    socket.on("userTyping", ({ senderId, isTyping }) => {
      get().setTypingStatus(senderId, isTyping);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("userTyping");
  }
})); 