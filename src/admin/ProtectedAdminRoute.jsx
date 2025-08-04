import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const ProtectedAdminRoute = ({ children }) => {
  const { admin } = useContext(AdminContext);

  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedAdminRoute;
