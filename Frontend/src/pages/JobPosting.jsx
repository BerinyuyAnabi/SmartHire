import React, { useState, useEffect } from "react";
import "../css/JobPosting.css";
// import SearchTab from "../components/SearchTab";
import ApplyPage from "./ApplyPage";
import JobDetail from "./JobDetail"; 
import { jobData } from "../data/jobposting";

function JobPosting() {
  const [view, setView] = useState("list");
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }, 800);
    
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
    <div className="smart-hire-container-posting fade-in">
      <main className="job-board container" style={{ maxWidth: "1200px" }}>
        <h2 className="mb-4">Job Postings</h2>
        
        {/* Enhanced Search & Filter Section with pill shapes and Font Awesome icons */}
        <div className="search-section mb-4">
          <div className="row g-3">
            <div className="col-lg-6 col-md-6 mb-3">
              <div className="position-relative">
                <div className="search-icon-container">
                  <i className="fas fa-search search-icon"></i>
                </div>
                <input 
                  type="text" 
                  className="form-control search-input" 
                  placeholder="Search for job titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "50px" }}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-6">
              <div className="position-relative pill-select-container">
                <i className="fas fa-filter filter-icon"></i>
                <select 
                  className="form-select pill-select" 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ paddingLeft: "50px" }}
                >
                  <option value="all">All Jobs</option>
                  <option value="remote">Remote</option>
                  <option value="full-time">Full-time</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-6">
              <div className="position-relative pill-select-container">
                <i className="fas fa-sort-amount-down sort-icon"></i>
                <select 
                  className="form-select pill-select" 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  style={{ paddingLeft: "50px" }}
                >
                  <option value="recent">Most Recent</option>
                  <option value="applicants">Most Applicants</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="job-listings">
          {loading ? (
            // Skeleton Loader for Jobs
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="card mb-4 shadow-sm job-card loading-skeleton">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-9">
                      <div className="bg-light rounded" style={{ height: "30px", width: "70%" }}></div>
                      <div className="bg-light rounded mt-2" style={{ height: "20px", width: "40%" }}></div>
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div key={idx} className="bg-light rounded" style={{ height: "20px", width: "80px" }}></div>
                        ))}
                      </div>
                      <div className="bg-light rounded mt-3" style={{ height: "60px", width: "100%" }}></div>
                    </div>
                    <div className="col-md-3">
                      <div className="d-flex flex-column gap-2 mt-3 mt-md-0">
                        <div className="bg-light rounded" style={{ height: "38px", width: "100%" }}></div>
                        <div className="bg-light rounded" style={{ height: "38px", width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : sortedJobs.length === 0 ? (
            <div className="text-center py-5">
              <img 
                src="static/images/no-results.png" 
                alt="No results" 
                style={{ width: "300px", opacity: "0.5", marginBottom: "20px" }}
              />
              <h4>No job postings match your search</h4>
              <p className="text-muted">Try adjusting your search criteria</p>
              <button 
                className="btn btn-apply mt-3" 
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            sortedJobs.map((job) => (
              <div
                key={job.id}
                className="card mb-4 shadow-sm job-card"
                onClick={() => handleJobClick(job)}
              >
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-9 job-content">
                      <h3 className="job-title fs-5">{job.jobName}</h3>
                      <p className="company-name mb-3">{job.company}</p>

                      <div className="d-flex flex-wrap gap-3 mb-3">
                        <span className="job-stat">
                          <img 
                            src="static/images/applied.png" 
                            alt="" 
                            className="stat-icon" 
                          />
                          {job.applicants} applied
                        </span>
                        <span className="job-stat">
                          <img 
                            src="static/images/salary.png" 
                            alt="" 
                            className="stat-icon" 
                          />
                          {job.salary} monthly
                        </span>
                        <span className="job-stat">
                          <img 
                            src="static/images/qualifications.png" 
                            alt="" 
                            className="stat-icon" 
                          />
                          {job.type}
                        </span>
                        <span className="job-stat">
                          <img 
                            src="static/images/remote.png" 
                            alt="" 
                            className="stat-icon" 
                          />
                          {job.remote}
                        </span>
                        <span className="job-stat">
                          <img 
                            src="static/images/location.png" 
                            alt="" 
                            className="stat-icon" 
                          />
                          {job.location}
                        </span>
                      </div>

                      <p className="job-description">
                        {job.description || "No description available"}
                      </p>

                      {/* Tags Section - Optional based on job data */}
                      {job.tags && job.tags.length > 0 && (
                        <div className="mt-3">
                          {job.tags.map((tag, index) => (
                            <span key={index} className="job-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                      
                      <div className="view-more-hint">
                        <span>Click to view details</span>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="d-flex flex-column align-items-center justify-content-center h-100">
                        <button 
                          className="btn btn-apply w-100 mt-3 mt-md-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                            handleApplyClick();
                          }}
                        >
                          <i className="fas fa-paper-plane me-2"></i>Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination - Show only when there are jobs and not loading */}
        {!loading && sortedJobs.length > 0 && (
          <nav aria-label="Page navigation" className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        )}
      </main>
    </div>
  );
}

export default JobPosting;