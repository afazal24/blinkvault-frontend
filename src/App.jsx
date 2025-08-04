import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

import { AuthProvider, useAuth } from "./context/AuthContext"; 
import AdminProvider from "./context/AdminContext";

// Components & Pages
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SplashAnimation from "./components/SplashAnimation";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignupStep1 from "./pages/SignupStep1";
import SignupStep2 from "./pages/SignupStep2";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TermsAndConditions from "./pages/TermsAndConditions";
import Upload from "./pages/Upload";
import Notifications from "./pages/Notifications";
import Community from "./pages/Community";
import ReportBlock from "./pages/ReportBlock";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";

const NotFoundPage = () => <h2 className="text-center mt-20 text-xl font-semibold">404 | Page Not Found</h2>;

// This component contains the main layout of your app.
// It will ONLY render after the AuthProvider has finished loading the user.
const AppLayout = () => {
  const { user } = useAuth(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex flex-1">
        {user && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${user && isSidebarOpen ? "md:ml-60" : ""}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignupStep1 />} />
              <Route path="/signup/verify" element={<SignupStep2 />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms" element={<TermsAndConditions />} />

              {/* Private Routes */}
              <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/followers/:id" element={<PrivateRoute><Followers /></PrivateRoute>} />
              <Route path="/following/:id" element={<PrivateRoute><Following /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
              <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
              <Route path="/report" element={<PrivateRoute><ReportBlock /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

// The main App component that handles splash screen and providers
const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // Shorter splash time
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashAnimation />;
  }

  return (
    <HelmetProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AdminProvider>
          {/* AuthProvider now wraps the entire AppLayout */}
          <AuthProvider> 
            <AppLayout />
          </AuthProvider>
        </AdminProvider>
      </Router>
    </HelmetProvider>
  );
};

export default App;
