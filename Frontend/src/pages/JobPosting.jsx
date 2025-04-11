import React, { useState, useEffect } from "react";
import "../css/JobPosting.css";
import ApplyPage from "./ApplyPage";
import JobDetail from "./JobDetail"; 
import { jobData } from "../data/jobposting";

function JobPosting() {
  const [view, setView] = useState("list");
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add useEffect to inject Bootstrap CDN link and Font Awesome
  useEffect(() => {
    // Check if the Bootstrap link is already in the document
    if (!document.getElementById('bootstrap-cdn')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    
    // Check if Font Awesome is already in the document
    if (!document.getElementById('fontawesome-cdn')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.id = 'fontawesome-cdn';
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setView("detail");
  };

  const handleApplyClick = () => {
    setView("apply");
  };

  const handleBackToList = () => {
    setView("list");
  };

  const handleBackToDetail = () => {
    setView("detail");
  };

  // Filter and sort jobs
  const filteredJobs = jobData.filter((job) => {
    // Apply search filter
    if (searchTerm && !job.jobName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filter === "all") return true;
    if (filter === "remote") return job.remote.toLowerCase() === "remote";
    if (filter === "full-time") return job.type.toLowerCase() === "full-time";
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sort === "recent") return b.id - a.id;
    if (sort === "applicants") return b.applicants - a.applicants;
    if (sort === "salary") {
      const aSalary = parseInt(a.salary.replace(/[^0-9]/g, ""));
      const bSalary = parseInt(b.salary.replace(/[^0-9]/g, ""));
      return bSalary - aSalary;
    }
    return 0;
  });

  if (view === "detail" && selectedJob) {
    return (
      <JobDetail
        job={selectedJob}
        onBack={handleBackToList}
        onApply={handleApplyClick}
      />
    );
  }

  if (view === "apply" && selectedJob) {
    return <ApplyPage job={selectedJob} onBack={handleBackToDetail} />;
  }

  return (
    <div className="job-posting-wrapper">
      {/* Page Header Section with Background */}
      <div className="job-posting-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="job-posting-title fade-in">
                Discover Your <span className="highlight">Perfect</span> Opportunity
              </h1>
              <p className="job-posting-subtitle fade-in">
                Browse our curated selection of positions powered by AI matching technology
              </p>
            </div>
          </div>
        </div>
        <div className="header-overlay"></div>
      </div>

      <div className="container job-posting-container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Search & Filter Section */}
            <div className="search-filter-section fade-in-up">
              <div className="search-bar-container">
                <div className="row g-3">
                  <div className="col-lg-6 col-md-12">
                    <div className="search-wrapper">
                      <div className="search-icon-wrapper">
                        <i className="fas fa-search"></i>
                      </div>
                      <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search for job titles or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="filter-select-wrapper">
                      <div className="select-icon-wrapper">
                        <i className="fas fa-filter"></i>
                      </div>
                      <select 
                        className="filter-select" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All Jobs</option>
                        <option value="remote">Remote Only</option>
                        <option value="full-time">Full-time</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="filter-select-wrapper">
                      <div className="select-icon-wrapper">
                        <i className="fas fa-sort-amount-down"></i>
                      </div>
                      <select 
                        className="filter-select" 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="recent">Most Recent</option>
                        <option value="applicants">Most Applicants</option>
                        <option value="salary">Highest Salary</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Count */}
            {!isLoading && (
              <div className="job-count-info fade-in">
                <p>{sortedJobs.length} positions found</p>
              </div>
            )}

            {/* Job Listings */}
            <div className="job-listings-container">
              {isLoading ? (
                // Skeleton Loader for Jobs
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="job-card-skeleton fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="job-card-skeleton-header">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-company"></div>
                    </div>
                    <div className="job-card-skeleton-stats">
                      <div className="skeleton-stat"></div>
                      <div className="skeleton-stat"></div>
                      <div className="skeleton-stat"></div>
                    </div>
                    <div className="job-card-skeleton-desc">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                    </div>
                    <div className="job-card-skeleton-footer">
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                ))
              ) : sortedJobs.length === 0 ? (
                <div className="no-jobs-found fade-in">
                  <div className="empty-state-container">
                    <img 
                      src="static/images/no-results.png" 
                      alt="No results" 
                      className="empty-state-image"
                    />
                    <h3 className="empty-state-title">No Matching Positions</h3>
                    <p className="empty-state-text">We couldn't find any positions matching your criteria</p>
                    <button 
                      className="empty-state-button"
                      onClick={() => {
                        setSearchTerm("");
                        setFilter("all");
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              ) : (
                sortedJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="job-card fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="job-card-content">
                      <div className="job-card-header">
                        <h3 className="job-card-title">{job.jobName}</h3>
                        <span className="job-card-company">{job.company}</span>
                      </div>
                      
                      <div className="job-stats">
                        <div className="job-stat">
                          <img src="static/images/applied.png" alt="" className="job-stat-icon" />
                          <span>{job.applicants} applied</span>
                        </div>
                        <div className="job-stat">
                          <img src="static/images/salary.png" alt="" className="job-stat-icon" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="job-stat">
                          <img src="static/images/qualifications.png" alt="" className="job-stat-icon" />
                          <span>{job.type}</span>
                        </div>
                        <div className="job-stat">
                          <img src="static/images/remote.png" alt="" className="job-stat-icon" />
                          <span>{job.remote}</span>
                        </div>
                        <div className="job-stat">
                          <img src="static/images/location.png" alt="" className="job-stat-icon" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      
                      <div className="job-card-description">
                        <p>{job.description || "No description available"}</p>
                      </div>
                      
                      {/* Tags Section */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="job-tags">
                          {job.tags.map((tag, index) => (
                            <span key={index} className="job-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="job-card-actions">
                      <button 
                        className="job-apply-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          handleApplyClick();
                        }}
                      >
                        Apply Now
                      </button>
                      <button className="job-details-button">
                        View Details <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && sortedJobs.length > 0 && (
              <div className="pagination-container fade-in">
                <button className="pagination-button disabled">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="pagination-numbers">
                  <button className="pagination-number active">1</button>
                  <button className="pagination-number">2</button>
                  <button className="pagination-number">3</button>
                </div>
                <button className="pagination-button">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      {!isLoading && sortedJobs.length > 0 && (
        <div className="job-posting-cta">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="cta-title fade-in">Not finding what you're looking for?</h2>
                <p className="cta-text fade-in">Set up job alerts to be notified when new opportunities match your profile</p>
                <button className="cta-button fade-in">
                  Create Job Alert <i className="fas fa-bell ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobPosting;