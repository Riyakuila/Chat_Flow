import { ArrowRight, MessageSquare, Shield, Sparkles, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import chattingBgRemove from "../assets/chattingBgRemove.png";
import dMedia from "../assets/dMedia.jpeg";
import heroImage from "../assets/hero-image.jpeg";
import heroBgRemove from "../assets/heroBgRemove.png";
import chatImg from "../assets/chat.jpeg";
import statsImg from "../assets/stats.jpeg";
import messageImg from "../assets/message.jpeg";

const HomePage = () => {
  const { authUser } = useAuthStore();

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience real-time messaging with instant delivery and responses",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create and manage group conversations with ease",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption ensures your conversations stay private",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Sparkles,
      title: "Smart Features",
      description: "AI-powered suggestions and automated responses",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen pt-10">
     
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left lg:pl-8">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Connect, Chat, Collaborate
              </h1>
              <p className="text-xl text-base-content/70 mb-12">
                Experience the next generation of messaging with ChatFlow. 
                Real-time chat, seamless integration, and powerful features.
              </p>
              {!authUser && (
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <Link 
                    to="/signup" 
                    className="btn btn-lg border-0 bg-gradient-to-r from-purple-600 to-purple-800
                    text-white hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-md"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="btn btn-lg btn-outline">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
            <div className="order-first lg:order-last flex justify-center lg:justify-center">
              <div className="w-full max-w-[450px] ml-4">
                <img 
                  src={chattingBgRemove} 
                  alt="ChatFlow Platform" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-20 px-4 bg-base-200/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="text-purple-600">ChatFlow</span>?
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-full max-w-[350px] aspect-[4/3] overflow-hidden rounded-2xl">
                <img 
                  src={dMedia} 
                  alt="Digital Media" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-base-100 rounded-xl w-full max-w-[350px] min-h-[150px] flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-4">Modern Communication</h3>
                <p className="text-base-content/70">
                  Experience seamless digital communication with our cutting-edge platform.
                </p>
              </div>
            </div>
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-full max-w-[350px] aspect-[4/3] overflow-hidden rounded-2xl">
                <img 
                  src={heroBgRemove} 
                  alt="Chat Features" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-base-100 rounded-xl w-full max-w-[350px] min-h-[150px] flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-4">Enhanced Features</h3>
                <p className="text-base-content/70">
                  Powerful tools and features to make your chat experience better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={heroImage} 
                alt="Chat Interface" 
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Experience the Next Level of Communication
              </h2>
              <p className="text-lg text-base-content/70">
                Our platform combines modern design with powerful features to provide 
                the best chat experience possible.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-base-100 rounded-xl">
                    <div className={`${feature.bgColor} p-3 rounded-lg`}>
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-base-content/60">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 px-4 bg-base-200/50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Users Worldwide
            </h2>
            <p className="text-base-content/70 text-lg">
              Join our growing community and experience the power of seamless communication.
              Our platform is trusted by millions of users across the globe.
            </p>
          </div>
        </div>
      </section>

      
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           
            <div className="card bg-base-100 hover:shadow-lg transition-all duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src={chatImg} 
                  alt="Active Users" 
                  className="rounded-xl h-40 w-full object-cover"
                />
              </figure>
              <div className="card-body text-center pt-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                  1M+
                </div>
                <div className="text-base-content/60 font-medium">Active Users</div>
              </div>
            </div>

           
            <div className="card bg-base-100 hover:shadow-lg transition-all duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src={messageImg} 
                  alt="Messages Sent" 
                  className="rounded-xl h-40 w-full object-cover"
                />
              </figure>
              <div className="card-body text-center pt-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                  50M+
                </div>
                <div className="text-base-content/60 font-medium">Messages Sent</div>
              </div>
            </div>

           
            <div className="card bg-base-100 hover:shadow-lg transition-all duration-300">
              <figure className="px-4 pt-4">
                <img 
                  src={statsImg} 
                  alt="Platform Uptime" 
                  className="rounded-xl h-40 w-full object-cover"
                />
              </figure>
              <div className="card-body text-center pt-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-base-content/60 font-medium">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-20 px-4 bg-base-200/50">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">
            Ready to get started with ChatFlow?
          </h2>
          <p className="text-lg text-base-content/70 mb-8">
            Join millions of users who trust ChatFlow for their communication needs.
          </p>
          {!authUser && (
            <Link 
              to="/signup" 
              className="btn btn-lg border-0 bg-gradient-to-r from-purple-600 to-purple-800
              text-white hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-md"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
