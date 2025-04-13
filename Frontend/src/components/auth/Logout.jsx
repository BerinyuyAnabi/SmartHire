import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Use the logout function from AuthContext
        await logout();
        
        // Redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Still redirect to login page even if there's an error
        navigate('/login');
      }
    };

    performLogout();
  }, [navigate, logout]);

  return (
    <div className="logout-container">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout; 