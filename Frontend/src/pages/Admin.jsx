import { useState, useEffect, createContext, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import "../css/Admin.css";
import { initAdminDashboard } from '../utils/AdminUtils';

// Import the utility
import { showToast } from '../utils/AdminUtils';

// Show different types of notifications
showToast('Settings saved successfully!', 'success');
showToast('Please complete all required fields', 'warning');
showToast('Connection error, please try again', 'error');
showToast('Syncing data in progress...', 'info');


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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New applicant for Software Engineer position', time: '10 minutes ago', read: false },
    { id: 2, text: 'John Doe completed assessment', time: '2 hours ago', read: false },
    { id: 3, text: 'Interview scheduled with Sarah Miller', time: 'Yesterday', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  
  // Refs for click outside functionality
  const sidebarRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  
  // Toggle sidebar function for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
    // Toggle body class for overlay effect
    if (!sidebarOpen) {
      document.body.classList.add('sidebar-active');
    } else {
      document.body.classList.remove('sidebar-active');
    }
  };
  
  // Toggle user dropdown menu
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  // Toggle notifications panel
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };
  
  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Update unread count
    const newUnreadCount = updatedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(newUnreadCount);
  };
  
  // Initialize all admin dashboard functionality
  useEffect(() => {
    // Initialize admin dashboard and get cleanup function
    const cleanup = initAdminDashboard();
    
    // Return cleanup function to remove event listeners when component unmounts
    return cleanup;
  }, []);
  
  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target) &&
          !event.target.closest('.user-menu-toggle')) {
        setShowUserMenu(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target) &&
          !event.target.closest('.notifications-toggle')) {
        setShowNotifications(false);
      }
      
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) &&
          !event.target.closest('.sidebar-toggle') &&
          window.innerWidth <= 991 && sidebarOpen) {
        setSidebarOpen(false);
        document.body.classList.remove('sidebar-active');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, showUserMenu, showNotifications]);
  
  // Handle window resize to close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991 && sidebarOpen) {
        setSidebarOpen(false);
        document.body.classList.remove('sidebar-active');
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);
  
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
          sessionStorage.setItem('adminName', data.name || 'Admin User');
          sessionStorage.setItem('adminRole', data.role || 'Administrator');
          sessionStorage.setItem('adminAvatar', data.avatar || '');
          
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
    const name = sessionStorage.getItem('adminName');
    const role = sessionStorage.getItem('adminRole');
    const avatar = sessionStorage.getItem('adminAvatar');
    
    if (isLoggedIn && isAdmin && userId) {
      // If we have session storage data, use it first but verify with server
      setCurrentAdmin({
        id: userId,
        is_admin: true,
        email: email || '',
        name: name || 'Admin User',
        role: role || 'Administrator',
        avatar: avatar || ''
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
      // Any cleanup code here if needed
    };
  }, [navigate, currentAdmin]);

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
      sessionStorage.removeItem('adminName');
      sessionStorage.removeItem('adminRole');
      sessionStorage.removeItem('adminAvatar');
      
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
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <span>L</span>
            <span>o</span>
            <span>a</span>
            <span>d</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    );
  }
  
  // If there's an error that didn't redirect, show error message
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h3 className="error-title">Authentication Error</h3>
          <p className="error-message">{error}</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            <i className="fas fa-sign-in-alt"></i> Return to Login
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
  
  // Get first name for greeting
  const firstName = currentAdmin.name ? currentAdmin.name.split(' ')[0] : 'Admin';

  return (
    <AdminContext.Provider value={{ currentAdmin }}>
      <div className="admin-portal">
        {/* Top Navigation Bar */}
        <header className="admin-topbar">
          <div className="logo-container">
            <button 
              className="sidebar-toggle" 
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
            >
              <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <Link to="/admin" className="admin-logo">
              <span className="logo-icon"><i className="fas fa-building"></i></span>
              <span className="logo-text">Recruitment<span>Portal</span></span>
            </Link>
          </div>
          
          <div className="topbar-right">
            <div className="search-container">
              <input type="text" className="search-input" placeholder="Search..." />
              <button className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            <div className="topbar-actions">
              <button className="theme-toggle" title="Toggle dark mode">
                <i className="fas fa-moon"></i>
              </button>
              
              <div className="notifications-wrapper">
                <button 
                  className="notifications-toggle" 
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </button>
                
                {showNotifications && (
                  <div className="notifications-dropdown" ref={notificationsRef}>
                    <div className="dropdown-header">
                      <h6>Notifications</h6>
                      <button className="mark-all-read">Mark all as read</button>
                    </div>
                    <div className="notifications-list">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="notification-icon">
                            <i className="fas fa-user-circle"></i>
                          </div>
                          <div className="notification-content">
                            <p className="notification-text">{notification.text}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                          {!notification.read && <div className="unread-indicator"></div>}
                        </div>
                      ))}
                    </div>
                    <div className="dropdown-footer">
                      <Link to="/admin/notifications">View all notifications</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="user-menu-wrapper">
                <button 
                  className="user-menu-toggle" 
                  onClick={toggleUserMenu}
                  aria-label="User menu"
                >
                  {currentAdmin.avatar ? (
                    <img src={currentAdmin.avatar} alt="Profile" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {currentAdmin.name ? currentAdmin.name.charAt(0) : 'A'}
                    </div>
                  )}
                  <span className="user-name">{firstName}</span>
                  <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown" ref={userMenuRef}>
                    <div className="user-dropdown-header">
                      <div className="user-info">
                        {currentAdmin.avatar ? (
                          <img src={currentAdmin.avatar} alt="Profile" className="dropdown-avatar" />
                        ) : (
                          <div className="dropdown-avatar-placeholder">
                            {currentAdmin.name ? currentAdmin.name.charAt(0) : 'A'}
                          </div>
                        )}
                        <div>
                          <h6 className="user-name">{currentAdmin.name || 'Admin User'}</h6>
                          <p className="user-role">{currentAdmin.role || 'Administrator'}</p>
                          <p className="user-email">{currentAdmin.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="user-dropdown-body">
                      <Link to="/admin/profile" className="dropdown-item">
                        <i className="fas fa-user"></i> My Profile
                      </Link>
                      <Link to="/admin/settings" className="dropdown-item">
                        <i className="fas fa-cog"></i> Account Settings
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item">
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Overlay for Mobile */}
        <div 
          className={`page-overlay ${sidebarOpen ? 'visible' : ''}`} 
          onClick={toggleSidebar}
        ></div>
        
        {/* Sidebar */}
        <aside 
          ref={sidebarRef}
          className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
          aria-hidden={!sidebarOpen}
        >
          <div className="sidebar-header">
            <div className="welcome-section">
              <div className="greeting-text">
                <h3>Welcome back</h3>
                <h2>{firstName}!</h2>
              </div>
            </div>
          </div>
          
          <div className="sidebar-content">
            <div className="sidebar-menu-title">MAIN MENU</div>
            <nav className="admin-nav">
              <Link 
                to="/admin" 
                className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-tachometer-alt"></i> 
                <span>Dashboard</span>
                {isActive('/admin') && <span className="active-indicator"></span>}
              </Link>
              <Link 
                to="/admin/jobs" 
                className={`admin-nav-link ${location.pathname.includes('/admin/jobs') ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-briefcase"></i> 
                <span>Jobs</span>
                <span className="badge">12</span>
                {location.pathname.includes('/admin/jobs') && <span className="active-indicator"></span>}
              </Link>
              <Link 
                to="/admin/applicants" 
                className={`admin-nav-link ${location.pathname.includes('/admin/applicants') ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-users"></i> 
                <span>Applicants</span>
                <span className="badge badge-pulse">24</span>
                {location.pathname.includes('/admin/applicants') && <span className="active-indicator"></span>}
              </Link>
              <Link 
                to="/admin/assessments" 
                className={`admin-nav-link ${location.pathname.includes('/admin/assessments') ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-clipboard-check"></i> 
                <span>Assessments</span>
                {location.pathname.includes('/admin/assessments') && <span className="active-indicator"></span>}
              </Link>
              
              <div className="sidebar-menu-title">ADMINISTRATION</div>
              <Link 
                to="/admin/users" 
                className={`admin-nav-link ${location.pathname.includes('/admin/users') ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-user-shield"></i> 
                <span>Admin Users</span>
                {location.pathname.includes('/admin/users') && <span className="active-indicator"></span>}
              </Link>
              <Link 
                to="/admin/settings" 
                className={`admin-nav-link ${location.pathname.includes('/admin/settings') ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-cog"></i> 
                <span>Settings</span>
                {location.pathname.includes('/admin/settings') && <span className="active-indicator"></span>}
              </Link>
            </nav>
          </div>
          
          <div className="sidebar-footer">
            <div className="upgrade-banner">
              <div className="upgrade-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <div className="upgrade-content">
                <h4>Upgrade to Pro</h4>
                <p>Get advanced features and premium support</p>
                <a href="/pricing" className="upgrade-btn">Upgrade Now</a>
              </div>
            </div>
            
            <div className="system-status">
              <div className="status-item">
                <span>System Status</span>
                <span className="status online">Online</span>
              </div>
              <div className="status-item">
                <span>Version</span>
                <span>v2.0.4</span>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="admin-content">
          <div className="page-header scroll-fade">
            <div className="header-content">
              <h1 className="page-title">
                {location.pathname === '/admin' && 'Dashboard'}
                {location.pathname.includes('/admin/jobs') && 'Jobs Management'}
                {location.pathname.includes('/admin/applicants') && 'Applicants Management'}
                {location.pathname.includes('/admin/assessments') && 'Assessments Management'}
                {location.pathname.includes('/admin/users') && 'Admin Users Management'}
                {location.pathname.includes('/admin/settings') && 'Settings'}
              </h1>
              <p className="page-subtitle">
                {location.pathname === '/admin' && 'Overview of recruitment performance and activities'}
                {location.pathname.includes('/admin/jobs') && 'Manage and track all job postings'}
                {location.pathname.includes('/admin/applicants') && 'Review and manage job applications'}
                {location.pathname.includes('/admin/assessments') && 'Create and manage candidate assessments'}
                {location.pathname.includes('/admin/users') && 'Manage administrative user accounts'}
                {location.pathname.includes('/admin/settings') && 'Configure system settings and preferences'}
              </p>
            </div>
            <div className="header-actions">
              {location.pathname.includes('/admin/jobs') && (
                <button className="btn btn-primary">
                  <i className="fas fa-plus"></i> Post New Job
                </button>
              )}
              {location.pathname.includes('/admin/applicants') && (
                <button className="btn btn-primary">
                  <i className="fas fa-user-plus"></i> Add Applicant
                </button>
              )}
              {location.pathname.includes('/admin/assessments') && (
                <button className="btn btn-primary">
                  <i className="fas fa-plus"></i> Create Assessment
                </button>
              )}
              {location.pathname.includes('/admin/users') && (
                <button className="btn btn-primary">
                  <i className="fas fa-user-plus"></i> Add Admin User
                </button>
              )}
            </div>
          </div>

          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/jobs/*" element={<JobsManagement />} />
              <Route path="/applicants/*" element={<ApplicantsManagement />} />
              <Route path="/assessments/*" element={<AssessmentsManagement />} />
              <Route path="/users/*" element={<AdminUsersManagement />} />
              <Route path="/settings" element={<div className="coming-soon">Settings page coming soon</div>} />
              <Route path="/profile" element={<div className="coming-soon">Profile page coming soon</div>} />
              <Route path="/notifications" element={<div className="coming-soon">Notifications page coming soon</div>} />
            </Routes>
          </div>
          
          <footer className="admin-footer">
            <div className="footer-content">
              <div className="copyright">
                &copy; {new Date().getFullYear()} Recruitment Portal. All rights reserved.
              </div>
              <div className="footer-links">
                <a href="/help">Help</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </AdminContext.Provider>
  );
}

export default Admin;