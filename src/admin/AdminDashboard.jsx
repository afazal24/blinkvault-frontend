import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, BarChart2, AlertTriangle, Trash2, UserCheck, UserCog } from "lucide-react";

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  </motion.div>
);

// --- Confirmation Modal for Destructive Actions ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm"
            >
                <h3 className="text-lg font-bold text-red-600">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{message}</p>
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={onConfirm} className="w-full py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Confirm</button>
                </div>
            </motion.div>
        </div>
    );
};


// --- Main Admin Dashboard Component ---
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalState, setModalState] = useState({ isOpen: false, action: null, title: '', message: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ THE FIX: Removed the "/api" prefix from all URLs.
      // Your axios instance adds it automatically.
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        axios.get("/admin/stats"),
        axios.get("/admin/users"),
        axios.get("/admin/reports/posts")
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setReportedPosts(reportsRes.data);
    } catch (err) {
      toast.error("Failed to load admin data. You may not have access.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied. Admins only.");
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate, fetchData]);

  // --- Action Handlers ---
  const handleUpdateRole = async (userId, newRole) => {
    try {
        await axios.put(`/admin/users/${userId}/role`, { role: newRole });
        toast.success(`User role updated to ${newRole}`);
        fetchData();
    } catch (err) {
        toast.error("Failed to update role.");
    }
  };

  const handleDeleteUser = (userId) => {
    setModalState({
        isOpen: true,
        action: async () => {
            try {
                await axios.delete(`/admin/users/${userId}`);
                toast.success("User deleted successfully.");
                fetchData();
            } catch (err) {
                toast.error("Failed to delete user.");
            }
            setModalState({ isOpen: false });
        },
        title: "Delete User?",
        message: "This action is irreversible. All user data will be permanently deleted."
    });
  };

  const handleDeletePost = (postId) => {
    setModalState({
        isOpen: true,
        action: async () => {
            try {
                await axios.delete(`/admin/posts/${postId}`);
                toast.success("Post deleted successfully.");
                fetchData();
            } catch (err) {
                toast.error("Failed to delete post.");
            }
            setModalState({ isOpen: false });
        },
        title: "Delete Post?",
        message: "This action is irreversible. The post will be permanently deleted."
    });
  };

  const handleDismissReport = async (postId) => {
    try {
        await axios.put(`/admin/posts/${postId}/dismiss`);
        toast.success("Reports dismissed.");
        fetchData();
    } catch (err) {
        toast.error("Failed to dismiss reports.");
    }
  };


  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500 py-10">Loading Dashboard...</p>;

    switch (tab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats?.totalUsers} icon={<Users size={24} />} color="border-blue-500" />
            <StatCard title="Total Posts" value={stats?.totalPosts} icon={<FileText size={24} />} color="border-green-500" />
            <StatCard title="New Signups Today" value={stats?.newSignupsToday} icon={<UserCheck size={24} />} color="border-yellow-500" />
            <StatCard title="Pending Reports" value={stats?.pendingReports} icon={<AlertTriangle size={24} />} color="border-red-500" />
          </div>
        );
      case "users":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">@{u.username}</td>
                    <td className="px-6 py-4">{u.role}</td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleUpdateRole(u._id, u.role === 'admin' ? 'user' : 'admin')} title="Change Role" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"><UserCog size={16}/></button>
                        <button onClick={() => handleDeleteUser(u._id)} title="Delete User" className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "reports":
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Post Title</th>
                            <th className="px-6 py-3">Author</th>
                            <th className="px-6 py-3">Reports</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportedPosts.map(p => (
                            <tr key={p._id} className="border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.title}</td>
                                <td className="px-6 py-4">@{p.user.username}</td>
                                <td className="px-6 py-4">{p.reportedBy.length}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleDismissReport(p._id)} title="Dismiss Reports" className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><UserCheck size={16}/></button>
                                    <button onClick={() => handleDeletePost(p._id)} title="Delete Post" className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart2 size={18} /> },
    { id: "users", label: "User Management", icon: <Users size={18} /> },
    { id: "reports", label: "Content Moderation", icon: <AlertTriangle size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <ConfirmationModal {...modalState} onClose={() => setModalState({ isOpen: false })} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Admin Control Panel</h1>
      
      <div className="mb-6 flex space-x-2 border-b dark:border-gray-700">
        {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t.id ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                {t.icon} {t.label}
            </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
