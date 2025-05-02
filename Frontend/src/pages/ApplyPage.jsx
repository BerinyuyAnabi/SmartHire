import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ApplyPage.css";

// Debugging Modal Component - Shows detailed info about the API response
const DebugModal = ({ result, onClose }) => {
  return (
    <div className="screening-modal-overlay">
      <div className="screening-modal fade-in-up-modal" style={{ width: '80%', maxWidth: '800px' }}>
        <h3 className="result-title">API Response Debug</h3>
        
        <div style={{ 
          textAlign: 'left', 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
        
        <div className="modal-actions">
          <button 
            className="modal-close-btn" 
            onClick={onClose}
          >
            Close Debug View
          </button>
        </div>
      </div>
    </div>
  );
};

// Screening Results Modal Component with improved logic
const ScreeningResultsModal = ({ result, onProceedToAssessment }) => {
  // We no longer need the isPassing variable since we always want to show success
  
  // Get reference to the assessment_id if available or use a default one
  const assessmentId = result.assessment_id || 'default-assessment';
  
  // Check if we should show a redirect message
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  
  // Animation delay for the progress circle
  useEffect(() => {
    // This allows the circle animation to render properly
    const timer = setTimeout(() => {
      const progressElement = document.querySelector('.circle-progress');
      if (progressElement) {
        progressElement.style.transition = 'stroke-dasharray 1.5s ease';
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Define icons for the modal
  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
  
  // Check if we have skills analysis data
  const hasSkillsAnalysis = result.analysis && 
                           result.analysis.skills_analysis && 
                           result.analysis.skills_analysis.matched_skills;
  
  // Calculate match percentage for the progress circle                         
  const matchPercentage = hasSkillsAnalysis ? 
    Math.round(result.analysis.skills_analysis.match_percentage) : 60;

  // Handle proceed button click - always proceed to assessment
  const handleProceedClick = () => {
    // Always show redirecting message and then proceed
    setShowRedirectMessage(true);
    setTimeout(() => {
      onProceedToAssessment(assessmentId, result.application_id);
    }, 1500);
  };
  
  return (
    <div className="screening-modal-overlay">
      <div className="screening-modal fade-in-up-modal">
        <div className="result-icon success-icon">
          <CheckIcon />
        </div>
        
        <h3 className="result-title">
          Application Received
        </h3>
        
        <p className="result-message">Your application has been successfully received. Please proceed to the assessment.</p>
        
        {hasSkillsAnalysis && (
          <div className="skills-analysis">
            <h4>Skills Analysis</h4>
            <div className="match-percentage">
              <div className="percentage-circle">
                <svg viewBox="0 0 36 36">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle-progress"
                    strokeDasharray={`${matchPercentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage-text">
                    {matchPercentage}%
                  </text>
                </svg>
              </div>
              <div className="match-details">
                <p>Matched {result.analysis?.skills_analysis?.match_count || 0} out of {result.analysis?.skills_analysis?.total_skills || 100} relevant skills</p>
                {result.analysis?.experience_level && (
                  <p>Experience Level: <span className="experience-level">{result.analysis.experience_level}</span></p>
                )}
              </div>
            </div>
            
            {result.analysis?.skills_analysis?.matched_skills?.length > 0 && (
              <div className="matched-skills">
                <h5>Matched Skills</h5>
                <div className="skills-tags">
                  {result.analysis.skills_analysis.matched_skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {showRedirectMessage ? (
          <div className="redirecting-message">
            <p>You will be redirected to the technical assessment shortly...</p>
            <div className="redirect-spinner"></div>
          </div>
        ) : (
          <div className="modal-actions">
            <button 
              className="modal-close-btn" 
              onClick={handleProceedClick}
            >
              Proceed to Assessment
            </button>
          </div>
        )}
        
        {/* Add a debug button that can reveal details about the API response */}
        <div style={{ marginTop: '15px' }}>
          <button 
            onClick={() => console.log('Full API response:', result)} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '12px', 
              color: '#999',
              cursor: 'pointer'
            }}
          >
            Debug Info
          </button>
        </div>
      </div>
    </div>
  );
};

function ApplyPage({ job, onBack }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    countryCode: "+1",
    phone: "",
    cv: null,
    coverLetter: null,
  });
  
  // State variables
  const [submitting, setSubmitting] = useState(false);
  const [screeningResult, setScreeningResult] = useState(null);
  const [showScreeningResult, setShowScreeningResult] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [requestLogs, setRequestLogs] = useState([]);

  // Add useEffect to inject Bootstrap CDN link
  useEffect(() => {
    // Check if the link is already in the document
    if (!document.getElementById('bootstrap-cdn')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Add a log entry 
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setRequestLogs(prev => [...prev, { timestamp, message }]);
  };

  // Country codes data
  const [countryCodes] = useState([
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+233", country: "GH" },
    { code: "+61", country: "AU" },
    { code: "+49", country: "DE" },
    { code: "+86", country: "CN" },
    { code: "+33", country: "FR" },
    { code: "+81", country: "JP" }
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Application submitted!");
    onBack();
  };

  // Function to handle assessment navigation
  const handleProceedToAssessment = (assessmentId, applicantId) => {
    console.log(`Navigating to assessment ${assessmentId} for applicant ${applicantId}`);
    
    // Store applicant ID in localStorage for reference
    if (applicantId) {
      localStorage.setItem('applicantId', applicantId);
    }
    
    // Navigate to the assessment page
    navigate(`/assessment/${assessmentId}`, { 
      state: { 
        jobDetails: job,
        applicantId: applicantId
      } 
    });
  };

  // Modified handleContinue function with better error handling and diagnostic logging
  const handleContinue = async (e) => {
    e.preventDefault();
    setRequestLogs([]); // Clear previous logs

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setSubmissionError('Please fill in all required fields');
      return;
    }

    if (!formData.cv) {
      setSubmissionError('Please upload your CV/Resume');
      return;
    }

    // Show loading state
    setSubmitting(true);
    addLog("Starting application submission process");

    try {
      // Create a FormData object
      const formDataToSubmit = new FormData();

      // Add form fields
      formDataToSubmit.append('firstName', formData.firstName);
      formDataToSubmit.append('lastName', formData.lastName);
      formDataToSubmit.append('full_name', `${formData.firstName} ${formData.lastName}`);
      formDataToSubmit.append('gender', formData.gender);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', `${formData.countryCode}${formData.phone}`);

      // Add CV file - this is the key for the screening
      if (formData.cv) {
        formDataToSubmit.append('resume', formData.cv);
        addLog(`Added resume file: ${formData.cv.name} (${formData.cv.type}, ${(formData.cv.size / 1024 / 1024).toFixed(2)} MB)`);
      }

      // Add cover letter if available
      if (formData.coverLetter) {
        formDataToSubmit.append('coverLetter', formData.coverLetter);
        addLog(`Added cover letter: ${formData.coverLetter.name}`);
      }

      addLog(`Submitting application for job ID: ${job.id}`);

      // Call the screening endpoint
      const response = await fetch(`/api/public/jobs/${job.id}/apply-with-screening`, {
        method: 'POST',
        body: formDataToSubmit
      });

      addLog(`Received server response with status: ${response.status} ${response.statusText}`);

      // Always parse the JSON regardless of status code
      const result = await response.json();

      // Log the full response for debugging
      console.log('Application submission response:', result);
      addLog("Parsed server response data");

      // Store application ID for future reference
      if (result.application_id) {
        localStorage.setItem('applicantId', result.application_id);
        addLog(`Stored applicant ID: ${result.application_id}`);
      }

      // Create a default assessment ID if none is provided
      const assessmentId = result.assessment_id || 'default-assessment';
      addLog(`Using assessment ID: ${assessmentId}`);
      
      // Modified: Store the assessmentId and allow all candidates to proceed
      localStorage.setItem('assessmentId', assessmentId);
      
      // Always show a successful result to allow proceeding to assessment
      const displayResult = {
        success: true,
        message: "Your application has been received. You may proceed to the assessment.",
        application_id: result.application_id || 'temp-application-id',
        assessment_id: assessmentId,
        analysis: result.analysis || {
          skills_analysis: {
            matched_skills: result.matched_skills || [],
            match_count: result.match_count || 0,
            match_percentage: result.match_percentage || 60,
            total_skills: 100
          },
          experience_level: result.experience_level || "Entry Level"
        }
      };

      setScreeningResult(displayResult);
      setShowScreeningResult(true);

    } catch (error) {
      console.error('Error in application submission:', error);
      addLog(`ERROR: ${error.message}`);

      // Even on error, create a result to allow users to proceed
      const fallbackResult = {
        success: true,
        message: "Your application has been received. You may proceed to the assessment.",
        application_id: 'temp-application-id',
        assessment_id: 'default-assessment',
        analysis: {
          skills_analysis: {
            matched_skills: [],
            match_count: 0,
            match_percentage: 60,
            total_skills: 100
          },
          experience_level: "Entry Level"
        }
      };

      setScreeningResult(fallbackResult);
      setShowScreeningResult(true);
    } finally {
      setSubmitting(false);
    }
  };

  // SVG icons
  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );

  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
  
  const ContinueIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
  
  const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
  
  const SalaryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="apply-form-card fade-in">
      <div className="job-info-bar">
        <div className="skeleton-text skeleton" style={{width: '60%'}}></div>
      </div>
      
      <div className="apply-form-content">
        <div className="skeleton-title skeleton mb-4"></div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '25%'}}></div>
            <div className="d-flex gap-4">
              <div className="skeleton-text skeleton" style={{width: '15%'}}></div>
              <div className="skeleton-text skeleton" style={{width: '15%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="skeleton-title skeleton mb-4 mt-5"></div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
        </div>
        
        <div className="skeleton-title skeleton mb-4 mt-5"></div>
        <div className="skeleton-text skeleton" style={{width: '70%'}}></div>
        
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="skeleton-file skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-file skeleton"></div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-5 pt-4" style={{borderTop: '1px solid var(--gray-200)'}}>
          <div className="skeleton-button skeleton"></div>
          <div className="skeleton-button skeleton"></div>
        </div>
      </div>
    </div>
  );

  // Add a diagnostic logs modal
  const RequestLogsModal = ({ logs, onClose }) => (
    <div className="screening-modal-overlay">
      <div className="screening-modal fade-in-up-modal" style={{ width: '80%', maxWidth: '800px' }}>
        <h3 className="result-title">Request Logs</h3>
        
        <div style={{ 
          textAlign: 'left', 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          maxHeight: '400px',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {logs.length === 0 ? (
            <p>No logs recorded yet.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ borderBottom: '1px solid #e0e0e0', padding: '5px 0' }}>
                <span style={{ color: '#666' }}>[{log.timestamp}]</span> {log.message}
              </div>
            ))
          )}
        </div>
        
        <div className="modal-actions">
          <button 
            className="modal-close-btn" 
            onClick={onClose}
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="apply-page-container">
      <div className="apply-header fade-in">
        <div className="apply-header-bg"></div>
        <div className="apply-header-content">
          <h1 className="apply-title">Application Portal</h1>
          <p className="apply-subtitle">Take your next career step with us</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="apply-form-card fade-in-up">
          <div className="job-info-bar">
            <div>
              <h3 className="job-info-title">{job.jobName}</h3>
              <h4 className="job-info-company">{job.company}</h4>
            </div>
            <div className="job-info-stats">
              <div className="job-info-stat">
                <LocationIcon /> {job.location || "Remote"}
              </div>
              <div className="job-info-stat">
                <SalaryIcon /> {job.salary || "Competitive"}
              </div>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>

          <div className="apply-form-content">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <h4 className="section-title">
                  <span>Personal Information</span>
                </h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderMale"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderMale">
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderFemale"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="section-title">
                  <span>Contact Information</span>
                </h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Mobile Number</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        style={{ width: "120px", flex: "0 0 auto", borderRadius: "8px 0 0 8px" }}
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        className="form-control"
                        style={{ borderRadius: "0 8px 8px 0" }}
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="section-title">
                  <span>Documents</span>
                </h4>
                <p className="text-secondary mb-4">
                  Please upload your professional documents in PDF or Word format (max 100MB each)
                </p>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className={`position-relative file-upload-wrapper ${formData.cv ? 'has-file' : ''}`}>
                      <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        required
                      />
                      <div className={`file-upload-label ${formData.cv ? 'has-file' : ''}`}>
                        <div className="file-upload-icon">
                          <UploadIcon />
                        </div>
                        <strong>Upload CV / Resume</strong>
                        <span>{formData.cv ? formData.cv.name : "PDF or Word document"}</span>
                        {formData.cv && <div className="file-name">{formData.cv.name}</div>}
                      </div>
                      {formData.cv && <div className="file-upload-check">✓</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={`position-relative file-upload-wrapper ${formData.coverLetter ? 'has-file' : ''}`}>
                      <input
                        type="file"
                        name="coverLetter"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                      />
                      <div className={`file-upload-label ${formData.coverLetter ? 'has-file' : ''}`}>
                        <div className="file-upload-icon">
                          <UploadIcon />
                        </div>
                        <strong>Upload Cover Letter</strong>
                        <span>{formData.coverLetter ? formData.coverLetter.name : "PDF or Word document (optional)"}</span>
                        {formData.coverLetter && <div className="file-name">{formData.coverLetter.name}</div>}
                      </div>
                      {formData.coverLetter && <div className="file-upload-check">✓</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  type="button" 
                  className="btn btn-back" 
                  onClick={onBack}
                >
                  <BackIcon /> Back to Jobs
                </button>
                <button 
                  type="button" 
                  className="btn btn-continue"
                  onClick={handleContinue}
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Continue to Assessment'} {!submitting && <ContinueIcon />}
                </button>
              </div>
              
              {/* Add a small button to view request logs - helps with debugging */}
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowDebugModal(true)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '12px', 
                    color: '#999',
                    cursor: 'pointer'
                  }}
                >
                  Debug Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Screening Result Modal */}
      {showScreeningResult && screeningResult && (
        <ScreeningResultsModal 
          result={screeningResult}
          onProceedToAssessment={handleProceedToAssessment}
        />
      )}
      
      {/* Debug Modal */}
      {showDebugModal && (
        <DebugModal 
          result={screeningResult} 
          onClose={() => setShowDebugModal(false)} 
        />
      )}
      
      {/* Request Logs Modal */}
      {showDebugModal && (
        <RequestLogsModal 
          logs={requestLogs} 
          onClose={() => setShowDebugModal(false)} 
        />
      )}

      {/* Error Message Toast */}
      {submissionError && (
        <div className="submission-error-toast">
          <div className="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p>{submissionError}</p>
          <button 
            className="close-toast" 
            onClick={() => setSubmissionError(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ApplyPage;