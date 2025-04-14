// import React from "react";
// import { NavLink } from "react-router-dom";

// import "../css/NavBar.css";

// function NavBar() {
//   // Add useEffect to inject Bootstrap CDN link if not already added in Home component
//   React.useEffect(() => {
//     if (!document.getElementById('bootstrap-cdn')) {
//       const link = document.createElement('link');
//       link.id = 'bootstrap-cdn';
//       link.rel = 'stylesheet';
//       link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
//       link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
//       link.crossOrigin = 'anonymous';
//       document.head.appendChild(link);
//     }
//   }, []);

//   return (
//     <nav className="navbar navbar-expand-lg">
//       <div className="container">
//         <div className="navbar-brand">
//           <NavLink to="/" className="brand-link text-decoration-none">
//             <p className="mb-0 d-inline">Smart</p>
//             <p className="nav_name mb-0 d-inline">Hire</p>
//           </NavLink>
//         </div>

//         <div className="navbar-links d-flex align-items-center">
//           <NavLink 
//             to="/job-posting" 
//             className={({ isActive }) => 
//               isActive 
//                 ? "nav-link active-link me-3 text-decoration-none" 
//                 : "nav-link me-3 text-decoration-none"
//             }
//           >
//             Apply
//           </NavLink>
          
//           <a href="/admin">
//               <button className="HR_view">HR view</button>
//           </a>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default NavBar;


import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

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
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setExpanded(false);
  }, [location]);

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
            <li className="nav-item">
              <NavLink to="/Login" className="btn-link">
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