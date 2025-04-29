// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on mount and setup periodic re-verification
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            // Update state and session storage
            setCurrentUser(data);
            sessionStorage.setItem('adminUser', JSON.stringify(data));
          } else {
            // Not authenticated
            clearAuthData();
          }
        } else {
          // Failed to check auth
          clearAuthData();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError('Failed to check authentication status');

        // On network error, rely on existing session data if available
        const storedUser = sessionStorage.getItem('adminUser');
        if (!storedUser) {
          clearAuthData();
        }
      } finally {
        setLoading(false);
      }
    };

    // Clear authentication data and redirect
    const clearAuthData = () => {
      setCurrentUser(null);
      sessionStorage.removeItem('adminUser');
      navigate('/login');
    };

    // Check auth immediately
    checkAuthStatus();

    // Setup periodic re-verification to handle session expiration
    const intervalId = setInterval(checkAuthStatus, 15 * 60 * 1000); // every 15 minutes

    return () => clearInterval(intervalId);
  }, [navigate]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const userData = await response.json();
      setCurrentUser(userData);
      sessionStorage.setItem('adminUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setCurrentUser(null);
      sessionStorage.removeItem('adminUser');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
      // Still clear local data even if server logout fails
      setCurrentUser(null);
      sessionStorage.removeItem('adminUser');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Check if user is admin
  const isAdmin = () => {
    return !!currentUser && currentUser.is_admin === true;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      error,
      login,
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// src/components/auth/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const { currentUser, loading, isAuthenticated, isAdmin } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin rights for admin-only routes
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized, render the protected component
  return children;
};

export default ProtectedRoute;