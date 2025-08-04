import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const SignupStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { name, mobile } = location.state || {};

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState({
    loading: false,
    available: false,
    message: "",
    suggestions: [],
  });

  // ✅ THE FIX: Create a handler that forces lowercase and valid characters
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    // Convert to lowercase and remove any character that is not a-z, 0-9, or _
    const sanitizedUsername = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(sanitizedUsername);
  };


  useEffect(() => {
    const handler = setTimeout(() => {
      if (username.trim().length >= 3) {
        checkUsernameAvailability(username.trim());
      } else {
        setUsernameStatus({ loading: false, available: false, message: "", suggestions: [] });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  const checkUsernameAvailability = async (uname) => {
    setUsernameStatus({ loading: true, available: false, message: "", suggestions: [] });
    try {
      const res = await axios.post("/auth/check-username", { username: uname });
      setUsernameStatus({
        loading: false,
        available: res.data.available,
        message: res.data.message,
        suggestions: res.data.suggestions || [],
      });
    } catch (error) {
      setUsernameStatus({
        loading: false,
        available: false,
        message: error.response?.data?.message || "Error checking username.",
        suggestions: [],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !password || !username) {
      return toast.error("All fields are required.");
    }
    if (!usernameStatus.available) {
        return toast.error("Please choose an available username.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/auth/setPasswordAndVerifyOTP",
        { mobile, name, username: username.trim(), otp, password }
      );
      login(res.data.user, res.data.accessToken);
      toast.success("🎉 Signup successful!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!mobile || !name) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold text-lg">
        ⚠️ Access denied. Please go through Step 1 first.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 px-4">
      <Helmet>
        <title>Signup - Step 2 | BlinkVault</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6"
        >
          Almost There!
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OTP Code
            </label>
            <input
              type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP sent to your mobile"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Choose a Username
            </label>
            <div className="relative">
                <input
                    type="text" 
                    value={username} 
                    // Use the new handler here
                    onChange={handleUsernameChange}
                    placeholder="@your_unique_username"
                    className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:outline-none ${
                        username.length < 3 ? 'border-gray-300 dark:border-gray-700 focus:ring-blue-500' : 
                        usernameStatus.available ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500'
                    }`}
                    required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {usernameStatus.loading && <Loader2 className="animate-spin text-gray-400"/>}
                    {!usernameStatus.loading && usernameStatus.available && username.length >= 3 && <CheckCircle2 className="text-green-500"/>}
                    {!usernameStatus.loading && !usernameStatus.available && username.length >= 3 && <XCircle className="text-red-500"/>}
                </div>
            </div>
            {!usernameStatus.loading && username.length >= 3 && (
                <div className="text-xs mt-1">
                    {usernameStatus.available ? (
                        <p className="text-green-600">{usernameStatus.message}</p>
                    ) : (
                        <div>
                            <p className="text-red-600">{usernameStatus.message}</p>
                            {usernameStatus.suggestions.length > 0 && (
                                <div className="flex gap-2 mt-1">
                                    <span className="text-gray-500">Try:</span>
                                    {usernameStatus.suggestions.map(s => (
                                        <button key={s} type="button" onClick={() => setUsername(s)} className="text-blue-600 hover:underline">
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a secure password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !usernameStatus.available}
            className={`w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Verifying..." : "Finish Signup"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupStep2;
