// src/utils/api.js
import axios from "./axios";

// 🔴 Report User
export const reportUser = async (id) => {
  const res = await axios.post(`/users/report/${id}`);
  return res.data;
};

// ⛔ Block/Unblock User
export const toggleBlockUser = async (id) => {
  const res = await axios.post(`/users/block/${id}`);
  return res.data;
};

// 📃 Get Blocked Users
export const getBlockedUsers = async () => {
  const res = await axios.get(`/users/blocked`);
  return res.data.blocked;
};
