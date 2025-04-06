import React, { useState } from "react";
import SearchTab from "../components/SearchTab";
import "../css/JobDetail.css";
import { jobData } from "../data/jobposting";

function JobDetails({ initialJob, onBack, onApply }) {
  const initialIndex = jobData.findIndex(
    (job) => job.jobName === initialJob?.jobName
  );
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

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
    <div className="smart-hire-container">
      <SearchTab />
      <main className="job-board">
        <h2 onClick={onBack} style={{ cursor: "pointer" }}>
          Job Postings
        </h2>

        <div className="job-details-content">
          <div className="job-header-container">
            <div className="job-title-wrapper">
              <h3>{job?.jobName || "Job Title"}</h3>
              <div className="arrow-buttons">
                <button
                  onClick={() => navigateJobPosting("prev")}
                  disabled={currentIndex === 0}
                  aria-label="Previous Job"
                >
                  ←
                </button>
                <button
                  onClick={() => navigateJobPosting("next")}
                  disabled={currentIndex === jobData.length - 1}
                  aria-label="Next Job"
                >
                  →
                </button>
              </div>
            </div>
            <h5 className="company-name">{job?.company || "Company Name"}</h5>
          </div>

          <div className="ap-btn-container">
            <button className="butn apply-btn" onClick={onApply}>
              Apply
            </button>
            <button className="butn save-btn">Save</button>
          </div>

          <div className="jb-detail">
            <span>{job?.applicants || 0} applicants</span>
            <span>{job?.salary || "N/A"}</span>
            <span>{job?.type || "N/A"}</span>
            <span>{job?.remote ? "Remote" : "On-site"}</span>
            <span>{job?.location || "N/A"}</span>
          </div>

          <div className="content">
            <div className="section">
              <h5>Responsibilities</h5>
              <ul>
                {job?.responsibilities?.map((item, index) => (
                  <li key={index}>{item}</li>
                )) || <li>No responsibilities listed.</li>}
              </ul>
            </div>

            <div className="section">
              <h5>Preferred Qualifications</h5>
              <ul>
                {job?.qualifications?.map((item, index) => (
                  <li key={index}>{item}</li>
                )) || <li>No qualifications listed.</li>}
              </ul>
            </div>

            <div className="section">
              <h5>What We Offer</h5>
              <ul>
                {job?.offers?.map((item, index) => (
                  <li key={index}>{item}</li>
                )) || <li>No offers listed.</li>}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;
