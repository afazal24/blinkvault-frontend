// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
// ✅ THE FIX: Changed from 'react-helmet' to 'react-helmet-async'
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff } from "lucide-react";

// Helper component for password input with show/hide toggle
const PasswordInput = ({ value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative w-full">
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder="Password"
                required
                className="w-full border rounded px-3 py-2 pr-10 text-black dark:bg-gray-700 dark:text-white"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
};


const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedMobile = mobile.trim();
      const trimmedPassword = password.trim();

      const res = await axios.post("/auth/login", { 
        mobile: trimmedMobile, 
        password: trimmedPassword 
      });

      login(res.data.user, res.data.accessToken);

      toast.success("🎉 Login successful!");
      navigate("/"); // Redirect to homepage
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - BlinkVault</title>
        <meta name="description" content="Login to your BlinkVault account and continue exploring." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-white mb-4">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              className="w-full border rounded px-3 py-2 text-black dark:bg-gray-700 dark:text-white"
              required
            />
            
            <PasswordInput 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
            <span>Forgot your password? </span>
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Reset here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
