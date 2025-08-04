import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Use the new AuthContext

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth(); // ✅ Get user and loading state from our new AuthContext

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  // If not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If the route is for admins only and the user is not an admin, redirect to homepage
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;