// pages/Upload.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Loader2, Check } from "lucide-react";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  // State to trigger the success animation
  const [postSuccess, setPostSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault(); // Use preventDefault for form submission
    if (!title.trim() || !content.trim()) {
      return toast.error("⚠️ Title and Content are required!");
    }

    setLoading(true);

    try {
      await axios.post("/posts", { title, content });

      // Trigger the success animation
      setPostSuccess(true);

      // After 2 seconds, navigate to the homepage
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Post upload failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to upload post.";
      toast.error(`❌ ${errorMsg}`);
      setLoading(false); // Stop loading only on error
    }
    // On success, loading state is handled by the animation overlay
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 relative">
        <AnimatePresence>
            {postSuccess ? (
                // The Success Animation Overlay
                <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white dark:bg-gray-800 flex flex-col items-center justify-center rounded-2xl z-10"
                    style={{ minHeight: '450px' }} // Give it a fixed height to match the form
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 120 }}
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
                    >
                        <Check size={60} className="text-white" />
                    </motion.div>
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-2xl font-bold text-gray-800 dark:text-white mt-6"
                    >
                        Thought Shared!
                    </motion.h2>
                </motion.div>
            ) : (
                // The Form
                <motion.div 
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border dark:border-gray-700"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Pencil size={26} className="text-blue-600 dark:text-blue-400" />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Write Your Thought
                        </h1>
                    </div>
                    <form onSubmit={handlePost}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title (e.g., My thoughts on life...)"
                            className="w-full mb-4 p-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share something meaningful..."
                            rows={6}
                            maxLength={500}
                            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                        <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {content.length} / 500
                            </span>
                            <button
                                type="submit"
                                disabled={!title.trim() || !content.trim() || loading}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50 transition-transform duration-200 active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin"/> : <Pencil size={16}/>}
                                {loading ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default Upload;
