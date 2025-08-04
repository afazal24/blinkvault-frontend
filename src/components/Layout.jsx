import React from "react";
import NotificationPanel from "./NotificationPanel"; // 🔔 Import notification panel

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* 🔔 Top Bar with Notification */}
      <div className="flex justify-end px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <NotificationPanel />
      </div>

      {/* Main Page Content */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Layout;
