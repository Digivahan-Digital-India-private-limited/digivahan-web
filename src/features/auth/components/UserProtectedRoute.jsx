import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getSessionUser } from "../services/authSessionApi";

const UserProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = Cookies.get("user_token");

  const {
    isError,
    error,
  } = useQuery({
    queryKey: ["user-session"],
    queryFn: getSessionUser,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isError) {
    const statusCode = error?.response?.status;
    if (statusCode === 401 || statusCode === 403) {
      Cookies.remove("user_token");
      localStorage.removeItem("marketplace_capabilities");
      localStorage.removeItem("user_login_phone");
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  return children || <Outlet />;
};

export default UserProtectedRoute;
