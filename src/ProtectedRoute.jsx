// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  if (!userId) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children; // Authorized, show the page
};

export default ProtectedRoute;
