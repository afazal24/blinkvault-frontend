import React, { useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const SetUsernamePage = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!username.trim()) {
      setError("Username cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "/api/users/set-username",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Username set successfully!");
      setTimeout(() => {
        navigate("/"); // Redirect to home or dashboard
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Set Your Username
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-60"
        >
          {loading ? "Saving..." : "Set Username"}
        </button>

        {message && (
          <p className="text-green-600 dark:text-green-400 text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default SetUsernamePage;
