import { create } from 'zustand'
import axiosInstance from '../lib/axiosInstance'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/check');
      console.log('Auth check response:', response.data);
      set({ authUser: response.data });
      get().connectToSocket();
    } catch (error) {
      console.log("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
        const response = await axiosInstance.post('/api/auth/signup', formData);
        set({ authUser: response.data });
        toast.success("Account created successfully");
        get().connectToSocket();
    } catch (error) {
        console.log("Error signing up", error);
        const errorMessage = error.response?.data?.message || "Error creating account";
        toast.error(errorMessage);
    } finally {
        set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
        await axiosInstance.post('/api/auth/logout');
        set({ authUser: null });
        toast.success("Logged out successfully");
        get().disconnectFromSocket();
        const { authUser } = get();
        if (authUser) {
          get().socket.emit('setUserOffline', authUser._id);
        }
    } catch (error) {
        console.log("Error logging out", error);
        toast.error("Error logging out");
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      set({ authUser: response.data });
      toast.success("Logged in successfully");

      get().connectToSocket();
    } catch (error) {
      console.log("Error logging in", error);
      const errorMessage = error.response?.data?.message || "Error logging in";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      let config = {};
      let requestData = data;

      // Check if it's FormData (for image uploads)
      if (data instanceof FormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      } else {
        // For regular data updates
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }

      const response = await axiosInstance.put('/api/auth/profile', requestData, config);
      console.log('Profile update response:', response.data);

      // Update local state
      set(state => ({
        authUser: {
          ...state.authUser,
          ...response.data
        }
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Error updating profile';
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfileImage: async (file) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axiosInstance.put('/api/auth/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile image update response:', response.data);

      set(state => ({
        authUser: {
          ...state.authUser,
          profileImage: response.data.profileImage
        }
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      const errorMessage = error.response?.data?.message || 'Error updating profile image';
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateCoverImage: async (file) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      formData.append('coverImage', file);

      const response = await axiosInstance.put('/api/auth/profile/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set(state => ({
        authUser: {
          ...state.authUser,
          coverImage: response.data.coverImage
        }
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating cover image:', error);
      const errorMessage = error.response?.data?.message || 'Error updating cover image';
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfileDetails: async (details) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put('/api/auth/profile/details', details);

      set(state => ({
        authUser: {
          ...state.authUser,
          ...response.data
        }
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating profile details:', error);
      const errorMessage = error.response?.data?.message || 'Error updating profile details';
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteAccount: async () => {
    try {
      await axiosInstance.delete('/api/auth/profile');
      set({ authUser: null });
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting account';
      toast.error(errorMessage);
      throw error;
    }
  },

  connectToSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    try {
      const newSocket = io("http://localhost:5001", {
        query: {
          userId: authUser._id,
        },
        transports: ['websocket', 'polling'],
        withCredentials: true,
        forceNew: true,
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('setup', authUser._id);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      set({ socket: newSocket });

      newSocket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
        console.log("Online users:", userIds);
      });

      if (authUser) {
        newSocket.emit('setUserOnline', authUser._id);
      }
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  },

  disconnectFromSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },

  setAuthUser: (user) => {
    set({ authUser: user });
    if (user?._id) {
      const socket = io("http://localhost:5001", {
        query: { userId: user._id },
      });
      
      socket.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      set({ socket });
    }
  },

  setupSocketListeners: () => {
    const socket = get().socket;
    if (!socket) return;

    socket.on('userOnline', (userId) => {
      const { authUser } = get();
      if (authUser?._id === userId) {
        set((state) => ({
          authUser: { ...state.authUser, isOnline: true }
        }));
      }
    });

    socket.on('userOffline', (userId) => {
      const { authUser } = get();
      if (authUser?._id === userId) {
        set((state) => ({
          authUser: { ...state.authUser, isOnline: false }
        }));
      }
    });
  },

  initSocket: (userId) => {
    const socket = io("http://localhost:5001", {
      query: { userId },
    });
    
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    set({ socket });
  },
}))

useAuthStore.subscribe((state, prevState) => {
  if (state.socket && !prevState.socket) {
    state.setupSocketListeners();
  }
});



