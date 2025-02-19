const StatsCard = ({ title, value, icon: Icon, change }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-base-content/70">{title}</h3>
            <div className="text-2xl font-bold mt-2">{value}</div>
          </div>
          <div className="p-3 rounded-xl bg-base-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className={`text-sm mt-4 ${isPositive ? 'text-success' : 'text-error'}`}>
          {change} from last month
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 