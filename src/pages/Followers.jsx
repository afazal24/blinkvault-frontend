import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../utils/axios"; // Use your configured axios instance
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Followers = () => {
  const { id: profileUserId } = useParams();
  const { user: loggedInUser } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowers = useCallback(async () => {
    try {
      setLoading(true);
      // We will create a new, dedicated route for this
      const res = await axios.get(`/users/${profileUserId}/followers`);
      // We need to check which of these followers the loggedInUser is also following
      const followersWithStatus = res.data.followers.map(follower => ({
        ...follower,
        isFollowedByMe: loggedInUser?.following.includes(follower._id)
      }));
      setFollowers(followersWithStatus);
    } catch (error) {
      toast.error("Failed to load followers.");
    } finally {
      setLoading(false);
    }
  }, [profileUserId, loggedInUser]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  const handleToggleFollow = async (targetUserId) => {
    try {
      await axios.put(`/users/follow/${targetUserId}`);
      // Update the button state locally for instant feedback
      setFollowers(followers.map(f => 
        f._id === targetUserId ? { ...f, isFollowedByMe: !f.isFollowedByMe } : f
      ));
    } catch (error) {
      toast.error("Action failed.");
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading followers...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Helmet>
        <title>Followers | BlinkVault</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Followers</h2>
      {followers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No followers yet.</p>
      ) : (
        <ul className="space-y-4">
          {followers.map((follower) => (
            <li key={follower._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex justify-between items-center">
              <Link to={`/profile/${follower._id}`} className="flex items-center gap-3">
                <img src={follower.profilePic || "/default-user.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <span className="font-medium text-gray-900 dark:text-white">@{follower.username}</span>
              </Link>
              {loggedInUser && follower._id !== loggedInUser._id && (
                <button
                  onClick={() => handleToggleFollow(follower._id)}
                  className={`px-4 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    follower.isFollowedByMe ? "bg-gray-500" : "bg-blue-600"
                  } text-white hover:scale-105`}
                >
                  {follower.isFollowedByMe ? "Unfollow" : "Follow"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Followers;
