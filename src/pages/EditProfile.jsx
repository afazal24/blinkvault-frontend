import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const EditProfile = () => {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    username: "",
    bio: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          username: res.data.username || "",
          bio: res.data.bio || "",
          profilePic: res.data.profilePic || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) return setMessage("Username is required.");
    try {
      await axios.put("http://localhost:5000/api/users/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error.message);
      setMessage("❌ Failed to update profile.");
    }
  };

  if (!token) {
    return (
      <div className="text-center mt-10 text-red-600">
        Unauthorized. Please login again.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Helmet>
        <title>Edit Profile | BlinkVault</title>
        <meta
          name="description"
          content="Edit your BlinkVault user profile and update your bio, username and profile picture."
        />
      </Helmet>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Your Profile
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center">
              <img
                src={form.profilePic || "/default-user.png"}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Write a short bio"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Profile Pic URL
              </label>
              <input
                type="text"
                name="profilePic"
                value={form.profilePic}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="https://your-pic-url.com"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
              >
                Save Changes
              </button>
            </div>

            {message && (
              <p className="text-center mt-2 text-sm text-green-600 dark:text-green-400">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
