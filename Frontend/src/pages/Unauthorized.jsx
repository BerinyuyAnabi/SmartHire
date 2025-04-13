import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="unauthorized-title">Access Denied</h1>
        <div className="unauthorized-icon">
          <i className="fas fa-lock"></i>
        </div>
        <p className="unauthorized-message">
          You don't have permission to access this page.
        </p>
        <div className="unauthorized-actions">
          <Link to="/" className="unauthorized-button">
            <i className="fas fa-home"></i> Go to Home
          </Link>
          <Link to="/login" className="unauthorized-button">
            <i className="fas fa-sign-in-alt"></i> Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 