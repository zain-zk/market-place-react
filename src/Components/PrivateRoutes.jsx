// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import userContext from "../contexts/userContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const { user } = useContext(userContext); // get user info with role
  // Not logged in
  if (!token) return <Navigate to="/login" replace />;
  // Logged in but user not loaded yet
  if (!user) return <div>Loading...</div>;
  // Role check
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
