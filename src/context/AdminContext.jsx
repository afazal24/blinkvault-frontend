import { createContext, useContext, useEffect, useState } from "react";

// 1. Context Create
export const AdminContext = createContext();

// 2. Custom Hook Export
export const useAdminContext = () => useContext(AdminContext);

// 3. Provider Component
const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("adminUser", JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminUser");
  };

  return (
    <AdminContext.Provider
      value={{ admin, loginAdmin, logoutAdmin, setAdmin }} // ✅ FIXED: Added setAdmin
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
