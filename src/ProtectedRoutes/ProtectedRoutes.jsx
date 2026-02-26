import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoutes = ({ children }) => {
  const token = Cookies.get("admin_token");

  // agar token nahi hai → login page redirect
  if (!token) {
    return <Navigate to="/login-page" replace />;
  }

  // agar token hai → children render karo
  return children;
};

export default ProtectedRoutes;
