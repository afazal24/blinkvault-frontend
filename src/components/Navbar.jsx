import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/login");
    } catch (err) {
      console.error("❌ Logout failed:", err.message);
    }
  };

  return (
    <>
      {/* ✅ STEP 1: Add the CSS for our new text animation */}
      <style>
        {`
          .animate-text {
            background-image: linear-gradient(
              -225deg,
              #231557 0%,
              #44107a 29%,
              #ff1361 67%,
              #fff800 100%
            );
            background-size: auto auto;
            background-clip: border-box;
            background-size: 200% auto;
            color: #fff;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: textclip 2s linear infinite;
            display: inline-block;
          }

          @keyframes textclip {
            to {
              background-position: 200% center;
            }
          }
        `}
      </style>
      <nav className="sticky top-0 z-50 flex justify-between items-center p-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md dark:border-gray-700 shadow-md px-6">
        <Link to="/" className="flex items-center gap-3">
          <motion.img 
            src="/logo.png" 
            alt="logo" 
            className="w-9 h-9 rounded-full object-cover"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {/* ✅ STEP 2: Apply the animation class to the title */}
          <span className="text-2xl font-bold">
            <span className="animate-text">The BlinkVault</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* ✅ STEP 3: Improved profile link with user's image and name */}
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full pr-3 transition-colors"
              >
                <img 
                  src={user.profilePic || '/default-user.png'} 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/default-user.png'; }}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-sm hidden sm:inline">{user.username}</span>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </motion.button>
            </>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                  Login
                </Link>
              )}
              {location.pathname !== "/signup" && (
                <Link to="/signup" className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Signup
                </Link>
              )}
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
