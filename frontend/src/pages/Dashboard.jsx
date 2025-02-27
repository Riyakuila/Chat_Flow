import { useAuthStore } from '../store/useAuthStore';
import { 
  Users, MessageSquare, Bell, 
  BarChart2, Settings, Search,
  Plus, Filter, Calendar
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentChats from '../components/dashboard/RecentChats';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import OnlineUsers from '../components/dashboard/OnlineUsers';

const Dashboard = () => {
  const { authUser } = useAuthStore();

  const stats = [
    { title: 'Total Messages', value: '2,543', icon: MessageSquare, change: '+12.5%' },
    { title: 'Active Users', value: '1,234', icon: Users, change: '+8.2%' },
    { title: 'Total Groups', value: '45', icon: Users, change: '+23.1%' },
    { title: 'Notifications', value: '89', icon: Bell, change: '+4.6%' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-base-content/70 mt-1">
              Welcome back, {authUser?.fullName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="input input-bordered pl-10 pr-4 w-full md:w-64"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            </div>
            <button className="btn btn-primary gap-2">
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

 
        <div className="grid lg:grid-cols-[1fr,300px] gap-8">
   
          <div className="space-y-8">
           
            <RecentChats />

            <ActivityFeed />
          </div>

          <div className="space-y-8">
            <OnlineUsers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;