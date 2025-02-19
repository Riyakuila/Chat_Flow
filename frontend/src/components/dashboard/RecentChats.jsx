import { Filter } from 'lucide-react';

const RecentChats = () => {
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Chats</h2>
          <button className="btn btn-ghost btn-sm gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((chat) => (
            <div key={chat} className="flex items-center gap-4 p-3 rounded-lg hover:bg-base-300 transition-colors">
              <div className="w-12 h-12 rounded-full bg-base-300"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">User Name</h3>
                  <span className="text-xs text-base-content/50">2 min ago</span>
                </div>
                <p className="text-sm text-base-content/70 truncate">
                  Latest message preview...
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-ghost btn-sm mt-4 w-full">View All Chats</button>
      </div>
    </div>
  );
};

export default RecentChats; 