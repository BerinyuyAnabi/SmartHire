// src/components/auth/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check if user is authenticated using session data
  const isAuthenticated = () => {
    // This could be a check against localStorage, sessionStorage, or a context
    return sessionStorage.getItem('isLoggedIn') === 'true';
  };

  const isAdmin = () => {
    return sessionStorage.getItem('isAdmin') === 'true';
  };

  if (!isAuthenticated()) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is trying to access admin page without admin privileges
  if (!isAdmin() && location.pathname.includes('/admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;