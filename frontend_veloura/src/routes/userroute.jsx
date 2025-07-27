import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authconetxt";

const UserProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <>Loading...</>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "user") return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default UserProtectedRoute;
