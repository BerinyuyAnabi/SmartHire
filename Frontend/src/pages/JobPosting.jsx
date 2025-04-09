import React, { useState, useEffect } from "react";
import { jobData } from "../data/jobposting";
import "../css/JobPosting.css";
import SearchTab from "../components/SearchTab";
import ApplyPage from "./ApplyPage";
import JobDetail from "./JobDetail"; 



function JobPosting() {
  const [view, setView] = useState("list");
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

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
    
    return () => {
      // Optional: Remove the link when component unmounts
      // const link = document.getElementById('bootstrap-cdn');
      // if (link) document.head.removeChild(link);
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
    <div className="smart-hire-container">
      <SearchTab />
      <main className="job-board">
        <h2 className="mb-4">Job Postings</h2>
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <div className="me-3">
            <select 
              className="form-select rounded-pill" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Jobs</option>
              <option value="remote">Remote</option>
              <option value="full-time">Full-time</option>
            </select>
          </div>
          <div>
            <select 
              className="form-select rounded-pill" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="applicants">Most Applicants</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>

        <div className="job-listings">
          <div className="btn-listings">
            {sortedJobs.map((job) => (
              <div
                key={job.id}
                className="card mb-3 shadow-sm"
                onClick={() => handleJobClick(job)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body d-flex flex-column flex-md-row justify-content-between">
                  <div className="job-content flex-grow-1 mb-3 mb-md-0">
                    <div className="mb-2">
                      <h3 className="fs-5 fw-semibold mb-1">{job.jobName}</h3>
                      <p className="text-secondary mb-2 small">{job.company}</p>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mb-3 small">
                      <span className="d-flex align-items-center">
                        <img 
                          src="static/images/applied.png" 
                          alt="" 
                          className="me-1" 
                          width="16" 
                          height="16" 
                        />
                        {job.applicants} applied
                      </span>
                      <span className="d-flex align-items-center">
                        <img 
                          src="static/images/salary.png" 
                          alt="" 
                          className="me-1" 
                          width="16" 
                          height="16" 
                        />
                        {job.salary} monthly
                      </span>
                      <span className="d-flex align-items-center">
                        <img 
                          src="static/images/qualifications.png" 
                          alt="" 
                          className="me-1" 
                          width="16" 
                          height="16" 
                        />
                        {job.type}
                      </span>
                      <span className="d-flex align-items-center">
                        <img 
                          src="static/images/remote.png" 
                          alt="" 
                          className="me-1" 
                          width="16" 
                          height="16" 
                        />
                        {job.remote}
                      </span>
                      <span className="d-flex align-items-center">
                        <img 
                          src="static/images/location.png" 
                          alt="" 
                          className="me-1" 
                          width="16" 
                          height="16" 
                        />
                        {job.location}
                      </span>
                    </div>

                    <p className="text-secondary small mb-0 job-description" style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {job.description || "No description available"}
                    </p>
                  </div>

                  <div className="d-flex flex-row flex-md-column gap-2" style={{ minWidth: "100px" }}>
                    <button 
                      className="btn btn-dark rounded-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                        handleApplyClick();
                      }}
                    >
                      Apply
                    </button>
                    <button 
                      className="btn btn-outline-dark rounded-pill"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobPosting;