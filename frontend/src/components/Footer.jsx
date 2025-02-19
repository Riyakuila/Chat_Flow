import { Github, Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-base-200/50 border-t border-base-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="ChatFlow Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                ChatFlow
              </span>
            </Link>
            <p className="text-base-content/70">
              Experience the next generation of messaging with real-time chat, 
              seamless integration, and powerful features.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-base-content/70 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base-content/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-base-content/70 hover:text-primary transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/Riyakuila" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="mailto:riyakuila539@gmail.com"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 mt-12 pt-8 text-center text-base-content/70">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> by
            <a 
              href="https://github.com/Riyakuila" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Riya Kuila
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 