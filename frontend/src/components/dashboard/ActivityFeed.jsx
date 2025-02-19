import { Calendar } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    { type: 'message', user: 'John Doe', time: '2 min ago' },
    { type: 'join', user: 'Alice Smith', time: '5 min ago' },
    { type: 'leave', user: 'Bob Johnson', time: '10 min ago' },
  ];

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Activity Feed</h2>
          <button className="btn btn-ghost btn-sm">
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  {activity.type === 'message' && ' sent a new message'}
                  {activity.type === 'join' && ' joined the chat'}
                  {activity.type === 'leave' && ' left the chat'}
                </p>
                <span className="text-xs text-base-content/50">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed; 