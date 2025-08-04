import axios from "../utils/axios";

// 🧠 Login Admin
export const loginAdmin = async (mobile, password) => {
  const res = await axios.post("/auth/login", { mobile, password });
  return res.data;
};

// 👥 Get All Users
export const getAllUsers = async (token) => {
  const res = await axios.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🔨 Ban or Unban User
export const toggleBan = async (userId, token) => {
  const res = await axios.put(`/admin/ban/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ❌ Delete User
export const deleteUser = async (userId, token) => {
  const res = await axios.delete(`/admin/delete/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 📊 Get Admin Stats
export const getAdminStats = async (token) => {
  const res = await axios.get("/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
