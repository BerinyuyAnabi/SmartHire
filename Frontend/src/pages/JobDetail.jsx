import React, { useState, useEffect } from "react";
import "../css/JobDetail.css";

function JobDetail({ job: initialJob, onBack, onApply, allJobs }) {
  // Helper function to safely extract text from either string or object items
  function extractText(item, textProperty) {
    if (typeof item === 'string') {
      return item;
    } else if (item && typeof item === 'object' && textProperty in item) {
      return item[textProperty];
    } else {
      return '';
    }
  }

  // Helper function to ensure consistent job structure
  function transformJob(job) {
    if (!job) return null;
    
    return {
      ...job,
      // Transform arrays to ensure they're strings, preserving already-transformed data
      responsibilities: job.responsibilities && Array.isArray(job.responsibilities) 
        ? job.responsibilities.map(r => extractText(r, 'responsibility_text')).filter(Boolean)
        : [],
      qualifications: job.qualifications && Array.isArray(job.qualifications)
        ? job.qualifications.map(q => extractText(q, 'qualification_text')).filter(Boolean)
        : [],
      offers: job.offers && Array.isArray(job.offers)
        ? job.offers.map(o => extractText(o, 'offer_text')).filter(Boolean)
        : []
    };
  }

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

  // If allJobs is not provided, we'll handle the job directly
  const initialIndex = allJobs ? allJobs.findIndex(
    (job) => job.id === initialJob?.id
  ) : 0;

  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  // Modified useEffect to ensure consistent data structure for both direct jobs and navigated jobs
  useEffect(() => {
    // Reset loading state
    setLoading(true);
    
    // If we have the job object passed in, use it
    if (initialJob) {
      let processedJob;
      
      // If we were given an array of jobs, we can navigate through them
      if (allJobs && allJobs.length > 0) {
        const rawJob = allJobs[currentIndex];
        // Transform the job to ensure consistent structure
        processedJob = transformJob(rawJob);
      } else {
        // Transform initialJob to ensure consistent structure
        processedJob = transformJob(initialJob);
      }
      
      console.log('Transformed job data:', {
        responsibilities: processedJob.responsibilities,
        qualifications: processedJob.qualifications,
        offers: processedJob.offers
      });
      
      setJob(processedJob);
      
      // Simulate loading for UI
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // If no job was passed, we need to fetch it
      fetchJobDetails();
    }
  }, [currentIndex, initialJob, allJobs]);

  // Function to fetch job details from API if needed
  const fetchJobDetails = async () => {
    if (!initialJob || !initialJob.id) {
      setError("Job information is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/public/jobs/${initialJob.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      
      // For debugging
      console.log('Raw API response:', data);
      
      // Transform the API data format to match what the component expects
      const transformedJob = {
        id: data.id,
        jobName: data.job_name,
        company: data.company_name,
        salary: data.salary_range || "Competitive salary",
        type: data.type || "Full-time",
        remote: data.remote_type || "Onsite",
        location: data.location || "Not specified",
        description: data.description || "No description available",
        applicants: data.applicants_count || 0,
        
        // Use the same transformation logic
        responsibilities: Array.isArray(data.responsibilities) ? 
          data.responsibilities.map(r => extractText(r, 'responsibility_text')).filter(Boolean) : [],
        qualifications: Array.isArray(data.qualifications) ?
          data.qualifications.map(q => extractText(q, 'qualification_text')).filter(Boolean) : [],
        offers: Array.isArray(data.offers) ?
          data.offers.map(o => extractText(o, 'offer_text')).filter(Boolean) : [],
          
        // Add company description
        companyDescription: data.company_description || null,
        // Add created date
        created_at: data.created_at,
        // Generate tags
        tags: generateTags(data),
      };
      
      // For debugging
      console.log('Transformed job data:', {
        responsibilities: transformedJob.responsibilities,
        qualifications: transformedJob.qualifications,
        offers: transformedJob.offers
      });

      setJob(transformedJob);
      setError(null);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again later.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  // Helper function to generate tags from job properties
  const generateTags = (job) => {
    const tags = [];
    if (job.type) tags.push(job.type);
    if (job.remote_type) tags.push(job.remote_type);

    // Add some skill tags based on qualifications if they exist
    if (job.qualifications && job.qualifications.length > 0) {
      // Extract potential skills from qualifications
      const skillWords = ['JavaScript', 'React', 'Python', 'Java', 'SQL', 'Node.js',
                         'CSS', 'HTML', 'UI/UX', 'Design', 'Leadership',
                         'Communication', 'Marketing', 'Sales'];

      job.qualifications.forEach(qual => {
        const qualText = typeof qual === 'string' ? qual : qual.qualification_text;
        skillWords.forEach(skill => {
          if (qualText && qualText.includes(skill) && !tags.includes(skill)) {
            tags.push(skill);
          }
        });
      });
    }

    // Limit to 5 tags
    return tags.slice(0, 5);
  };

  const navigateJobPosting = (direction) => {
    if (!allJobs || allJobs.length <= 1) return; // No navigation if only one job

    let newIndex = currentIndex;
    if (direction === "prev" && currentIndex > 0) {
      newIndex--;
    } else if (direction === "next" && currentIndex < allJobs.length - 1) {
      newIndex++;
    }
    setCurrentIndex(newIndex);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);

    // Optional: Save bookmark state to localStorage
    const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');

    if (!isBookmarked) {
      // Add to bookmarks
      if (!bookmarkedJobs.includes(job.id)) {
        bookmarkedJobs.push(job.id);
      }
    } else {
      // Remove from bookmarks
      const index = bookmarkedJobs.indexOf(job.id);
      if (index !== -1) {
        bookmarkedJobs.splice(index, 1);
      }
    }

    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
  };

  // Check if job is already bookmarked on component mount
  useEffect(() => {
    if (job && job.id) {
      const bookmarkedJobs = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
      setIsBookmarked(bookmarkedJobs.includes(job.id));
    }
  }, [job]);

  return (
    <div className="job-detail-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {loading ? (
              <JobDetailSkeleton />
            ) : error ? (
              <div className="error-message fade-in">
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                  <button onClick={onBack} className="btn btn-sm btn-outline-danger ms-3">
                    Go Back
                  </button>
                </div>
              </div>
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

                  {allJobs && allJobs.length > 1 && (
                    <div className="job-detail-navigation">
                      <button
                        className={`nav-button ${currentIndex === 0 ? 'disabled' : ''}`}
                        onClick={() => currentIndex > 0 && navigateJobPosting("prev")}
                        disabled={currentIndex === 0}
                      >
                        <i className="fas fa-chevron-left"></i> Previous
                      </button>
                      <span className="job-position-indicator">{currentIndex + 1} / {allJobs.length}</span>
                      <button
                        className={`nav-button ${currentIndex === allJobs.length - 1 ? 'disabled' : ''}`}
                        onClick={() => currentIndex < allJobs.length - 1 && navigateJobPosting("next")}
                        disabled={currentIndex === allJobs.length - 1}
                      >
                        Next <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
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
                      {job.responsibilities && job.responsibilities.length > 0 ?
                        job.responsibilities.map((item, index) => (
                          <li key={index} className="job-detail-list-item">{item}</li>
                        )) : <li className="job-detail-list-item">No responsibilities listed.</li>}
                    </ul>
                  </div>

                  {/* Qualifications */}
                  <div className="job-detail-section">
                    <h2 className="job-detail-section-title">
                      <i className="fas fa-graduation-cap job-detail-section-icon"></i> Preferred Qualifications
                    </h2>
                    <ul className="job-detail-requirements-list">
                      {job.qualifications && job.qualifications.length > 0 ?
                        job.qualifications.map((item, index) => (
                          <li key={index} className="job-detail-list-item">{item}</li>
                        )) : <li className="job-detail-list-item">No qualifications listed.</li>}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="job-detail-section">
                    <h2 className="job-detail-section-title">
                      <i className="fas fa-gift job-detail-section-icon"></i> What We Offer
                    </h2>
                    <ul className="job-detail-benefits-list">
                      {job.offers && job.offers.length > 0 ?
                        job.offers.map((item, index) => (
                          <li key={index} className="job-detail-list-item">{item}</li>
                        )) : <li className="job-detail-list-item">No benefits listed.</li>}
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