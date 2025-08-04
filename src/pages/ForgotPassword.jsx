import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff } from "lucide-react";

// Helper component for password input with show/hide toggle
const PasswordInput = ({ value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative w-full">
            <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full border rounded px-3 py-2 pr-10 mb-4 dark:bg-gray-700 dark:text-white"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
};


const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 for mobile input, 2 for OTP/password
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(mobile)) {
      return toast.error("Please enter a valid 10-digit mobile number.");
    }
    setLoading(true);
    try {
      // ✅ FIX: Send the 'purpose' to the backend so it knows this is for a password reset.
      const res = await axios.post("/auth/send-otp", { 
        mobile, 
        purpose: 'forgot_password' 
      });
      toast.success(res.data.message || "OTP has been sent.");
      setStep(2); // Move to the next step
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim() || !newPassword.trim()) {
      return toast.error("OTP and a new password are required.");
    }
    setLoading(true);
    try {
      // ✅ FIX: Call the correct backend endpoint for resetting the password.
      const res = await axios.post("/auth/forgot-password", {
        mobile,
        otp,
        newPassword,
      });

      toast.success("✅ Password has been reset successfully! Please log in.");
      navigate("/login"); // Redirect to login page after successful reset
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Helmet>
        <title>Forgot Password | BlinkVault</title>
        <meta name="description" content="Recover your BlinkVault account using mobile OTP verification." />
      </Helmet>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Registered Mobile Number
            </label>
            <input
              type="tel"
              autoFocus
              autoComplete="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your 10-digit mobile number"
              className="w-full border rounded px-3 py-2 mb-4 dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">OTP</label>
            <input
              type="text"
              autoFocus
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP you received"
              className="w-full border rounded px-3 py-2 mb-3 dark:bg-gray-700 dark:text-white"
              required
            />

            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
         <div className="text-sm text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
