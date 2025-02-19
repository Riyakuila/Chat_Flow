import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" p-8 rounded-lg border-2 border-purple-500 w-96 text-center">
        <div className="mb-6">
          <h2 className="text-2xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent font-bold mb-2">Logging Out?</h2>
          <p>
            We're sad to see you go. Are you sure you want to logout?
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
          >
            {isLoading ? 'Logging out...' : 'Yes, Logout'}
          </button>
          
          <button
            onClick={() => navigate('/')}
            disabled={isLoading}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 text-sm">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
};

export default Logout;
