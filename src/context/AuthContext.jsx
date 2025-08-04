import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/users/me");
        const userData = response?.data?.user;

        if (userData && userData._id) {
          setUser(userData);
        } else {
          throw new Error("User data incomplete");
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
          Loading Your Experience...
        </p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
