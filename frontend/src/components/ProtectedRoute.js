import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  // Check if user is logged in
  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  // Check if the user's role matches the required role for this route
  if (role && auth.user.role !== role) {
    return <Navigate to="/" />; // Redirect to home if role doesn't match
  }

  return children; // Render the protected component
};

export default ProtectedRoute;
