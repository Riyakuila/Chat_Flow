import { create } from 'zustand';
import axiosInstance from '../lib/axiosInstance';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set, get) => ({
      selectedChat: null,
      chats: [],
      messages: [],
      isLoadingChats: false,
      isLoadingMessages: false,
      typingUsers: new Set(),
      unreadMessages: {}, // { userId: count }

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
      fetchMessages: async (participantId) => {
        try {
          set({ isLoadingMessages: true });
          const response = await axiosInstance.get(`/api/messages/${participantId}`);
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
          
          // Send through HTTP only
          const response = await axiosInstance.post(`/api/messages/${receiverId}`, {
            content
          });

          // Add message to state only once
          set(state => ({
            messages: [...state.messages, response.data]
          }));

          // Emit through socket for the receiver
          if (socket?.connected) {
            socket.emit("sendMessage", {
              receiverId,
              content,
              _id: response.data._id
            });
          }

          return response.data;
        } catch (error) {
          console.error("Error sending message:", error);
          throw error;
        }
      },

      // Select a chat
      setSelectedChat: async (chat) => {
        console.log("Setting selected chat:", chat);
        set({ selectedChat: chat });
        
        if (chat) {
          // Clear unread messages when selecting chat
          get().clearUnreadMessages(chat.participantId);
          await get().fetchMessages(chat.participantId);
          
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
        console.log("Handling new message:", message);
        
        set(state => {
          const messageExists = state.messages.some(msg => msg._id === message._id);
          if (messageExists) {
            return state;
          }

          const authUser = useAuthStore.getState().authUser;
          const isCurrentChat = state.selectedChat?.participantId === message.senderId;
          
          let newUnreadMessages = { ...state.unreadMessages };
          if (!isCurrentChat && message.senderId !== authUser?._id) {
            newUnreadMessages[message.senderId] = (newUnreadMessages[message.senderId] || 0) + 1;
            console.log("Updated unread messages:", newUnreadMessages);
          }

          return {
            messages: [...state.messages, message],
            unreadMessages: newUnreadMessages
          };
        });
      },

      clearUnreadMessages: (userId) => {
        console.log("Clearing unread messages for:", userId);
        set(state => ({
          unreadMessages: {
            ...state.unreadMessages,
            [userId]: 0
          }
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
        if (!socket) {
          console.log("No socket connection available");
          return;
        }

        console.log("Setting up message listeners");

        socket.on("newMessage", (message) => {
          console.log("New message received:", message);
          const authUser = useAuthStore.getState().authUser;
          if (message.senderId !== authUser?._id) {
            get().handleNewMessage(message);
          }
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        console.log('Removing message listeners');
        socket.off("newMessage");
        socket.off("messageSent");
        socket.off("messageError");
      },

      // Add method to restore chat state
      restoreChat: async () => {
        const selectedChat = get().selectedChat;
        if (selectedChat) {
          await get().fetchMessages(selectedChat.participantId);
        }
      }
    }),
    {
      name: 'chat-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        unreadMessages: state.unreadMessages,
        // You can add other fields you want to persist here
      })
    }
  )
); 