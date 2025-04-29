// src/components/auth/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // First check session storage for quick client-side check
    const checkLocalAuth = () => {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const admin = sessionStorage.getItem('isAdmin') === 'true';
      
      setIsAuthenticated(loggedIn);
      setIsAdmin(admin);
      
      return loggedIn;
    };
    
    // Then verify with server to ensure session is actually valid
    const verifyAuthWithServer = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('isAdmin', data.is_admin ? 'true' : 'false');
            sessionStorage.setItem('userId', data.id);
            
            setIsAuthenticated(true);
            setIsAdmin(data.is_admin);
          } else {
            // Clear session storage if server says not authenticated
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('userId');
            
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        } else {
          // Server returned error, consider user not authenticated
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        // On error, fall back to local check
        checkLocalAuth();
      } finally {
        setIsChecking(false);
      }
    };

    // First check local storage
    const localCheck = checkLocalAuth();
    
    // If locally authenticated, verify with server
    if (localCheck) {
      verifyAuthWithServer();
    } else {
      setIsChecking(false);
    }
  }, [location.pathname]);

  // Show loading or placeholder while checking authentication
  if (isChecking) {
    return <div className="loading">Checking authentication...</div>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin check for admin-only routes
  if (location.pathname.includes('/admin') && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized, render the protected component
  return children;
};

export default ProtectedRoute;