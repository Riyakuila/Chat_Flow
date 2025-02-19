import { MessageSquare, Users, Sparkles, Shield } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  const features = [
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Instant messaging with real-time updates",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create groups and connect with multiple users",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Sparkles,
      title: "Smart Features",
      description: "AI-powered chat suggestions and tools",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "End-to-end encryption for your privacy",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-center bg-base-200/50 min-h-screen pt-16">
      <div className="max-w-md mx-auto space-y-12 p-12">
        {/* Title Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-base-content/70 text-lg">{subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-4 rounded-xl bg-base-100/50 backdrop-blur-sm 
              hover:bg-base-100 transition-all duration-300 hover:shadow-md"
            >
              <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 
                group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold mb-2 text-base-content group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-base-content/60 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="flex justify-around pt-8 border-t border-base-300">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              1M+
            </div>
            <div className="text-sm text-base-content/60">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              50M+
            </div>
            <div className="text-sm text-base-content/60">Messages Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              99.9%
            </div>
            <div className="text-sm text-base-content/60">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;