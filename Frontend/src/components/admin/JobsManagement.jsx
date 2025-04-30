// src/components/admin/JobsManagement.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

function JobsManagement() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ type: "All", remote: "All" });
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/jobs', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      
      // Remove from local state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job. Please try again.');
    }
  };
  
  const handleAddNewJob = () => {
    navigate('/admin/jobs/new');
  };
  
  const handleEditJob = (jobId) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };
  
  const handleViewJob = (jobId) => {
    navigate(`/admin/jobs/${jobId}`);
  };

  // Filter jobs based on search and filter criteria
  const filteredJobs = jobs.filter(job => {
    // Search filter
    const matchesSearch = !search ? true : (
      job.job_name.toLowerCase().includes(search.toLowerCase()) ||
      job.company_name.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
    );
    
    // Type filter
    const matchesType = filter.type === "All" ? true : job.type === filter.type;
    
    // Remote filter
    const matchesRemote = filter.remote === "All" ? true : job.remote_type === filter.remote;
    
    return matchesSearch && matchesType && matchesRemote;
  });
  
  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="jobs-management">
      <div className="management-header">
        <h2>Jobs Management</h2>
        
        <div className="actions-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <button className="add-button" onClick={handleAddNewJob}>
            <i className="fas fa-plus-circle"></i> Add New Job
          </button>
        </div>
      </div>
      
      <div className="filter-options">
        <div className="filter-group">
          <label>Job Type:</label>
          <select 
            value={filter.type} 
            onChange={(e) => setFilter({...filter, type: e.target.value})}
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Remote Type:</label>
          <select 
            value={filter.remote} 
            onChange={(e) => setFilter({...filter, remote: e.target.value})}
          >
            <option value="All">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>
      
      <div className="jobs-wrapper">
        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-briefcase fa-2x"></i>
            <p>No jobs found. Create your first job posting!</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.job_name}</h3>
                <div className="job-meta">
                  <span className="company-name">{job.company_name}</span>
                  <span className="applicant-count">
                    <i className="fas fa-users"></i> {job.applicants_count} applicants
                  </span>
                </div>
              </div>
              
              <div className="job-details">
                <div className="job-info">
                  <span className="job-type">
                    <i className="fas fa-briefcase"></i> {job.type}
                  </span>
                  <span className="job-location">
                    <i className="fas fa-map-marker-alt"></i> {job.location || "No location specified"}
                  </span>
                  <span className="job-remote">
                    <i className="fas fa-building"></i> {job.remote_type}
                  </span>
                  <span className="job-salary">
                    <i className="fas fa-money-bill-wave"></i> {job.salary_range || "Not specified"}
                  </span>
                </div>
                
                <div className="job-description">
                  <p>{job.description?.substring(0, 150)}...</p>
                </div>
              </div>
              
              <div className="job-footer">
                <div className="created-date">
                  <i className="fas fa-calendar-alt"></i> Posted on {new Date(job.created_at).toLocaleDateString()}
                </div>
                
                <div className="job-actions">
                  <button onClick={() => handleViewJob(job.id)} className="view-button">
                    <i className="fas fa-eye"></i> View
                  </button>
                  <button onClick={() => handleEditJob(job.id)} className="edit-button">
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button onClick={() => deleteJob(job.id)} className="delete-button">
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Routes>
        <Route path="new" element={<JobForm />} />
        <Route path="edit/:jobId" element={<JobForm />} />
        <Route path=":jobId" element={<JobDetail />} />
      </Routes>
    </div>
  );
}



function JobForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(jobId ? true : false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    job_name: '',
    company_name: '',
    salary_range: '',
    type: 'Full-time',
    remote_type: 'Onsite',
    location: '',
    description: '',
    responsibilities: [''],
    qualifications: [''],
    offers: ['']
  });
  
  useEffect(() => {
    if (jobId && jobId !== 'new') {
      // Fetch existing job data for editing
      fetchJobData();
    }
  }, [jobId]);
  
  const fetchJobData = async () => {
    try {
      const response = await fetch(`/api/public/jobs/${jobId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch job data');
      }
      
      const jobData = await response.json();
      
      // Convert responsibilities, qualifications, and offers from API format to form format
      const responsibilities = jobData.responsibilities?.map(r => r.responsibility_text) || [''];
      const qualifications = jobData.qualifications?.map(q => q.qualification_text) || [''];
      const offers = jobData.offers?.map(o => o.offer_text) || [''];
      
      setFormData({
        ...jobData,
        responsibilities,
        qualifications,
        offers
      });
    } catch (error) {
      console.error('Error fetching job data:', error);
      setError('Failed to load job data for editing');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleArrayChange = (category, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[category]];
      newArray[index] = value;
      return {
        ...prev,
        [category]: newArray
      };
    });
  };
  
  const addArrayItem = (category) => {
    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], '']
    }));
  };
  
  const removeArrayItem = (category, index) => {
    setFormData(prev => {
      const newArray = [...prev[category]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [category]: newArray.length ? newArray : [''] // Keep at least one empty field
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for API
      const jobPayload = {
        ...formData,
        // Filter out empty array items
        responsibilities: formData.responsibilities.filter(r => r.trim()),
        qualifications: formData.qualifications.filter(q => q.trim()),
        offers: formData.offers.filter(o => o.trim())
      };
      
      const url = jobId && jobId !== 'new' 
        ? `/api/public/jobs/${jobId}`
        : '/api/jobs';
        
      const method = jobId && jobId !== 'new' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobPayload),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${jobId ? 'update' : 'create'} job posting`);
      }
      
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      setError(`Failed to ${jobId ? 'update' : 'create'} job posting. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/jobs');
  };
  
  if (loading && jobId) return <div className="loading">Loading job data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="job-form-container">
      <div className="form-header">
        <h2>{jobId && jobId !== 'new' ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="job_name">Job Title*</label>
            <input
              type="text"
              id="job_name"
              name="job_name"
              value={formData.job_name}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Software Developer"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g., Tech Innovations Inc."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="type">Job Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div className="form-group half">
              <label htmlFor="remote_type">Remote Type</label>
              <select
                id="remote_type"
                name="remote_type"
                value={formData.remote_type}
                onChange={handleChange}
              >
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="salary_range">Salary Range</label>
              <input
                type="text"
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., $60,000 - $80,000"
              />
            </div>
            
            <div className="form-group half">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Job Description</h3>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Provide a detailed description of the job..."
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Responsibilities</h3>
          
          {formData.responsibilities.map((responsibility, index) => (
            <div key={`resp-${index}`} className="array-field">
              <input
                type="text"
                value={responsibility}
                onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                placeholder="Enter a responsibility"
              />
              
              <div className="array-actions">
                {formData.responsibilities.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeArrayItem('responsibilities', index)}
                    className="remove-btn"
                  >
                    <i className="fas fa-minus-circle"></i>
                  </button>
                )}
                
                {index === formData.responsibilities.length - 1 && (
                  <button 
                    type="button" 
                    onClick={() => addArrayItem('responsibilities')}
                    className="add-btn"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="form-section">
          <h3>Qualifications</h3>
          
          {formData.qualifications.map((qualification, index) => (
            <div key={`qual-${index}`} className="array-field">
              <input
                type="text"
                value={qualification}
                onChange={(e) => handleArrayChange('qualifications', index, e.target.value)}
                placeholder="Enter a qualification"
              />
              
              <div className="array-actions">
                {formData.qualifications.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeArrayItem('qualifications', index)}
                    className="remove-btn"
                  >
                    <i className="fas fa-minus-circle"></i>
                  </button>
                )}
                
                {index === formData.qualifications.length - 1 && (
                  <button 
                    type="button" 
                    onClick={() => addArrayItem('qualifications')}
                    className="add-btn"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="form-section">
          <h3>Offers & Benefits</h3>
          
          {formData.offers.map((offer, index) => (
            <div key={`offer-${index}`} className="array-field">
              <input
                type="text"
                value={offer}
                onChange={(e) => handleArrayChange('offers', index, e.target.value)}
                placeholder="Enter an offer or benefit"
              />
              
              <div className="array-actions">
                {formData.offers.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeArrayItem('offers', index)}
                    className="remove-btn"
                  >
                    <i className="fas fa-minus-circle"></i>
                  </button>
                )}
                
                {index === formData.offers.length - 1 && (
                  <button 
                    type="button" 
                    onClick={() => addArrayItem('offers')}
                    className="add-btn"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : (jobId && jobId !== 'new' ? 'Update Job' : 'Create Job')}
          </button>
        </div>
      </form>
    </div>
  );
}

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [jobResponse, applicantsResponse] = await Promise.all([
          fetch(`/api/jobs/${jobId}`, { credentials: 'include' }),
          fetch(`/api/jobs/${jobId}/applicants`, { credentials: 'include' })
        ]);
        
        if (!jobResponse.ok || !applicantsResponse.ok) {
          throw new Error('Failed to fetch job data');
        }
        
        const [jobData, applicantsData] = await Promise.all([
          jobResponse.json(),
          applicantsResponse.json()
        ]);
        
        setJob(jobData);
        setApplicants(applicantsData);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [jobId]);
  
  const handleBack = () => {
    navigate('/admin/jobs');
  };
  
  const handleEdit = () => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };
  
  const handleViewApplicant = (applicantId) => {
    navigate(`/admin/applicants/${applicantId}`);
  };
  
  if (loading) return <div className="loading">Loading job details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!job) return <div className="not-found">Job not found</div>;
  
  return (
    <div className="job-detail-modal">
      <div className="detail-header">
        <button onClick={handleBack} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Jobs
        </button>
        <h2>Job Details</h2>
        <button onClick={handleEdit} className="edit-button">
          <i className="fas fa-edit"></i> Edit
        </button>
      </div>
      
      <div className="detail-content">
        <div className="job-detail-card">
          <div className="job-detail-header">
            <h3>{job.job_name}</h3>
            <div className="job-detail-meta">
              <span className="company-name">{job.company_name}</span>
              <div className="job-tags">
                <span className="job-type">{job.type}</span>
                <span className="job-remote">{job.remote_type}</span>
              </div>
            </div>
          </div>
          
          <div className="job-detail-info">
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{job.location || "No location specified"}</span>
            </div>
            
            <div className="info-item">
              <i className="fas fa-money-bill-wave"></i>
              <span>{job.salary_range || "Salary not specified"}</span>
            </div>
            
            <div className="info-item">
              <i className="fas fa-calendar-alt"></i>
              <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="info-item">
              <i className="fas fa-users"></i>
              <span>{job.applicants_count} applicants</span>
            </div>
          </div>
          
          <div className="job-detail-section">
            <h4>Description</h4>
            <p>{job.description || "No description provided"}</p>
          </div>
          
          <div className="job-detail-section">
            <h4>Responsibilities</h4>
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <ul className="detail-list">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp.responsibility_text}</li>
                ))}
              </ul>
            ) : (
              <p>No responsibilities listed</p>
            )}
          </div>
          
          <div className="job-detail-section">
            <h4>Qualifications</h4>
            {job.qualifications && job.qualifications.length > 0 ? (
              <ul className="detail-list">
                {job.qualifications.map((qual, index) => (
                  <li key={index}>{qual.qualification_text}</li>
                ))}
              </ul>
            ) : (
              <p>No qualifications listed</p>
            )}
          </div>
          
          <div className="job-detail-section">
            <h4>Offers & Benefits</h4>
            {job.offers && job.offers.length > 0 ? (
              <ul className="detail-list">
                {job.offers.map((offer, index) => (
                  <li key={index}>{offer.offer_text}</li>
                ))}
              </ul>
            ) : (
              <p>No offers or benefits listed</p>
            )}
          </div>
        </div>
        
        <div className="job-applicants-section">
          <h3>Applicants for this Job</h3>
          
          {applicants.length > 0 ? (
            <div className="applicants-list">
              {applicants.map((applicant) => (
                <div key={applicant.id} className="applicant-list-item">
                  <div className="applicant-info" onClick={() => handleViewApplicant(applicant.id)}>
                    <div className="applicant-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="applicant-details">
                      <h4>{applicant.full_name}</h4>
                      <p className="applicant-meta">{applicant.institution}</p>
                      <span className={`status-indicator ${applicant.status.toLowerCase()}`}>
                        {applicant.status}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleViewApplicant(applicant.id)}
                    className="view-applicant-button"
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-applicants">
              <i className="fas fa-user-slash fa-2x"></i>
              <p>No applicants yet for this job posting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobsManagement;