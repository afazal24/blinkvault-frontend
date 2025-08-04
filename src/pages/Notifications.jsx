import React, { useEffect, useState, useCallback } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/notifications");
      setNotifications(res.data);
      // Mark notifications as read after fetching them
      await axios.put("/notifications/read");
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading notifications...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🔔 Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">You have no new notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Link to={notif.link || "#"} key={notif._id} className={`block p-4 rounded-lg shadow transition-colors ${notif.read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'} border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700`}>
              <div className="flex items-center gap-3">
                <img src={notif.sender.profilePic || "/default-user.png"} alt={notif.sender.username} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: notif.message }} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
