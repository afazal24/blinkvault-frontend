import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import AdminProvider from "./context/AdminContext";
// ✅ STEP 1.1: Import the new HelmetProvider
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ STEP 1.2: Wrap your entire application in the HelmetProvider */}
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
