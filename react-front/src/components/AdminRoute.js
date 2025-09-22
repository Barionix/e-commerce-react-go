import React from "react";
import { Navigate } from "react-router-dom";

// Espera que você tenha guardado no localStorage algo como:
// localStorage.setItem("user", JSON.stringify({ tipo: "admin" }));
const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    // Redireciona para login se não for admin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
