import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Add useEffect to inject Bootstrap CDN link if not already added in Home component
  useEffect(() => {
    if (!document.getElementById('bootstrap-cdn')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    
    // Load Font Awesome if not already loaded
    if (!document.getElementById('fontawesome-cdn')) {
      const script = document.createElement('script');
      script.id = 'fontawesome-cdn';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
      script.integrity = 'sha512-Tn2m0TIpgVyTzzvmxLNuqbSJH3JP8jm+Cy3hvHrW7ndTDcJ1w5mBiksqDBb8GpE2ksktFvDB/ykZ0mDpsZj20w==';
      script.crossOrigin = 'anonymous';
      script.defer = true;
      document.head.appendChild(script);
    }
    
    // Handle scroll event to change navbar style
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuthStatus();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setExpanded(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-wrapper">
            <span className="brand-text">Smart</span>
            <span className="brand-highlight">Hire</span>
            <div className="brand-glow"></div>
          </div>
        </NavLink>
        
        <button 
          className={`navbar-toggler ${expanded ? '' : 'collapsed'}`}
          type="button" 
          aria-controls="navbarNav" 
          aria-expanded={expanded ? 'true' : 'false'} 
          aria-label="Toggle navigation"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon">
            <i className={`fas ${expanded ? 'fa-times' : 'fa-bars'}`}></i>
          </span>
        </button>
        
        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  isActive ? "nav-link active" : "nav-link"
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/features" 
                className={({isActive}) => 
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Features
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink 
                to="/job-posting" 
                className={({isActive}) => 
                  isActive ? "nav-link active apply-link" : "nav-link apply-link"
                }
              >
                <span className="nav-link-text">Apply</span>
              </NavLink>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle me-1"></i>
                    {user?.name || 'Account'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <NavLink to="/profile" className="dropdown-item">
                        <i className="fas fa-user me-2"></i> Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/dashboard" className="dropdown-item">
                        <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                      </NavLink>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    <i className="fas fa-sign-in-alt me-1"></i> Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/signup" className="nav-link">
                    <i className="fas fa-user-plus me-1"></i> Sign Up
                  </NavLink>
                </li>
              </>
            )}
            
            <li className="nav-item">
              <NavLink to="/admin" className="btn-link">
                <button className="hr-btn">
                  HR View <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </button>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;