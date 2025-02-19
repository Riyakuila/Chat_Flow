const OnlineUsers = () => {
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="text-xl font-semibold mb-6">Online Users</h2>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((user) => (
            <div key={user} className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-base-300"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-base-100"></div>
              </div>
              <div>
                <h3 className="font-medium text-sm">User Name</h3>
                <p className="text-xs text-base-content/50">Active now</p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-ghost btn-sm mt-4 w-full">View All Users</button>
      </div>
    </div>
  );
};

export default OnlineUsers; 