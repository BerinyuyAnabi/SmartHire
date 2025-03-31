import React, { useState } from "react";
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
      <SearchTab/>
      <main className="job-board">
        <h2>Job Postings</h2>
        <div className="filter-sort">
          <div className="filter">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Jobs</option>
              <option value="remote">Remote</option>
              <option value="full-time">Full-time</option>
            </select>
          </div>
          <div className="sort">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
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
                className="job-card"
                onClick={() => handleJobClick(job)}
              >
                <div className="job-content">
                  <div className="job-header">
                    <h3>{job.jobName}</h3>
                    <p className="company">{job.company}</p>
                  </div>

                  <div className="job-stats">
                    <span>{job.applicants} applied</span>
                    <span>{job.salary} monthly</span>
                    <span>{job.type}</span>
                    <span>{job.remote}</span>
                    <span>{job.location}</span>
                  </div>

                  <p className="job-description">
                    {job.description || "No description available"}
                  </p>
                </div>

                <div className="job-actions">
                  <button 
                    className="apply-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(job);
                      handleApplyClick();
                    }}
                  >
                    Apply
                  </button>
                  <button 
                    className="save-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Save
                  </button>
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