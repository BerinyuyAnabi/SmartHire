// src/components/admin/ApplicantsManagement.js
import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../pages/Admin';
import SimpleModal from '../common/SimpleModal';

function ApplicantsManagement() {
  const { currentAdmin } = useContext(AdminContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Create a ref to track component mount state
  const isMounted = React.useRef(true);
  
  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    fetchApplicants();
  }, []);
  
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/applicants', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applicants');
      }
      
      const data = await response.json();
      // Only update state if component is still mounted
      if (isMounted.current) {
        setApplicants(data);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      // Only update state if component is still mounted
      if (isMounted.current) {
        setError('Failed to load applicants. Please try again.');
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };
  
  const updateApplicantStatus = async (applicantId, newStatus) => {
    try {
      const response = await fetch(`/api/applicants/${applicantId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update applicant status');
      }
      
      // Update local state - only if component is still mounted
      if (isMounted.current) {
        setApplicants(prevApplicants => 
          prevApplicants.map(app => 
            app.id === applicantId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      console.error('Error updating applicant status:', error);
      if (isMounted.current) {
        setError('Failed to update status. Please try again.');
      }
    }
  };
  
  const deleteApplicant = async (applicantId) => {
    if (!window.confirm('Are you sure you want to delete this applicant?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/applicants/${applicantId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete applicant');
      }
      
      // Remove from local state - only if component is still mounted
      if (isMounted.current) {
        setApplicants(prevApplicants => 
          prevApplicants.filter(app => app.id !== applicantId)
        );
      }
    } catch (error) {
      console.error('Error deleting applicant:', error);
      if (isMounted.current) {
        setError('Failed to delete applicant. Please try again.');
      }
    }
  };
  
  const filteredApplicants = applicants
    .filter(app => filter === "All" ? true : app.status === filter)
    .filter(app => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        app.full_name.toLowerCase().includes(searchLower) ||
        app.institution.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower) ||
        app.keywords.toLowerCase().includes(searchLower)
      );
    });
  
  const handleApplicantClick = (applicantId) => {
    setSelectedApplicantId(applicantId);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    // First hide the modal UI
    setShowDetailModal(false);
    
    // Then clear the selected ID after a short delay to ensure smooth animation
    setTimeout(() => {
      if (isMounted.current) {
        setSelectedApplicantId(null);
      }
    }, 300);
  };
  
  if (!currentAdmin) return <div className="loading">Checking permissions...</div>;
  if (loading) return <div className="loading">Loading applicants...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="applicants-management">
      <div className="management-header">
        <h2>Applicants Management</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search applicants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>
      
      <div className="applicant-navbar">
        <button 
          className={`app-btn ${filter === "All" ? 'active' : ''}`} 
          onClick={() => setFilter("All")}
        >
          <i className="fas fa-users me-2"></i>All
        </button>
        <button 
          className={`app-btn ${filter === "Applied" ? 'active' : ''}`} 
          onClick={() => setFilter("Applied")}
        >
          <i className="fas fa-file-alt me-2"></i>Applied
        </button>
        <button 
          className={`app-btn ${filter === "Shortlisted" ? 'active' : ''}`} 
          onClick={() => setFilter("Shortlisted")}
        >
          <i className="fas fa-star me-2"></i>Shortlisted
        </button>
        <button 
          className={`app-btn ${filter === "Interview" ? 'active' : ''}`} 
          onClick={() => setFilter("Interview")}
        >
          <i className="fas fa-calendar-check me-2"></i>Interviews
        </button>
        <button 
          className={`app-btn ${filter === "Rejected" ? 'active' : ''}`} 
          onClick={() => setFilter("Rejected")}
        >
          <i className="fas fa-times-circle me-2"></i>Rejected
        </button>
      </div>
      
      <div className="applicants-wrapper">
        {filteredApplicants.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search fa-2x"></i>
            <p>No applicants found for this filter</p>
          </div>
        ) : (
          filteredApplicants.map(applicant => (
            <div
              key={applicant.id}
              className="applicant-card"
            >
              <div className="applicant-header" onClick={() => handleApplicantClick(applicant.id)}>
                <div className="applicant-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                
                <div className="applicant-details">
                  <h3 className="applicant-name">{applicant.full_name}</h3>
                  <p className="institution">{applicant.institution}</p>
                  
                  <div className="credentials">
                    <p className="experience">
                      <i className="fas fa-briefcase me-1"></i> Experience: {applicant.experience}
                    </p>
                    <p className="qualifications">
                      <i className="fas fa-certificate me-1"></i> {applicant.qualifications_summary}
                    </p>
                    <p className="location">
                      <i className="fas fa-map-marker-alt me-1"></i> {applicant.location}
                    </p>
                  </div>
                  
                  <p className="keywords">
                    <span>Keywords:</span> {applicant.keywords}
                  </p>
                </div>
                
                <div className="applicant-status">
                  <span className={`status-badge ${applicant.status.toLowerCase()}`}>
                    {applicant.status}
                  </span>
                </div>
              </div>
              
              <div className="social-links">
                {applicant.social_links && applicant.social_links.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                  >
                    <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
                    {link.platform}
                  </a>
                ))}
              </div>
              
              <div className="action-buttons">
                <div className="status-actions">
                  <button 
                    onClick={() => updateApplicantStatus(applicant.id, "Shortlisted")}
                    className={`status-btn shortlist ${applicant.status === "Shortlisted" ? 'active' : ''}`}
                    disabled={applicant.status === "Shortlisted"}
                  >
                    <i className="fas fa-star me-1"></i>
                    Shortlist
                  </button>
                  
                  <button 
                    onClick={() => updateApplicantStatus(applicant.id, "Interview")}
                    className={`status-btn interview ${applicant.status === "Interview" ? 'active' : ''}`}
                    disabled={applicant.status === "Interview"}
                  >
                    <i className="fas fa-calendar-check me-1"></i>
                    Interview
                  </button>
                  
                  <button 
                    onClick={() => updateApplicantStatus(applicant.id, "Rejected")}
                    className={`status-btn reject ${applicant.status === "Rejected" ? 'active' : ''}`}
                    disabled={applicant.status === "Rejected"}
                  >
                    <i className="fas fa-times-circle me-1"></i>
                    Reject
                  </button>
                </div>
                
                <div className="management-actions">
                  <button onClick={() => handleApplicantClick(applicant.id)} className="view-btn">
                    <i className="fas fa-eye me-1"></i>
                    View Details
                  </button>
                  
                  <button onClick={() => deleteApplicant(applicant.id)} className="delete-btn">
                    <i className="fas fa-trash me-1"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Updated SimpleModal implementation */}
      <SimpleModal 
        isOpen={showDetailModal} 
        onClose={closeDetailModal}
      >
        <div className="applicant-detail-modal">
          <div className="custom-modal-header">
            <h2 className="modal-title">Applicant Profile</h2>
            <button onClick={closeDetailModal} className="btn-close">×</button>
          </div>
          
          <div className="custom-modal-body">
            {selectedApplicantId && (
              <ApplicantDetail 
                applicantId={selectedApplicantId} 
                onClose={closeDetailModal} 
              />
            )}
          </div>
          
          <div className="custom-modal-footer">
            <button onClick={closeDetailModal} className="cancel-button">
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}

// Applicant Detail component as internal component instead of separate file
function ApplicantDetail({ applicantId, onClose }) {
  const { currentAdmin } = useContext(AdminContext);
  const [applicant, setApplicant] = useState(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Create a ref to track component mount state
  const isMounted = React.useRef(true);
  
  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const [applicantResponse, answersResponse] = await Promise.all([
          fetch(`/api/applicants/${applicantId}`, { credentials: 'include' }),
          fetch(`/api/applicants/${applicantId}/assessment-answers`, { credentials: 'include' })
        ]);
        
        if (!applicantResponse.ok || !answersResponse.ok) {
          throw new Error('Failed to fetch applicant data');
        }
        
        const [applicantData, answersData] = await Promise.all([
          applicantResponse.json(),
          answersResponse.json()
        ]);
        
        // Only update state if component is still mounted
        if (isMounted.current) {
          setApplicant(applicantData);
          setAssessmentAnswers(answersData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching applicant details:', error);
        // Only update state if component is still mounted
        if (isMounted.current) {
          setError('Failed to load applicant details');
          setLoading(false);
        }
      }
    };
    
    fetchApplicantDetails();
  }, [applicantId]);
  
  if (!currentAdmin) return <div className="loading">Checking permissions...</div>;
  if (loading) return <div className="loading">Loading applicant details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!applicant) return <div className="not-found">Applicant not found</div>;
  
  return (
    <div className="detail-content">
      <div className="applicant-profile">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user-circle fa-4x"></i>
          </div>
          <div className="profile-info">
            <h3>{applicant.full_name}</h3>
            <p className="institution">{applicant.institution}</p>
            <p className="location"><i className="fas fa-map-marker-alt"></i> {applicant.location}</p>
            <div className="status-badge-large">{applicant.status}</div>
          </div>
        </div>
        
        <div className="profile-section">
          <h4>About</h4>
          <p>{applicant.about || "No information provided"}</p>
        </div>
        
        <div className="profile-section">
          <h4>Experience</h4>
          <p>{applicant.experience || "No information provided"}</p>
        </div>
        
        <div className="profile-section">
          <h4>Qualifications</h4>
          <p>{applicant.qualifications_summary || "No information provided"}</p>
        </div>
        
        <div className="profile-section">
          <h4>Tools & Skills</h4>
          <p>{applicant.tools || "No information provided"}</p>
        </div>
        
        <div className="profile-section">
          <h4>Testimonials</h4>
          <p>{applicant.testimonials || "No testimonials provided"}</p>
        </div>
        
        <div className="profile-section">
          <h4>Social Links</h4>
          {applicant.social_links && applicant.social_links.length > 0 ? (
            <div className="social-links-grid">
              {applicant.social_links.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link-card"
                >
                  <i className={`fab fa-${link.platform.toLowerCase()} fa-2x`}></i>
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          ) : (
            <p>No social links provided</p>
          )}
        </div>
      </div>
      
      <div className="assessment-results">
        <h3>Assessment Results</h3>
        
        {assessmentAnswers.length > 0 ? (
          <div className="assessment-list">
            {assessmentAnswers.map((answer, index) => (
              <div 
                key={index} 
                className={`assessment-item ${answer.is_correct ? 'correct' : 'incorrect'}`}
              >
                <h4>{answer.assessment.question_text}</h4>
                <div className="question-type">
                  Type: {answer.assessment.question_type}
                </div>
                
                {answer.assessment.question_type === 'multiple-choice' ? (
                  <div className="options-list">
                    {JSON.parse(answer.assessment.options).map((option, i) => (
                      <div 
                        key={i} 
                        className={`option ${
                          JSON.parse(answer.assessment.correct_answer).includes(option) ? 'correct-option' : ''
                        } ${answer.answer === option ? 'selected-option' : ''}`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="essay-answer">
                    <p><strong>Answer:</strong></p>
                    <p className="answer-text">{answer.answer}</p>
                  </div>
                )}
                
                <div className="answer-result">
                  {answer.is_correct ? (
                    <span className="correct-badge">
                      <i className="fas fa-check-circle"></i> Correct
                    </span>
                  ) : (
                    <span className="incorrect-badge">
                      <i className="fas fa-times-circle"></i> Incorrect
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-assessments">
            <i className="fas fa-clipboard-list fa-2x"></i>
            <p>No assessment results available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantsManagement;