import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../utils/axios";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Following = () => {
  const { id: profileUserId } = useParams();
  const { user: loggedInUser } = useAuth();
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowing = useCallback(async () => {
    try {
      setLoading(true);
      // We will create a new, dedicated route for this
      const res = await axios.get(`/users/${profileUserId}/following`);
      setFollowingList(res.data.following);
    } catch (error) {
      toast.error("Failed to load following list.");
    } finally {
      setLoading(false);
    }
  }, [profileUserId]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  const handleUnfollow = async (targetUserId) => {
    try {
      await axios.put(`/users/follow/${targetUserId}`);
      // Remove the user from the list locally for instant feedback
      setFollowingList(prevList => prevList.filter(user => user._id !== targetUserId));
    } catch (error) {
      toast.error("Failed to unfollow.");
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading following list...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Helmet>
        <title>Following | BlinkVault</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Following</h2>
      {followingList.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Not following anyone yet.</p>
      ) : (
        <ul className="space-y-4">
          {followingList.map((user) => (
            <li key={user._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex justify-between items-center">
              <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
                <img src={user.profilePic || "/default-user.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <span className="font-medium text-gray-900 dark:text-white">@{user.username}</span>
              </Link>
              {loggedInUser && user._id !== loggedInUser._id && (
                <button
                  onClick={() => handleUnfollow(user._id)}
                  className="px-4 py-1 rounded text-sm font-medium bg-gray-500 text-white hover:scale-105 transition"
                >
                  Unfollow
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Following;
