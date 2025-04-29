import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

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
            clearSessionStorage();
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        } else {
          // Server returned error, consider user not authenticated
          clearSessionStorage();
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        // On network error, fall back to local storage as temporary measure
        fallbackToLocalStorage();
      } finally {
        setIsChecking(false);
      }
    };

    // Only used as fallback when server is unreachable
    const fallbackToLocalStorage = () => {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const admin = sessionStorage.getItem('isAdmin') === 'true';

      setIsAuthenticated(loggedIn);
      setIsAdmin(admin);
    };

    const clearSessionStorage = () => {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('userId');
    };

    // Always verify with server first
    verifyAuthWithServer();

    // Set up periodic re-verification to handle session expiration
    const intervalId = setInterval(verifyAuthWithServer, 15 * 60 * 1000); // Check every 15 minutes

    return () => clearInterval(intervalId);
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