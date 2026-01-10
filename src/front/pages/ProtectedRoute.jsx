import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("access_token");

  // If no token, redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Por favor inicia sesión primero ❌" }}
      />
    );
  }

  // Otherwise, render the child route
  return <Outlet />;
};

export default ProtectedRoute;