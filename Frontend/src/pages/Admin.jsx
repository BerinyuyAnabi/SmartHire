// src/pages/Admin.js
import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import "../css/Admin.css";

// Admin Dashboard Components
import AdminDashboard from '../components/admin/AdminDashboard';
import JobsManagement from '../components/admin/JobsManagement';
import ApplicantsManagement from '../components/admin/ApplicantsManagement';
import AssessmentsManagement from '../components/admin/AssessmentsManagement';
import AdminUsersManagement from '../components/admin/AdminUsersManagement';

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        
        const data = await response.json();
        if (!data.is_admin) {
          navigate('/login');
        } else {
          setCurrentAdmin(data);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/login');
      }
    };
    
    checkAuth();
    
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
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/logout', {
        method: 'GET',
        credentials: 'include'
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Active tab detection
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-portal">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Recruitment Portal</h2>
          <p>{currentAdmin?.username || 'Admin'}</p>
        </div>
        
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
          <Link to="/admin/jobs" className={`admin-nav-link ${isActive('/admin/jobs') ? 'active' : ''}`}>
            <i className="fas fa-briefcase"></i> Jobs
          </Link>
          <Link to="/admin/applicants" className={`admin-nav-link ${isActive('/admin/applicants') ? 'active' : ''}`}>
            <i className="fas fa-users"></i> Applicants
          </Link>
          <Link to="/admin/assessments" className={`admin-nav-link ${isActive('/admin/assessments') ? 'active' : ''}`}>
            <i className="fas fa-clipboard-check"></i> Assessments
          </Link>
          {currentAdmin?.is_super_admin && (
            <Link to="/admin/users" className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
              <i className="fas fa-user-shield"></i> Admin Users
            </Link>
          )}
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
  );
}

export default Admin;