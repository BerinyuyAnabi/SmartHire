import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have one of the required roles
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role, render the protected content
  return <Outlet />;
};

export default ProtectedRoute; 