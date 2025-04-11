import React, { useState, useEffect } from "react";
import "../css/JobDetail.css";
import { jobData } from "../data/jobposting";

function JobDetails({ initialJob, onBack, onApply }) {
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

  const job = jobData[currentIndex];

  return (
    <div className="smart-hire-container container-fluid">
      <div className="main-content-wrapper mx-auto">
        <div className="row">
          <main className="job-board col-12">
            <div className="d-flex justify-content-between align-items-center mb-4 w-100">
              <h2 className="fw-bold">Job Postings</h2>
              <button 
                onClick={onBack} 
                className="btn btn-link text-dark fw-bold p-0 back-button"
              >
                <i className="fas fa-arrow-left me-2"></i>Back
              </button>
            </div>

            <div className="job-details-content">
              {loading ? (
                <JobDetailsSkeleton />
              ) : (
                <>
                  <div className="job-header-container">
                    <div className="job-title-wrapper row align-items-center">
                      <div className="col-md-8">
                        <h3 className="mb-1">{job?.jobName || "Job Title"}</h3>
                        <h5 className="company-name mb-0">{job?.company || "Company Name"}</h5>
                      </div>
                      <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <div className="arrow-buttons">
                          <img 
                            src="static/images/arrow_circle_left.png" 
                            alt="Previous" 
                            className={`nav-arrow ${currentIndex === 0 ? 'opacity-50' : 'cursor-pointer'}`}
                            onClick={() => currentIndex > 0 && navigateJobPosting("prev")}
                            style={{ cursor: currentIndex > 0 ? 'pointer' : 'default' }}
                            title="Previous job"
                          />
                          <img 
                            src="static/images/arrow_circle_left.png" 
                            alt="Next" 
                            className={`nav-arrow rotate-180 ${currentIndex === jobData.length - 1 ? 'opacity-50' : 'cursor-pointer'}`}
                            onClick={() => currentIndex < jobData.length - 1 && navigateJobPosting("next")}
                            style={{ cursor: currentIndex < jobData.length - 1 ? 'pointer' : 'default' }}
                            title="Next job"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ap-btn-container">
                    <button className="butn apply-btn" onClick={onApply}>
                      <i className="fas fa-paper-plane me-2"></i>Apply
                    </button>
                    <button className="butn save-btn">
                      <i className="fas fa-bookmark me-2"></i>Save
                    </button>
                  </div>

                  <div className="jb-detail row row-cols-2 row-cols-md-3 row-cols-lg-5 gx-4 gy-3">
                    <div className="col">
                      <div className="detail-item">
                        <img
                          src="static/images/applied.png" 
                          alt="" 
                          className="me-2" 
                          width="18" 
                          height="18" 
                        />
                        <span>{job?.applicants || 0} applicants</span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="detail-item">
                        <img 
                          src="static/images/salary.png" 
                          alt="" 
                          className="me-2" 
                          width="18" 
                          height="18" 
                        />
                        <span>{job?.salary || "N/A"}</span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="detail-item">
                        <img 
                          src="static/images/qualifications.png" 
                          alt="" 
                          className="me-2" 
                          width="18" 
                          height="18" 
                        />
                        <span>{job?.type || "N/A"}</span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="detail-item">
                        <img 
                          src="static/images/remote.png" 
                          alt="" 
                          className="me-2" 
                          width="18" 
                          height="18" 
                        />
                        <span>{job?.remote ? "Remote" : "On-site"}</span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="detail-item">
                        <img 
                          src="static/images/location.png" 
                          alt="" 
                          className="me-2" 
                          width="18" 
                          height="18" 
                        />
                        <span>{job?.location || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="content mt-4">
                    <div className="section">
                      <h5 className="section-title-details">Responsibilities</h5>
                      <ul className="responsibility-list">
                        {job?.responsibilities?.map((item, index) => (
                          <li key={index}>{item}</li>
                        )) || <li>No responsibilities listed.</li>}
                      </ul>
                    </div>

                    <div className="section">
                      <h5 className="section-title-details">Preferred Qualifications</h5>
                      <ul className="qualification-list">
                        {job?.qualifications?.map((item, index) => (
                          <li key={index}>{item}</li>
                        )) || <li>No qualifications listed.</li>}
                      </ul>
                    </div>

                    <div className="section">
                      <h5 className="section-title-details">What We Offer</h5>
                      <ul className="offers-list">
                        {job?.offers?.map((item, index) => (
                          <li key={index}>{item}</li>
                        )) || <li>No offers listed.</li>}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Skeleton loading component
function JobDetailsSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="job-header-container">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="skeleton-arrows"></div>
          </div>
        </div>
      </div>

      <div className="skeleton-buttons"></div>

      <div className="jb-detail row row-cols-2 row-cols-md-3 row-cols-lg-5 gx-4 gy-3">
        {[...Array(5)].map((_, i) => (
          <div className="col" key={i}>
            <div className="skeleton-detail-item"></div>
          </div>
        ))}
      </div>

      <div className="content mt-4">
        {[...Array(3)].map((_, i) => (
          <div className="section" key={i}>
            <div className="skeleton-section-title"></div>
            <div className="skeleton-list">
              {[...Array(4)].map((_, j) => (
                <div className="skeleton-list-item" key={j}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobDetails;