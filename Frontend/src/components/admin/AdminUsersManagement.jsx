// src/components/admin/AdminUsersManagement.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AdminContext } from '../../pages/Admin'; // Import the context

function AdminUsersManagement() {
  const navigate = useNavigate();
  const { currentAdmin } = useContext(AdminContext); // Use the context
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  
  // Create a ref to track component mount state
  const isMounted = useRef(true);
  
  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    // Fetch admin users
    const fetchAdminUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin-users', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin users');
        }
        
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted.current) {
          setAdminUsers(data);
        }
      } catch (error) {
        console.error('Error fetching admin users:', error);
        
        // Only update state if component is still mounted
        if (isMounted.current) {
          setError('Failed to load admin users. Please try again.');
        }
      } finally {
        // Only update state if component is still mounted
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };
    
    fetchAdminUsers();
  }, [navigate]);
  
  const deleteAdminUser = async (userId) => {
    // Prevent deletion of own account
    if (userId === currentAdmin.id) {
      alert("You cannot delete your own account.");
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this admin user?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin-users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete admin user');
      }
      
      // Remove from local state - only if component is still mounted
      if (isMounted.current) {
        setAdminUsers(prevUsers => 
          prevUsers.filter(user => user.id !== userId)
        );
      }
    } catch (error) {
      console.error('Error deleting admin user:', error);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setError('Failed to delete admin user. Please try again.');
      }
    }
  };
  
  const handleAddNewAdmin = () => {
    navigate('/admin/users/new');
  };
  
  const handleEditAdmin = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };
  
  // Filter admin users based on search
  const filteredAdminUsers = adminUsers.filter(user => {
    return !search ? true : (
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });
  
  if (!currentAdmin) return <div className="loading">Checking permissions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div className="loading">Loading admin users...</div>;
  
  return (
    <div className="admin-users-management">
      <div className="management-header">
        <h2>Admin Users Management</h2>
        
        <div className="actions-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <button className="add-button" onClick={handleAddNewAdmin}>
            <i className="fas fa-plus-circle"></i> Add New Admin
          </button>
        </div>
      </div>
      
      <div className="admin-users-wrapper">
        {filteredAdminUsers.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-user-shield fa-2x"></i>
            <p>No admin users found. Create your first admin!</p>
          </div>
        ) : (
          <div className="admin-users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdminUsers.map(user => (
                  <tr key={user.id} className={user.id === currentAdmin.id ? 'current-user' : ''}>
                    <td>{user.id}</td>
                    <td>
                      {user.email}
                      {user.id === currentAdmin.id && <span className="current-user-label">(You)</span>}
                    </td>
                    <td>{new Date(user.created_at).toLocaleString()}</td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleEditAdmin(user.id)} 
                        className="edit-button"
                        title="Edit Admin"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      
                      <button 
                        onClick={() => deleteAdminUser(user.id)} 
                        className="delete-button"
                        disabled={user.id === currentAdmin.id}
                        title={user.id === currentAdmin.id ? "Cannot delete your own account" : "Delete Admin"}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <Routes>
        <Route path="new" element={<AdminUserForm />} />
        <Route path="edit/:userId" element={<AdminUserForm />} />
      </Routes>
    </div>
  );
}

function AdminUserForm() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(userId ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Create a ref to track component mount state
  const isMounted = useRef(true);
  
  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (userId && userId !== 'new') {
      // Fetch existing admin user data for editing
      fetchAdminUserData();
    }
  }, [userId]);
  
  const fetchAdminUserData = async () => {
    try {
      const response = await fetch(`/api/admin-users/${userId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin user data');
      }
      
      const userData = await response.json();
      
      // Only update state if component is still mounted
      if (!isMounted.current) return;
      
      // Don't include password in edit form
      setFormData({
        email: userData.email,
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error fetching admin user data:', error);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setError('Failed to load admin user data for editing');
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // When creating new admin or changing password, validate password fields
    if (!userId || (userId && formData.password)) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Prepare data for API - only include password if it was entered
      const adminPayload = {
        email: formData.email,
        ...(formData.password ? { password: formData.password } : {})
      };
      
      const url = userId && userId !== 'new' 
        ? `/api/admin-users/${userId}` 
        : '/api/admin-users';
        
      const method = userId && userId !== 'new' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminPayload),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${userId ? 'update' : 'create'} admin user`);
      }
      
      // Check if component is still mounted before navigating
      if (isMounted.current) {
        navigate('/admin/users');
      }
    } catch (error) {
      console.error('Error saving admin user:', error);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setError(error.message || `Failed to ${userId ? 'update' : 'create'} admin user. Please try again.`);
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setSubmitting(false);
      }
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/users');
  };
  
  if (loading) return <div className="loading">Loading admin user data...</div>;
  
  return (
    <div className="admin-user-form-container">
      <div className="form-header">
        <h2>{userId && userId !== 'new' ? 'Edit Admin User' : 'Create New Admin User'}</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-user-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email address"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {userId && userId !== 'new' ? 'New Password (leave blank to keep current)' : 'Password*'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!userId || userId === 'new'}
              placeholder={userId && userId !== 'new' ? "Enter new password (optional)" : "Enter password"}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">
              {userId && userId !== 'new' ? 'Confirm New Password' : 'Confirm Password*'}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required={!userId || userId === 'new' || formData.password.length > 0}
              placeholder="Confirm password"
            />
          </div>
          
          <div className="form-note">
            {userId && userId !== 'new' ? (
              <p>
                <i className="fas fa-info-circle"></i>
                Leave password fields blank to keep the current password.
              </p>
            ) : (
              <p>
                <i className="fas fa-info-circle"></i>
                Password must be at least 8 characters long.
              </p>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Saving...' : (userId && userId !== 'new' ? 'Update Admin' : 'Create Admin')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminUsersManagement;