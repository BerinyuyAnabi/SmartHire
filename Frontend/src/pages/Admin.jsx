import { useState, useEffect, createContext } from 'react';
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
  
  // Check authentication on component mount and when pathname changes
  useEffect(() => {
    const checkAuth = async () => {
      // Don't set loading to true during navigation to avoid flashing
      const isInitialLoad = !currentAdmin;
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null); // Clear any previous errors
      
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
        setError('Authentication failed. Please log in again.');
        navigate('/login');
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };
    
    // Check if we already have auth in session storage first
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const userId = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('adminEmail');
    
    if (isLoggedIn && isAdmin && userId) {
      // If we have session storage data, use it first but verify with server
      setCurrentAdmin({
        id: userId,
        is_admin: true,
        email: email || ''
      });
      setLoading(false);
      
      // Still verify with server in background
      checkAuth();
    } else {
      // Otherwise do the full auth check
      checkAuth();
    }
    
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
    
    // Cleanup function to handle component unmount
    return () => {
      // Any cleanup code here if needed
    };
  }, [navigate]); // Removed location.pathname dependency to prevent re-auth on every navigation

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
    } finally {
      setLoading(false);
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
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>Recruitment Portal</h2>
            <p>{currentAdmin?.email || 'Admin'}</p>
          </div>
          
          <nav className="admin-nav">
            <Link to="/admin" className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link to="/admin/jobs" className={`admin-nav-link ${location.pathname.includes('/admin/jobs') ? 'active' : ''}`}>
              <i className="fas fa-briefcase"></i> Jobs
            </Link>
            <Link to="/admin/applicants" className={`admin-nav-link ${location.pathname.includes('/admin/applicants') ? 'active' : ''}`}>
              <i className="fas fa-users"></i> Applicants
            </Link>
            <Link to="/admin/assessments" className={`admin-nav-link ${location.pathname.includes('/admin/assessments') ? 'active' : ''}`}>
              <i className="fas fa-clipboard-check"></i> Assessments
            </Link>
            <Link to="/admin/users" className={`admin-nav-link ${location.pathname.includes('/admin/users') ? 'active' : ''}`}>
              <i className="fas fa-user-shield"></i> Admin Users
            </Link>
          </nav>
          
          <div className="admin-sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
        
        <div className="admin-content">
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