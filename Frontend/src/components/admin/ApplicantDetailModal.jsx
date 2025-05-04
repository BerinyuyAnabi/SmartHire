// src/components/admin/ApplicantDetailModal.js
import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../pages/Admin';

function ApplicantDetailModal({ applicantId, show, onClose }) {
  const { currentAdmin } = useContext(AdminContext);
  const [applicant, setApplicant] = useState(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (applicantId && show) {
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
          
          setApplicant(applicantData);
          setAssessmentAnswers(answersData);
        } catch (error) {
          console.error('Error fetching applicant details:', error);
          setError('Failed to load applicant details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchApplicantDetails();
    }
  }, [applicantId, show]);

  // Close modal when clicking outside (modal backdrop)
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };
  
  // If modal is not shown, don't render anything
  if (!show) return null;

  // If modal is loading or error, render with minimal content
  if (!currentAdmin) return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="custom-modal-body">
          <div className="loading">Checking permissions...</div>
        </div>
      </div>
    </div>
  );
  
  if (loading) return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="custom-modal-body">
          <div className="loading">Loading applicant details...</div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="custom-modal-body">
          <div className="error-message">{error}</div>
        </div>
      </div>
    </div>
  );
  
  if (!applicant) return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="custom-modal-body">
          <div className="not-found">Applicant not found</div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content applicant-detail-modal">
        <div className="custom-modal-header">
          <h2 className="modal-title">Applicant Profile</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <div className="custom-modal-body">
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
        </div>
        
        <div className="custom-modal-footer">
          <button onClick={onClose} className="cancel-button">
            <i className="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantDetailModal;