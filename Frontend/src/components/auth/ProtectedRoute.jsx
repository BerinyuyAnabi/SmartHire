// src/components/auth/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated using session data
  const isAuthenticated = () => {
    // This could be a check against localStorage, sessionStorage, or a context
    return sessionStorage.getItem('isLoggedIn') === 'true';
  };

  const isAdmin = () => {
    return sessionStorage.getItem('isAdmin') === 'true';
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin() && window.location.pathname.includes('/admin')) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;