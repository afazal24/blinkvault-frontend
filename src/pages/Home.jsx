import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import PostCard from "../components/PostCard";
// ❌ CommentModal import has been removed because it's no longer needed.
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [posts, setPosts] = useState({ trending: [], latest: [] });
  const [loading, setLoading] = useState(true);

  // The logic for comments is now inside PostCard.jsx,
  // so we don't need state for it here anymore.

  // 🔁 Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/posts/feed");
        setPosts({
          trending: res.data.trending || [],
          latest: res.data.latest || [],
        });
      } catch (error) {
        console.error("Failed to fetch posts:", error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const currentFeed = activeTab === "trending" ? posts.trending : posts.latest;

  return (
    <div className="w-full px-4 py-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Home Feed | BlinkVault</title>
        <meta name="description" content="Explore trending and latest posts from the BlinkVault community." />
      </Helmet>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {["trending", "latest"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {tab === "trending" ? "🔥 Trending" : "🕒 Latest"}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300 animate-pulse">
          Loading posts...
        </p>
      ) : currentFeed.length > 0 ? (
        <AnimatePresence>
          {currentFeed.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* The PostCard now handles its own comments, so no 'onCommentClick' is needed */}
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-10">
          No posts available yet.
          <br />
          <span className="text-sm">Be the first to share something!</span>
        </div>
      )}

      {/* The Comment Modal is no longer here because it's part of PostCard now */}
    </div>
  );
};

export default Home;
