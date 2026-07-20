import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const MasterProtectedRoutes = ({ children }) => {
  const token = Cookies.get("master_admin_token");

  // If there's no master_admin_token, redirect to the master admin login page
  if (!token) {
    return <Navigate to="/page/admin/master" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default MasterProtectedRoutes;
