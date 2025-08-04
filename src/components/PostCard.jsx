import React, { useState, useEffect, useRef } from "react";
// ✅ STEP 1.1: Import new icons and hooks
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, Send, MoreHorizontal, AlertTriangle, Trash2, Clock } from "lucide-react";
import axios from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// --- Helper Functions ---
const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = "/default-user.png";
};

// A simple function to format date/time
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
};

// --- Confirmation Modal for Deleting Post ---
const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{scale: 0.8, opacity: 0}} 
                animate={{scale: 1, opacity: 1}} 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center w-full max-w-sm"
            >
                <h3 className="text-lg font-bold text-red-600">Are you sure?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">This action is irreversible and the post will be deleted permanently.</p>
                <div className="flex gap-4 mt-6">
                    <button onClick={onCancel} className="w-full py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={onConfirm} className="w-full py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Yes, delete it</button>
                </div>
            </motion.div>
        </div>
    );
};

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/posts/comments/${postId}`);
        setComments(res.data.comments);
      } catch (error) {
        toast.error("Could not load comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/posts/${postId}/comment`, { content: newComment });
      setComments([res.data.comment, ...comments]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment.");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      {user && (
        <form onSubmit={handleAddComment} className="flex items-center gap-2 mb-4">
          <img 
            src={user.profilePic || "/default-user.png"} 
            onError={handleImageError}
            alt="you" 
            className="w-8 h-8 rounded-full object-cover" 
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform transform hover:scale-110">
            <Send size={16} />
          </button>
        </form>
      )}
      {loading ? <p className="text-sm text-gray-500 text-center py-4">Loading comments...</p> : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {comments.map(comment => (
            <div key={comment._id} className="flex items-start gap-2 text-sm">
              <img 
                src={comment.user.profilePic || "/default-user.png"} 
                onError={handleImageError}
                alt={comment.user.username} 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 w-full">
                <p className="font-semibold text-gray-900 dark:text-white">{comment.user.username}</p>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PostCard = ({ post, onPostDelete }) => {
  const { user: loggedInUser } = useAuth();
  const userId = loggedInUser?._id;

  const [likes, setLikes] = useState(post.likes.length);
  const [dislikes, setDislikes] = useState(post.dislikes.length);
  const [liked, setLiked] = useState(() => post.likes.includes(userId));
  const [disliked, setDisliked] = useState(() => post.dislikes.includes(userId));
  const [saved, setSaved] = useState(() => loggedInUser?.savedPosts?.includes(post._id));
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [optionsMenuRef]);

  const handleLike = async () => { /* ... (no changes) ... */ };
  const handleDislike = async () => { /* ... (no changes) ... */ };
  const handleSave = async () => { /* ... (no changes) ... */ };
  const handleReport = async () => { /* ... (no changes) ... */ };
  
  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
        await axios.delete(`/posts/${post._id}`);
        toast.success("Post deleted successfully.");
        if (onPostDelete) {
            onPostDelete(post._id);
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete post.");
    }
  };

  return (
    <>
    {showDeleteConfirm && <DeleteConfirmationModal onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} />}
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
      whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-6 mb-6 w-full max-w-3xl mx-auto border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <Link
          to={post.user._id === loggedInUser?._id ? "/profile" : `/profile/${post.user._id}`}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <img 
              src={post.user.profilePic || "/default-user.png"} 
              onError={handleImageError}
              alt="user" 
              className="w-12 h-12 rounded-full object-cover transition-transform" 
            />
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 animate-pulse group-hover:animate-none"></div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{post.user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock size={12}/> {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </Link>
        
        {loggedInUser && (
            <div className="relative" ref={optionsMenuRef}>
                <motion.button whileTap={{scale: 0.9}} onClick={() => setShowOptions(!showOptions)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <MoreHorizontal size={20} className="text-gray-500"/>
                </motion.button>
                <AnimatePresence>
                {showOptions && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-10 origin-top-right"
                    >
                        <ul className="text-sm text-gray-700 dark:text-gray-300 divide-y dark:divide-gray-700">
                            <li>
                                <button onClick={handleSave} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <Bookmark size={16} className={saved ? "text-yellow-500" : ""}/> {saved ? "Unsave Post" : "Save Post"}
                                </button>
                            </li>
                            {post.user._id === userId && (
                                <li>
                                    <button onClick={() => {setShowOptions(false); setShowDeleteConfirm(true);}} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Trash2 size={16}/> Delete Post
                                    </button>
                                </li>
                            )}
                            {post.user._id !== userId && (
                                <li>
                                    <button onClick={handleReport} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <AlertTriangle size={16}/> Report Post
                                    </button>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap text-sm sm:text-base">{post.content}</p>

      <div className="flex items-center space-x-4 mb-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLike} className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm ${liked ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"} hover:scale-105 transition`}>
          <ThumbsUp size={16} /> <span>{likes}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleDislike} className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm ${disliked ? "bg-red-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"} hover:scale-105 transition`}>
          <ThumbsDown size={16} /> <span>{dislikes}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowComments(!showComments)} className="px-3 py-1 rounded-full flex items-center gap-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-105 transition">
          <MessageCircle size={16} /> <span>{post.commentsCount || post.comments?.length || 0}</span>
        </motion.button>
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </motion.div>
    </>
  );
};

export default PostCard;
