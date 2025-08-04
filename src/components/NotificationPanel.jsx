import React, { useState } from "react";
import { Bell } from "lucide-react";

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    "John became your member",
    "Someone liked your post",
    "You got a new comment",
    "Afazal replied to your comment",
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300"
      >
        <Bell className="text-gray-800 dark:text-white" size={20} />
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
          {notifications.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
          <ul className="p-3 space-y-2">
            {notifications.map((note, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 cursor-pointer"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
