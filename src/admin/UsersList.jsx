import React, { useEffect, useState } from "react";
import { getAllUsers, banUser, deleteUser } from "../api/adminApi";
import { useAdmin } from "../context/AdminContext";

const UsersList = () => {
  const { adminToken } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(adminToken);
      setUsers(data);
    } catch (err) {
      setMessage("❌ Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (id) => {
    try {
      await banUser(id, adminToken);
      setMessage("✅ User banned/unbanned");
      fetchUsers(); // refresh list
    } catch (err) {
      setMessage("❌ Error banning user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id, adminToken);
      setMessage("✅ User deleted");
      fetchUsers(); // refresh list
    } catch (err) {
      setMessage("❌ Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">👥 Users List</h2>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Mobile</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b dark:border-gray-700">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.mobile}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleBan(user._id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    {user.isBanned ? "Unban" : "Ban"}
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
