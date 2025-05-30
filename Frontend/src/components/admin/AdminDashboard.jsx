// src/components/admin/AdminDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    totalAssessments: 0,
    recentJobs: [],
    recentApplicants: [],
    applicationsByStatus: {
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Rejected: 0
    },
    topJobs: []
  });
  
  // Create a ref to track component mount state
  const isMounted = useRef(true);
  
  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      isMounted.current = false;
      
      // Additional cleanup to prevent DOM issues
      document.body.classList.remove('modal-open');
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach(backdrop => {
        backdrop.remove();
      });
      
      // Ensure any potential floating elements are removed
      const tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach(tooltip => {
        tooltip.remove();
      });
      
      // Remove any other potentially problematic elements
      const popovers = document.querySelectorAll('.popover');
      popovers.forEach(popover => {
        popover.remove();
      });
    };
  }, []);
  
  // Fetch dashboard data only once on mount
  useEffect(() => {
    let isComponentMounted = true;
    
    const fetchDashboardData = async () => {
      if (!isComponentMounted) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isComponentMounted && isMounted.current) {
          setDashboardData(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Only update state if component is still mounted
        if (isComponentMounted && isMounted.current) {
          setError('Failed to load dashboard information');
          setLoading(false);
        }
      }
    };
    
    fetchDashboardData();
    
    // Cleanup function
    return () => {
      isComponentMounted = false;
    };
  }, []);
  
  // Safer navigation handlers - prevent navigation if component is unmounting
  const handleNavigateToJobs = () => {
    if (isMounted.current) {
      navigate('/admin/jobs');
    }
  };
  
  const handleNavigateToApplicants = () => {
    if (isMounted.current) {
      navigate('/admin/applicants');
    }
  };
  
  const handleNavigateToAssessments = () => {
    if (isMounted.current) {
      navigate('/admin/assessments');
    }
  };
  
  const handleViewJob = (jobId) => {
    if (isMounted.current) {
      navigate(`/admin/jobs/${jobId}`);
    }
  };
  
  const handleViewApplicant = (applicantId) => {
    if (isMounted.current) {
      navigate(`/admin/applicants/${applicantId}`);
    }
  };
  
  // Content rendering with additional error handling
  const renderDashboardContent = () => {
    try {
      if (loading) return (
        <div className="loading">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Loading dashboard data...</span>
        </div>
      );
      
      if (error) return (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      );
      
      // Safely check if dashboardData exists before rendering
      if (!dashboardData) {
        return (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Dashboard data is not available</span>
          </div>
        );
      }
      
      return (
        <>
          <h2>Dashboard Overview</h2>
          
          <div className="stats-cards">
            <div className="stat-card" onClick={handleNavigateToJobs}>
              <div className="stat-icon jobs">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{dashboardData.totalJobs}</h3>
                <p className="stat-label">Total Jobs</p>
              </div>
              <div className="stat-action">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            
            <div className="stat-card" onClick={handleNavigateToApplicants}>
              <div className="stat-icon applicants">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{dashboardData.totalApplicants}</h3>
                <p className="stat-label">Total Applicants</p>
              </div>
              <div className="stat-action">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
            
            <div className="stat-card" onClick={handleNavigateToAssessments}>
              <div className="stat-icon assessments">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{dashboardData.totalAssessments}</h3>
                <p className="stat-label">Total Assessments</p>
              </div>
              <div className="stat-action">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card applications-status">
              <div className="card-header">
                <h3>Applications by Status</h3>
              </div>
              <div className="status-chart">
                <div className="status-bars">
                  {Object.entries(dashboardData.applicationsByStatus || {}).map(([status, count]) => (
                    <div className="status-bar-container" key={status}>
                      <div className="status-label">{status}</div>
                      <div className="status-bar-wrapper">
                        <div 
                          className={`status-bar ${status.toLowerCase()}`}
                          style={{ 
                            width: `${Math.min(100, ((count || 0) / (dashboardData.totalApplicants || 1)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="status-count">{count || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="dashboard-card top-jobs">
              <div className="card-header">
                <h3>Top Jobs by Applications</h3>
                <button 
                  className="view-all-btn" 
                  onClick={handleNavigateToJobs}
                >
                  View All <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              {!dashboardData.topJobs || dashboardData.topJobs.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-briefcase"></i>
                  <p>No job applications yet</p>
                </div>
              ) : (
                <div className="top-jobs-list">
                  {dashboardData.topJobs.map((job) => (
                    <div key={job.id} className="top-job-item" onClick={() => handleViewJob(job.id)}>
                      <div className="job-info">
                        <h4>{job.job_name}</h4>
                        <p className="company">{job.company_name}</p>
                      </div>
                      <div className="applicant-count">
                        <div className="count-badge">{job.applicants_count}</div>
                        <p>Applicants</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card recent-jobs">
              <div className="card-header">
                <h3>Recent Job Postings</h3>
                <button 
                  className="view-all-btn" 
                  onClick={handleNavigateToJobs}
                >
                  View All <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              {!dashboardData.recentJobs || dashboardData.recentJobs.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-file-alt"></i>
                  <p>No recent job postings</p>
                </div>
              ) : (
                <div className="recent-jobs-list">
                  {dashboardData.recentJobs.map((job) => (
                    <div key={job.id} className="recent-item" onClick={() => handleViewJob(job.id)}>
                      <div className="item-icon">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <div className="item-details">
                        <h4>{job.job_name}</h4>
                        <div className="item-meta">
                          <span className="company"><i className="fas fa-building"></i> {job.company_name}</span>
                          <span className="date">
                            <i className="fas fa-calendar-alt"></i> Posted: {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="dashboard-card recent-applicants">
              <div className="card-header">
                <h3>Recent Applicants</h3>
                <button 
                  className="view-all-btn" 
                  onClick={handleNavigateToApplicants}
                >
                  View All <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              {!dashboardData.recentApplicants || dashboardData.recentApplicants.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-user-friends"></i>
                  <p>No recent applicants</p>
                </div>
              ) : (
                <div className="recent-applicants-list">
                  {dashboardData.recentApplicants.map((applicant) => (
                    <div key={applicant.id} className="recent-item" onClick={() => handleViewApplicant(applicant.id)}>
                      <div className="item-icon">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div className="item-details">
                        <h4>{applicant.full_name}</h4>
                        <div className="item-meta">
                          <span className="institution"><i className="fas fa-university"></i> {applicant.institution}</span>
                          <span className={`status status-${applicant.status.toLowerCase()}`}><i className="fas fa-tag"></i> {applicant.status}</span>
                        </div>
                      </div>
                      <div className="applicant-date">
                        <i className="fas fa-clock"></i>
                        {new Date(applicant.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button 
                className="action-button" 
                onClick={() => navigate('/admin/jobs/new')}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add New Job</span>
              </button>
              
              <button 
                className="action-button" 
                onClick={() => navigate('/admin/assessments/new')}
              >
                <i className="fas fa-tasks"></i>
                <span>Create Assessment</span>
              </button>
              
              <button 
                className="action-button" 
                onClick={() => navigate('/admin/applicants', { state: { filter: 'Interview' } })}
              >
                <i className="fas fa-calendar-check"></i>
                <span>View Interviews</span>
              </button>
              
              <button 
                className="action-button" 
                onClick={() => navigate('/admin/applicants', { state: { filter: 'Shortlisted' } })}
              >
                <i className="fas fa-star"></i>
                <span>View Shortlisted</span>
              </button>
            </div>
          </div>
        </>
      );
    } catch (err) {
      console.error('Error rendering dashboard:', err);
      return (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Error rendering dashboard: {err.message}</span>
        </div>
      );
    }
  };
  
  // Render with error boundary wrapper
  return (
    <div className="admin-dashboard">
      {renderDashboardContent()}
    </div>
  );
}

export default AdminDashboard;