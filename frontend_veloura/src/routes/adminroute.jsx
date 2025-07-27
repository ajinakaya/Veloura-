import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authconetxt"; 


const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <>Loading...</>;
    if (!user) return <Navigate to="/login" replace />;

  // Only allow Admins
  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
