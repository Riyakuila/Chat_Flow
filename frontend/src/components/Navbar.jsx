import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, BarChart2, Palette } from "lucide-react";
import Logo from "../assets/logo.png";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween",
    "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
    "wireframe", "black", "luxury", "dracula", "cmyk", "autumn",
    "business", "acid", "lemonade", "night", "coffee", "winter"
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <Palette className="w-5 h-5" />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-3 bg-base-200 rounded-box w-56 mt-4 max-h-[70vh] overflow-y-auto shadow-2xl gap-2 grid">
                {themes.map((themeName) => (
                  <li key={themeName}>
                    <div
                      className={`w-full hover:bg-base-100 rounded-lg ${
                        theme === themeName ? 'outline outline-2 outline-primary' : ''
                      }`}
                      onClick={() => setTheme(themeName)}
                      data-theme={themeName}
                    >
                      <div className="px-4 py-2 flex items-center justify-between gap-4">
                        <span className="font-medium capitalize">{themeName}</span>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-6 rounded bg-primary"></div>
                          <div className="w-2 h-6 rounded bg-secondary"></div>
                          <div className="w-2 h-6 rounded bg-accent"></div>
                          <div className="w-2 h-6 rounded bg-neutral"></div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

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