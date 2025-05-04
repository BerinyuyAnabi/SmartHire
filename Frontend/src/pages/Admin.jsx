// Updated Admin.js with fixed authentication logic to prevent infinite loops

import { useState, useEffect, createContext, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import "../css/Admin.css";

// Admin Dashboard Components
import AdminDashboard from '../components/admin/AdminDashboard';
import JobsManagement from '../components/admin/JobsManagement';
import ApplicantsManagement from '../components/admin/ApplicantsManagement';
import AssessmentsManagement from '../components/admin/AssessmentsManagement';
import AdminUsersManagement from '../components/admin/AdminUsersManagement';

// Create a context to share admin state with child components
export const AdminContext = createContext(null);

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use a ref to track if authentication check is in progress
  const authCheckInProgress = useRef(false);
  // Use a ref to prevent multiple simultaneous auth checks
  const isInitialAuthCheck = useRef(true);
  
  // Toggle sidebar function for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.body.classList.toggle('sidebar-active');
  };
  
  // Close sidebar if clicking outside on mobile
  const handleContentClick = () => {
    if (window.innerWidth <= 768 && sidebarOpen) {
      setSidebarOpen(false);
      document.body.classList.remove('sidebar-active');
    }
  };
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent concurrent auth checks
      if (authCheckInProgress.current) {
        return;
      }
      
      authCheckInProgress.current = true;
      
      // Only show loading on initial check, not background verifications
      if (isInitialAuthCheck.current) {
        setLoading(true);
      }
      
      // Clear any previous errors
      setError(null);
      
      try {
        console.log("Checking authentication...");
        const response = await fetch('/api/check-auth', {
          credentials: 'include'
        });
        
        console.log("Auth response status:", response.status);
        
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        
        const data = await response.json();
        console.log("Auth response data:", data);
        
        if (!data.is_admin) {
          setError('You do not have admin privileges');
          navigate('/login');
        } else {
          // Store auth info in session storage for persistence
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('isAdmin', 'true');
          sessionStorage.setItem('userId', data.id);
          sessionStorage.setItem('adminEmail', data.email || '');
          
          setCurrentAdmin(data);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        
        // Only navigate to login on initial check, not on background verification
        if (isInitialAuthCheck.current) {
          setError('Authentication failed. Please log in again.');
          navigate('/login');
        }
      } finally {
        if (isInitialAuthCheck.current) {
          setLoading(false);
          isInitialAuthCheck.current = false;
        }
        authCheckInProgress.current = false;
      }
    };
    
    // Check if we already have auth in session storage first
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const userId = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('adminEmail');
    
    if (isLoggedIn && isAdmin && userId) {
      // If we have session storage data, use it first
      setCurrentAdmin({
        id: userId,
        is_admin: true,
        email: email || ''
      });
      setLoading(false);
      isInitialAuthCheck.current = false;
      
      // Background verification - only do this once on load
      checkAuth();
    } else {
      // Otherwise do the full auth check
      checkAuth();
    }
    
    // Add window resize event to close sidebar on desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
        document.body.classList.remove('sidebar-active');
      }
    };
    
    // Add scroll event to handle sidebar styling when scrolling
    const handleScroll = () => {
      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) {
        if (window.scrollY > 60) {
          sidebar.classList.add('sidebar-scrolled');
        } else {
          sidebar.classList.remove('sidebar-scrolled');
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Load Bootstrap and FontAwesome
    if (!document.getElementById('bootstrap-css')) {
      const bootstrapLink = document.createElement('link');
      bootstrapLink.id = 'bootstrap-css';
      bootstrapLink.rel = 'stylesheet';
      bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      bootstrapLink.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      bootstrapLink.crossOrigin = 'anonymous';
      document.head.appendChild(bootstrapLink);
    }
    
    if (!document.getElementById('fontawesome-css')) {
      const faLink = document.createElement('link');
      faLink.id = 'fontawesome-css';
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(faLink);
    }
    
    // Load Bootstrap JS
    if (!document.getElementById('bootstrap-js')) {
      const bootstrapScript = document.createElement('script');
      bootstrapScript.id = 'bootstrap-js';
      bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
      bootstrapScript.integrity = 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL';
      bootstrapScript.crossOrigin = 'anonymous';
      document.body.appendChild(bootstrapScript);
    }
    
    // Cleanup function to handle component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]); // Remove dependencies that might cause re-runs

  const handleLogout = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Logout request failed');
      }
      
      // Clear any session storage
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('adminEmail');
      
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
      setLoading(false); // Make sure to set loading to false if there's an error
    }
  };

  // Active tab detection
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }
  
  // If there's an error that didn't redirect, show error message
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="error-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  // If not authenticated (no currentAdmin), redirect to login
  if (!currentAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <AdminContext.Provider value={{ currentAdmin }}>
      <div className="admin-portal">
        {/* Mobile Sidebar Toggle Button */}
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar menu"
        >
          <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
        </button>
        
        {/* Sidebar */}
        <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <h2>Recruitment Portal</h2>
            <p>{currentAdmin?.email || 'Admin'}</p>
          </div>
          
          <nav className="admin-nav">
            <Link 
              to="/admin" 
              className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`} 
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link 
              to="/admin/jobs" 
              className={`admin-nav-link ${location.pathname.includes('/admin/jobs') ? 'active' : ''}`} 
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-briefcase"></i> Jobs
            </Link>
            <Link 
              to="/admin/applicants" 
              className={`admin-nav-link ${location.pathname.includes('/admin/applicants') ? 'active' : ''}`} 
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-users"></i> Applicants
            </Link>
            <Link 
              to="/admin/assessments" 
              className={`admin-nav-link ${location.pathname.includes('/admin/assessments') ? 'active' : ''}`} 
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-clipboard-check"></i> Assessments
            </Link>
            <Link 
              to="/admin/users" 
              className={`admin-nav-link ${location.pathname.includes('/admin/users') ? 'active' : ''}`} 
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-user-shield"></i> Admin Users
            </Link>
          </nav>
          
          <div className="admin-sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="admin-content" onClick={handleContentClick}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/jobs/*" element={<JobsManagement />} />
            <Route path="/applicants/*" element={<ApplicantsManagement />} />
            <Route path="/assessments/*" element={<AssessmentsManagement />} />
            <Route path="/users/*" element={<AdminUsersManagement />} />
          </Routes>
        </div>
      </div>
    </AdminContext.Provider>
  );
}

export default Admin;