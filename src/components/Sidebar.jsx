import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  User,
  Settings,
  FileText,
  Upload,
  Bell,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

// Helper function to handle image loading errors
const handleImageError = (e) => {
  e.target.onerror = null; // Prevents infinite loops
  e.target.src = "/default-user.png";
};

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Don't render sidebar if user is not loaded
  }

  const isAdmin = user.role === "admin";
  
  // ✅ "Report / Block" link has been removed from this list.
  const navItems = [
    { text: "Upload Post", to: "/upload", icon: <Upload size={18} /> },
    { text: "Profile", to: "/profile", icon: <User size={18} /> },
    { text: "Settings", to: "/settings", icon: <Settings size={18} /> },
    { text: "Terms & Conditions", to: "/terms", icon: <FileText size={18} /> },
    { text: "Notifications", to: "/notifications", icon: <Bell size={18} /> },
    { text: "Community", to: "/community", icon: <Users size={18} /> },
  ];

  // ✅ The logic to add the Admin Dashboard link is already perfect.
  if (isAdmin) {
    navItems.push({
      text: "Admin Dashboard",
      to: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    });
  }

  return (
    <aside className="w-60 h-screen fixed top-0 left-0 bg-white dark:bg-gray-800 p-6 shadow-lg hidden md:flex flex-col justify-between border-r border-gray-200 dark:border-gray-700">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <img
            src={user.profilePic || "/default-user.png"}
            onError={handleImageError}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="text-gray-800 dark:text-white overflow-hidden">
            <p className="font-semibold text-base truncate" title={user.username}>@{user.username || 'user'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome</p>
          </div>
        </div>

        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
          {navItems.map((item) => (
            <motion.li
              key={item.text}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Using NavLink for active styling */}
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                {item.icon} {item.text}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="text-xs text-center text-gray-500 dark:text-gray-400 pt-8">
        <p>© {new Date().getFullYear()} The BlinkVault</p>
      </div>
    </aside>
  );
};

export default Sidebar;
