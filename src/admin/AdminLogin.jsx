// ✅ AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAdminContext } from "../context/AdminContext";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAdmin } = useAdminContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ THE FIX: The URL should not start with /api because your axios instance
      // already adds it. We just need the part AFTER /api.
      const url = "/admin/login"; 
      
      const payload = {
        mobile: mobile.trim(),
        password: password.trim(),
      };

      const res = await axios.post(url, payload);

      setAdmin(res.data);
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");

    } catch (err) {
      const message = err.response?.data?.message || "Invalid mobile number or password";
      toast.error(message);
      console.error("Admin Login Error:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="mobile"
              className="block text-gray-700 dark:text-gray-200 mb-1"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-200 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:bg-blue-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
