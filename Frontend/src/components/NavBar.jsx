import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../css/NavBar.css";
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Inject Bootstrap and Font Awesome CDN links
  useEffect(() => {
    // Bootstrap CSS
    if (!document.getElementById('bootstrap-cdn')) {
      const bootstrapLink = document.createElement('link');
      bootstrapLink.id = 'bootstrap-cdn';
      bootstrapLink.rel = 'stylesheet';
      bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      bootstrapLink.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      bootstrapLink.crossOrigin = 'anonymous';
      document.head.appendChild(bootstrapLink);
    }

    // Bootstrap JS
    if (!document.getElementById('bootstrap-js')) {
      const bootstrapScript = document.createElement('script');
      bootstrapScript.id = 'bootstrap-js';
      bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
      bootstrapScript.integrity = 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL';
      bootstrapScript.crossOrigin = 'anonymous';
      document.body.appendChild(bootstrapScript);
    }

    // Font Awesome
    if (!document.getElementById('font-awesome')) {
      const fontAwesomeScript = document.createElement('script');
      fontAwesomeScript.id = 'font-awesome';
      fontAwesomeScript.src = 'https://kit.fontawesome.com/a076d05399.js';
      fontAwesomeScript.crossOrigin = 'anonymous';
      document.body.appendChild(fontAwesomeScript);
    }

    // Cleanup function
    return () => {
      const bootstrapLink = document.getElementById('bootstrap-cdn');
      const bootstrapScript = document.getElementById('bootstrap-js');
      const fontAwesomeScript = document.getElementById('font-awesome');
      
      if (bootstrapLink) document.head.removeChild(bootstrapLink);
      if (bootstrapScript) document.body.removeChild(bootstrapScript);
      if (fontAwesomeScript) document.body.removeChild(fontAwesomeScript);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuExpanded(false);
  }, [location]);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img src="/static/images/logo.png" alt="SmartHire Logo" className="logo" />
          SmartHire
        </NavLink>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuExpanded(!isMenuExpanded)}
          aria-expanded={isMenuExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuExpanded ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <i className="fas fa-home"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/features">
                <i className="fas fa-star"></i> Features
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/job-posting">
                <i className="fas fa-briefcase"></i> Job Posting
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/hr-view">
                  <i className="fas fa-user-tie"></i> HR View
                </NavLink>
              </li>
            )}
          </ul>
          
          <div className="d-flex">
            {isAuthenticated ? (
              <button className="btn btn-outline-light" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-outline-light me-2">
                  <i className="fas fa-sign-in-alt"></i> Login
                </NavLink>
                <NavLink to="/signup" className="btn btn-primary">
                  <i className="fas fa-user-plus"></i> Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;