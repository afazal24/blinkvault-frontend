// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Users, UserCheck, FileText, Eye } from "lucide-react";

// 🟦 Reusable Card Component
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
      <Icon size={28} className={`${color}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// 🧠 Main Dashboard
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    loggedInUsers: 0,
    totalPosts: 0,
    visitsToday: 1943, // dummy value
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("📉 Stats fetch error:", err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        🧮 Admin Dashboard
      </h1>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          color="text-blue-600"
        />
        <StatCard
          icon={UserCheck}
          label="Logged-in Users"
          value={stats.loggedInUsers}
          color="text-green-600"
        />
        <StatCard
          icon={FileText}
          label="Total Posts"
          value={stats.totalPosts}
          color="text-purple-600"
        />
        <StatCard
          icon={Eye}
          label="Visits Today"
          value={stats.visitsToday}
          color="text-orange-600"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
