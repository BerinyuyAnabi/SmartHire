import React from "react";
import { NavLink } from "react-router-dom";

import "../css/NavBar.css";

function NavBar() {
  // Add useEffect to inject Bootstrap CDN link if not already added in Home component
  React.useEffect(() => {
    if (!document.getElementById('bootstrap-cdn')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link text-decoration-none">
            <p className="mb-0 d-inline">Smart</p>
            <p className="nav_name mb-0 d-inline">Hire</p>
          </NavLink>
        </div>

        <div className="navbar-links d-flex align-items-center">
          <NavLink 
            to="/apply" 
            className={({ isActive }) => 
              isActive 
                ? "nav-link active-link me-3 text-decoration-none" 
                : "nav-link me-3 text-decoration-none"
            }
          >
            Apply
          </NavLink>
          
          <button className="HR_view">HR view</button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;