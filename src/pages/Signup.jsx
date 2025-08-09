import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  MailCheck,
} from "lucide-react";
import Confetti from "react-confetti";

// --- Reusable Components ---
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

const UsernameInput = ({ value, onChange, status }) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="@your_unique_username"
      required
      className={`w-full px-4 py-3 rounded-lg border dark:bg-gray-800 focus:ring-2 focus:outline-none ${
        value.length < 3
          ? "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
          : status.available
          ? "border-green-500 focus:ring-green-500"
          : "border-red-500 focus:ring-red-500"
      }`}
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
      {status.loading && <Loader2 className="animate-spin text-gray-400" />}
      {!status.loading && status.available && value.length >= 3 && (
        <CheckCircle2 className="text-green-500" />
      )}
      {!status.loading && !status.available && value.length >= 3 && (
        <XCircle className="text-red-500" />
      )}
    </div>
  </div>
);

// --- Main Signup Component ---
const Signup = () => {
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Logic States
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({
    loading: false,
    available: false,
    message: "",
    suggestions: [],
  });

  // Username availability check (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (username.trim().length >= 3) {
        checkUsernameAvailability(username.trim());
      } else {
        setUsernameStatus({
          loading: false,
          available: false,
          message: "",
          suggestions: [],
        });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [username]);

  const checkUsernameAvailability = async (uname) => {
    setUsernameStatus({ ...usernameStatus, loading: true });
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
        message: error.response?.data?.message || "Error.",
        suggestions: [],
      });
    }
  };

  // Enforce lowercase and valid characters for username
  const handleUsernameChange = (e) => {
    const sanitized = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    setUsername(sanitized);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameStatus.available) {
      return toast.error("Please choose an available username.");
    }
    setLoading(true);
    try {
      await axios.post("/auth/signup", { name, email, username, password });
      setSignupSuccess(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again."
      );
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    }/auth/google`;
  };

  // Success screen after user submits the form
  if (signupSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-green-200 dark:from-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
        <Confetti numberOfPieces={200} recycle={false} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center"
        >
          <MailCheck
            size={64}
            className="mx-auto text-green-500 mb-4 animate-bounce"
          />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Check Your Inbox!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            We've sent a verification link to <b>{email}</b>. Please click the
            link to activate your account.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 text-white font-semibold py-3 px-4 rounded-lg transition transform"
          >
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 px-4">
      <Helmet>
        <title>Create Account | BlinkVault</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Join BlinkVault
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Share your thoughts, theories, and secrets.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Full Name",
              type: "text",
            },
            {
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "Email Address",
              type: "email",
            },
          ].map((field, i) => (
            <motion.input
              key={i}
              type={field.type}
              value={field.value}
              onChange={field.onChange}
              placeholder={field.placeholder}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UsernameInput
              value={username}
              onChange={handleUsernameChange}
              status={usernameStatus}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading || !usernameStatus.available}
            className="w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 text-white font-semibold py-3 px-4 rounded-lg transition transform disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
              OR
            </span>
          </div>
        </div>

        <motion.button
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center gap-3 border dark:border-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          whileTap={{ scale: 0.97 }}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c5.808 0 10.772 4.125 11.727 9.502l6.522-4.981C42.966 13.226 34.243 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.389 36.053 44 30.608 44 24c0-1.341-.138-2.65-.389-3.917z"
            ></path>
          </svg>
          Continue with Google
        </motion.button>
        <p className="text-xs text-gray-500 text-center mt-6">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-blue-500">
            Terms of Service
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
