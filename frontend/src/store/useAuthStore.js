import { create } from 'zustand'
import axiosInstance from '../lib/axiosInstance'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/check');
      console.log('Auth check response:', response.data);
      set({ authUser: response.data });
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

  
}))

