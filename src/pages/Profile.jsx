import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import PostCard from "../components/PostCard";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, ShieldCheck, MoreVertical, UserX } from "lucide-react";

const Profile = () => {
  const { id: paramId } = useParams(); // Rename to avoid confusion
  const { user: loggedInUser, setUser: setLoggedInUser } = useAuth();

  // States
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBlockedByMe, setIsBlockedByMe] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [tab, setTab] = useState("posts");
  
  const optionsMenuRef = useRef(null);

  const userIdToFetch = paramId || loggedInUser?._id;
  const isOwnProfile = !paramId || (loggedInUser && paramId === loggedInUser._id);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [optionsMenuRef]);

  // ✅ THE MAIN FIX: This useEffect now resets state properly when the user ID changes.
  useEffect(() => {
    const fetchProfileData = async () => {
      // 1. Reset all states to prevent showing old data
      setProfileUser(null);
      setUserPosts([]);
      setSavedPosts([]);
      setTab("posts");
      setIsFollowing(false);
      setIsBlockedByMe(false);
      setLoading(true);

      if (!userIdToFetch) {
        setLoading(false);
        return;
      }

      // 2. Check for block status first
      if (!isOwnProfile && loggedInUser?.blockedUsers?.includes(userIdToFetch)) {
        setIsBlockedByMe(true);
        try {
          const { data } = await axios.get(`/users/${userIdToFetch}`);
          setProfileUser(data.user);
        } catch (e) { /* ignore */ }
        setLoading(false);
        return;
      }

      // 3. Fetch the full profile data
      try {
        const profileUrl = isOwnProfile ? "/users/me" : `/users/${userIdToFetch}`;
        const response = await axios.get(profileUrl);
        const { user, posts = [] } = response.data;

        setProfileUser(user);
        setUserPosts(posts);

        if (loggedInUser && user?.followers) {
          setIsFollowing(user.followers.includes(loggedInUser._id));
        }
      } catch (error) {
        toast.error("User profile could not be loaded.");
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [paramId, loggedInUser]); // Re-fetch only when the URL param or logged-in user changes

  const fetchSaved = useCallback(async () => {
    if (!isOwnProfile) return;
    setLoading(true);
    try {
      const res = await axios.get("/users/saved");
      setSavedPosts(res.data.saved || []);
    } catch (error) {
      toast.error("Failed to load saved posts.");
    } finally {
        setLoading(false);
    }
  }, [isOwnProfile]);

  useEffect(() => {
    if (isOwnProfile && tab === "saved") {
      fetchSaved();
    }
  }, [tab, isOwnProfile, fetchSaved]);

  const handleFollowToggle = async () => { /* ... (no changes here) ... */ };
  const handleBlockToggle = async () => { /* ... (no changes here) ... */ };

  if (loading) {
    return <div className="text-center text-gray-500 py-16 animate-pulse">Loading Profile...</div>;
  }

  if (!profileUser) {
    return <div className="text-center text-red-500 font-bold py-16">User not found or could not be loaded.</div>;
  }
  
  if (isBlockedByMe && !isOwnProfile) {
    return (
        <div className="max-w-4xl mx-auto p-4 text-center">
            <UserX size={64} className="mx-auto text-red-500 mb-4"/>
            <h2 className="text-2xl font-bold">@{profileUser.username} is Blocked</h2>
            <p className="text-gray-500 dark:text-gray-400">You have blocked this user.</p>
            <button 
                onClick={handleBlockToggle}
                className="mt-6 px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-full hover:bg-gray-700"
            >
                Unblock
            </button>
        </div>
    );
  }

  const StatItem = ({ count, label, to }) => (
    <Link to={to} className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
        <span className="text-xl font-bold text-gray-900 dark:text-white block">{count}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    </Link>
  );

  return (
    <motion.div 
      key={userIdToFetch} // This key is crucial to force re-mount and reset state
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4"
    >
      <Helmet>
        <title>{profileUser.username} | BlinkVault</title>
      </Helmet>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 text-center"
      >
        <div className="flex justify-center">
            <img
              src={profileUser.profilePic || "/default-user.png"}
              alt="user"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
            />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          {profileUser.name}
        </h2>
        <p className="text-md text-gray-500 dark:text-gray-400">@{profileUser.username}</p>

        {profileUser.bio && (
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-lg mx-auto italic">
                ❝ {profileUser.bio} ❞
            </p>
        )}

        <div className="flex justify-center gap-8 mt-6">
            <StatItem count={userPosts.length} label="Posts" to="#"/>
            <StatItem count={profileUser.followers?.length || 0} label="Followers" to={`/followers/${profileUser._id}`}/>
            <StatItem count={profileUser.following?.length || 0} label="Following" to={`/following/${profileUser._id}`}/>
        </div>
        
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 bg-blue-50 dark:bg-gray-700/50 p-4 rounded-xl border border-blue-200 dark:border-gray-600"
        >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-left mb-2 flex items-center">
                <ShieldCheck size={20} className="text-blue-500 mr-2"/> StreakVault
            </h3>
            <div className="flex justify-around items-center">
                <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ⚡ {profileUser.points || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Points</p>
                </div>
                <div className="text-center">
                <p className="text-3xl font-bold text-orange-500">
                    🔥 {profileUser.weeklyStreak || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Week Streak</p>
                </div>
            </div>
        </motion.div>

        <div className="mt-6">
        {isOwnProfile ? (
            <Link to="/settings" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Edit3 size={16} className="mr-2"/> Edit Profile
            </Link>
        ) : (
            <div className="flex justify-center items-center gap-2">
                <button
                  onClick={handleFollowToggle}
                  className={`w-full sm:w-auto px-6 py-2 text-sm rounded-full font-semibold ${isFollowing ? "bg-gray-500" : "bg-blue-600"} text-white hover:opacity-90 transition-transform transform hover:scale-105`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
                <div className="relative" ref={optionsMenuRef}>
                    <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <MoreVertical size={20}/>
                    </button>
                    <AnimatePresence>
                    {showOptionsMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-10 origin-top-right"
                        >
                            <ul className="text-sm text-gray-700 dark:text-gray-300">
                                <li>
                                    <button onClick={handleBlockToggle} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <UserX size={16}/> {isBlockedByMe ? "Unblock User" : "Block User"}
                                    </button>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        )}
        </div>
      </motion.div>

      <div className="flex justify-center bg-gray-200 dark:bg-gray-700 p-1 rounded-full mb-6">
        <button
          onClick={() => setTab("posts")}
          className={`w-1/2 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${tab === "posts" ? "bg-white dark:bg-gray-900 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}
        >
          Posts
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setTab("saved")}
            className={`w-1/2 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${tab === "saved" ? "bg-white dark:bg-gray-900 text-blue-600" : "text-gray-600 dark:text-gray-300"}`}
          >
            Saved
          </button>
        )}
      </div>
      <div className="space-y-4">
        <AnimatePresence mode="wait">
            <motion.div
                key={tab}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {tab === "posts" && (
                  userPosts.length === 0
                    ? <p className="text-center text-gray-500 py-8">No posts to display.</p>
                    : userPosts.map((post) => <PostCard key={post._id} post={post} />)
                )}
                {tab === "saved" && isOwnProfile && (
                  savedPosts.length === 0
                    ? <p className="text-center text-gray-500 py-8">You have no saved posts.</p>
                    : savedPosts.map((post) => (
                        <PostCard key={post._id} post={post} refreshSaved={fetchSaved} />
                      ))
                )}
            </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Profile;
