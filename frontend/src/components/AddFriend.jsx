import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axiosInstance';

const AddFriend = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authUser } = useAuthStore();
  const { createChat } = useChatStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/users/search?query=${searchQuery}`);
      // Filter out the current user from results
      const filteredResults = response.data.filter(user => user._id !== authUser._id);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async (userId) => {
    try {
      await createChat(userId);
      toast.success('Chat created successfully!');
      setSearchResults([]); // Clear results
      setSearchQuery(''); // Clear search
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Find Friends</h2>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            disabled={isLoading}
          >
            <Search className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center py-4">
          <div className="loading loading-spinner loading-md"></div>
        </div>
      )}

      <div className="space-y-2">
        {searchResults.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.profilePic || '/default-avatar.png'}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{user.fullName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => startChat(user._id)}
              className="btn btn-primary btn-sm"
            >
              Message
            </button>
          </div>
        ))}
      </div>

      {searchResults.length === 0 && searchQuery && !isLoading && (
        <p className="text-center text-gray-500 py-4">
          No users found. Try a different search term.
        </p>
      )}
    </div>
  );
};

export default AddFriend; 