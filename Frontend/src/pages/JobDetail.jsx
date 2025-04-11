import React, { useState, useEffect } from "react";
import "../css/JobDetail.css";
import { jobData } from "../data/jobposting";

function JobDetail({ job: initialJob, onBack, onApply }) {
  // Dynamically load Bootstrap and FontAwesome CSS from CDN if not already loaded
  useEffect(() => {
    if (!document.getElementById('bootstrap-cdn')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    
    // Load Font Awesome
    if (!document.getElementById('fontawesome-cdn')) {
      const faLink = document.createElement('link');
      faLink.id = 'fontawesome-cdn';
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(faLink);
    }
  }, []);

  const initialIndex = jobData.findIndex(
    (job) => job.jobName === initialJob?.jobName
  );
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const navigateJobPosting = (direction) => {
    let newIndex = currentIndex;
    if (direction === "prev" && currentIndex > 0) {
      newIndex--;
    } else if (direction === "next" && currentIndex < jobData.length - 1) {
      newIndex++;
    }
    setCurrentIndex(newIndex);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const job = jobData[currentIndex];

  return (
    <div className="job-detail-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {loading ? (
              <JobDetailSkeleton />
            ) : (
              <div className="job-detail-container fade-in">
                {/* Header */}
                <div className="job-detail-header">
                  <button onClick={onBack} className="back-button">
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  
                  <h1 className="job-detail-title">{job.jobName}</h1>
                  
                  <div className="job-detail-company">
                    <div className="job-detail-company-logo">
                      <img src="static/images/qualifications.png" alt="" width="20" height="20" />
                    </div>
                    {job.company}
                  </div>
                  
                  <div className="job-detail-info">
                    <div className="job-detail-info-item">
                      <i className="fas fa-users job-detail-info-icon"></i>
                      {job.applicants} applicants
                    </div>
                    <div className="job-detail-info-item">
                      <i className="fas fa-dollar-sign job-detail-info-icon"></i>
                      {job.salary}
                    </div>
                    <div className="job-detail-info-item">
                      <i className="fas fa-briefcase job-detail-info-icon"></i>
                      {job.type}
                    </div>
                    <div className="job-detail-info-item">
                      <i className="fas fa-home job-detail-info-icon"></i>
                      {job.remote}
                    </div>
                    <div className="job-detail-info-item">
                      <i className="fas fa-map-marker-alt job-detail-info-icon"></i>
                      {job.location}
                    </div>
                  </div>
                  
                  <div className="job-detail-actions">
                    <button onClick={onApply} className="job-detail-apply-button">
                      <i className="fas fa-paper-plane"></i> Apply Now
                    </button>
                    <button onClick={toggleBookmark} className="job-detail-save-button">
                      <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
                      {isBookmarked ? ' Saved' : ' Save'}
                    </button>
                  </div>
                  
                  <div className="job-detail-navigation">
                    <button 
                      className={`nav-button ${currentIndex === 0 ? 'disabled' : ''}`}
                      onClick={() => currentIndex > 0 && navigateJobPosting("prev")}
                      disabled={currentIndex === 0}
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </button>
                    <span className="job-position-indicator">{currentIndex + 1} / {jobData.length}</span>
                    <button 
                      className={`nav-button ${currentIndex === jobData.length - 1 ? 'disabled' : ''}`}
                      onClick={() => currentIndex < jobData.length - 1 && navigateJobPosting("next")}
                      disabled={currentIndex === jobData.length - 1}
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="job-detail-content">
                  {/* Job Description */}
                  <div className="job-detail-section">
                    <h2 className="job-detail-section-title">
                      <i className="fas fa-file-alt job-detail-section-icon"></i> Job Description
                    </h2>
                    <div className="job-detail-description">
                      {job.description || "No description available."}
                    </div>
                    
                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="job-tags mt-4">
                        {job.tags.map((tag, index) => (
                          <span key={index} className="job-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Responsibilities */}
                  <div className="job-detail-section">
                    <h2 className="job-detail-section-title">
                      <i className="fas fa-tasks job-detail-section-icon"></i> Responsibilities
                    </h2>
                    <ul className="job-detail-requirements-list">
                      {job.responsibilities?.map((item, index) => (
                        <li key={index} className="job-detail-list-item">{item}</li>
                      )) || <li className="job-detail-list-item">No responsibilities listed.</li>}
                    </ul>
                  </div>
                  
                  {/* Qualifications */}
                  <div className="job-detail-section">
                    <h2 className="job-detail-section-title">
                      <i className="fas fa-graduation-cap job-detail-section-icon"></i> Preferred Qualifications
                    </h2>
                    <ul className="job-detail-requirements-list">
                      {job.qualifications?.map((item, index) => (
                        <li key={index} className="job-detail-list-item">{item}</li>
                      )) || <li className="job-detail-list-item">No qualifications listed.</li>}
                    </ul>
                  </div>
                  
                  {/* Benefits */}
                  <div className="job-detail-section">
                    <h2 className="job-detail-section-title">
                      <i className="fas fa-gift job-detail-section-icon"></i> What We Offer
                    </h2>
                    <ul className="job-detail-benefits-list">
                      {job.offers?.map((item, index) => (
                        <li key={index} className="job-detail-list-item">{item}</li>
                      )) || <li className="job-detail-list-item">No benefits listed.</li>}
                    </ul>
                  </div>
                  
                  {/* Company Overview - Additional Section */}
                  <div className="job-detail-section">
                    <h2 className="job-detail-section-title">
                      <i className="fas fa-building job-detail-section-icon"></i> About {job.company}
                    </h2>
                    <div className="job-detail-company-overview">
                      <p>
                        {job.companyDescription || 
                          `${job.company} is a leading organization in its field, committed to innovation, 
                          excellence, and creating a positive impact. Join our team to be part of a dynamic 
                          and inclusive workplace where your skills can thrive and your career can grow.`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Apply CTA at bottom */}
                  <div className="job-detail-apply-cta">
                    <div className="job-detail-apply-cta-content">
                      <h3>Ready to join our team?</h3>
                      <p>Don't miss this opportunity to be part of something great</p>
                    </div>
                    <button onClick={onApply} className="job-detail-apply-button-large">
                      Apply Now <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loading component
function JobDetailSkeleton() {
  return (
    <div className="job-detail-container">
      <div className="job-detail-header skeleton-header">
        <div className="skeleton-button"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-company"></div>
        
        <div className="job-detail-info">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton-info-item"></div>
          ))}
        </div>
        
        <div className="job-detail-actions">
          <div className="skeleton-button-large"></div>
          <div className="skeleton-button-medium"></div>
        </div>
        
        <div className="job-detail-navigation">
          <div className="skeleton-nav-buttons"></div>
        </div>
      </div>
      
      <div className="job-detail-content">
        {[...Array(4)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="job-detail-section">
            <div className="skeleton-section-title"></div>
            {sectionIndex === 0 ? (
              // Description section
              <>
                <div className="skeleton-text-line"></div>
                <div className="skeleton-text-line"></div>
                <div className="skeleton-text-line" style={{ width: '75%' }}></div>
                
                <div className="skeleton-tags">
                  {[...Array(4)].map((_, tagIndex) => (
                    <div key={tagIndex} className="skeleton-tag"></div>
                  ))}
                </div>
              </>
            ) : (
              // List sections
              <div className="skeleton-list">
                {[...Array(4)].map((_, itemIndex) => (
                  <div key={itemIndex} className="skeleton-list-item"></div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div className="skeleton-apply-cta"></div>
      </div>
    </div>
  );
}

export default JobDetail;