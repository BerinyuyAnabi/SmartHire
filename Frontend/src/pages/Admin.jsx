import React, { useState, useEffect, createContext, useRef } from 'react';
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>Something went wrong: {this.state.error.message}</p>
            <button onClick={() => window.location.reload()} className="error-button">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Create a ref to track component mount state
  const isMounted = useRef(true);
  const authCheckInProgress = useRef(false);
  const isInitialAuthCheck = useRef(true);

  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safelyLoadResource = (resourceType, id, attributes) => {
    if (document.getElementById(id)) return;
    let element;
    if (resourceType === 'script') {
      element = document.createElement('script');
    } else if (resourceType === 'style') {
      element = document.createElement('link');
      element.rel = 'stylesheet';
    } else {
      console.warn(`Unsupported resource type: ${resourceType}`);
      return;
    }
    element.id = id;
    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value;
    });
    if (resourceType === 'script') {
      document.body.appendChild(element);
    } else {
      document.head.appendChild(element);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.body.classList.toggle('sidebar-active');
  };

  const handleContentClick = () => {
    if (window.innerWidth <= 768 && sidebarOpen) {
      setSidebarOpen(false);
      document.body.classList.remove('sidebar-active');
    }
  };

  useEffect(() => {
    safelyLoadResource('style', 'bootstrap-css', {
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
      crossOrigin: 'anonymous'
    });
    safelyLoadResource('style', 'fontawesome-css', {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    });
    safelyLoadResource('script', 'bootstrap-js', {
      src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
      crossOrigin: 'anonymous'
    });

    const handleResize = () => {
      if (window.innerWidth > 768 && isMounted.current) {
        setSidebarOpen(false);
        document.body.classList.remove('sidebar-active');
      }
    };

    const handleScroll = () => {
      const sidebar = document.querySelector('.admin-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('sidebar-scrolled', window.scrollY > 60);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckInProgress.current) return;
      authCheckInProgress.current = true;

      if (isInitialAuthCheck.current && isMounted.current) {
        setLoading(true);
      }
      
      if (isMounted.current) {
        setError(null);
      }

      try {
        const response = await fetch('/api/check-auth', {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Not authenticated');
        const data = await response.json();

        // Only update state if component is still mounted
        if (!isMounted.current) return;

        if (!data.is_admin) {
          setError('You do not have admin privileges');
          navigate('/login');
        } else {
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('isAdmin', 'true');
          sessionStorage.setItem('userId', data.id);
          sessionStorage.setItem('adminEmail', data.email || '');
          setCurrentAdmin(data);
        }
      } catch (err) {
        // Using the error parameter
        console.error('Authentication check error:', err);
        if (isInitialAuthCheck.current && isMounted.current) {
          setError('Authentication failed. Please log in again.');
          navigate('/login');
        }
      } finally {
        if (isInitialAuthCheck.current && isMounted.current) {
          setLoading(false);
          isInitialAuthCheck.current = false;
        }
        authCheckInProgress.current = false;
      }
    };

    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const userId = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('adminEmail');

    if (isLoggedIn && isAdmin && userId) {
      if (isMounted.current) {
        setCurrentAdmin({ id: userId, is_admin: true, email: email || '' });
        setLoading(false);
        isInitialAuthCheck.current = false;
      }
      checkAuth();
    } else {
      checkAuth();
    }
  }, [navigate]);

  const handleLogout = async () => {
    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Logout request failed');

      sessionStorage.clear();
      
      // Only navigate if component is still mounted
      if (isMounted.current) {
        navigate('/login');
      }
    } catch (err) {
      // Using the error parameter
      console.error('Logout error:', err);
      // Only update state if component is still mounted
      if (isMounted.current) {
        setError('Logout failed. Please try again.');
        setLoading(false);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

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

  if (!currentAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <AdminContext.Provider value={{ currentAdmin }}>
      <div className="admin-portal" onClick={handleContentClick}>
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar menu">
          <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
        </button>

        <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <h2>Recruitment Portal</h2>
            <p>{currentAdmin?.email || 'Admin'}</p>
          </div>

          <nav className="admin-nav">
            <Link to="/admin" className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link to="/admin/jobs" className={`admin-nav-link ${location.pathname.includes('/admin/jobs') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <i className="fas fa-briefcase"></i> Jobs
            </Link>
            <Link to="/admin/applicants" className={`admin-nav-link ${location.pathname.includes('/admin/applicants') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <i className="fas fa-users"></i> Applicants
            </Link>
            <Link to="/admin/assessments" className={`admin-nav-link ${location.pathname.includes('/admin/assessments') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <i className="fas fa-clipboard-check"></i> Assessments
            </Link>
            <Link to="/admin/users" className={`admin-nav-link ${location.pathname.includes('/admin/users') ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <i className="fas fa-user-shield"></i> Admin Users
            </Link>
            <button className="admin-nav-link logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </nav>
        </div>

        <div className="admin-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="jobs/*" element={<JobsManagement />} />
              <Route path="applicants/*" element={<ApplicantsManagement />} />
              <Route path="assessments/*" element={<AssessmentsManagement />} />
              <Route path="users/*" element={<AdminUsersManagement />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </AdminContext.Provider>
  );
}

export default Admin;