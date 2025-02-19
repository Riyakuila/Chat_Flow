import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, BarChart2 } from "lucide-react";
import Logo from "../assets/logo.png";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-all">
              <img 
                src={Logo} 
                alt="ChatFlow Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                ChatFlow
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSelector />

            {authUser ? (
              <>
                <Link
                  to="/settings"
                  className="btn btn-sm btn-ghost gap-2 hover:bg-base-200"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <Link 
                  to="/profile" 
                  className="btn btn-sm btn-ghost gap-2 hover:bg-base-200"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="btn btn-sm btn-ghost gap-2 hover:bg-base-200"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link to="/logout" className="btn btn-sm border-2 border-pink-500 btn-outline gap-2" >
                  <LogOut className="size-4 text-pink-500" />
                  <span className="hidden sm:inline text-pink-500">Logout</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-ghost">
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-sm border-0 bg-gradient-to-r from-purple-600 to-purple-800
                  text-white hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;