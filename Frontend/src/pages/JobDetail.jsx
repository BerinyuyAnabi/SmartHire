// import React, { useState } from "react";
// import SearchTab from "../components/SearchTab";
// import "../css/JobDetail.css";
// import { jobData } from "../data/jobposting";

// function JobDetails({ initialJob, onBack, onApply }) {
//   const initialIndex = jobData.findIndex(
//     (job) => job.jobName === initialJob?.jobName
//   );
//   const [currentIndex, setCurrentIndex] = useState(
//     initialIndex >= 0 ? initialIndex : 0
//   );

//   const navigateJobPosting = (direction) => {
//     let newIndex = currentIndex;
//     if (direction === "prev" && currentIndex > 0) {
//       newIndex--;
//     } else if (direction === "next" && currentIndex < jobData.length - 1) {
//       newIndex++;
//     }
//     setCurrentIndex(newIndex);
//   };

//   const job = jobData[currentIndex];

//   return (
//     <div className="smart-hire-container">
//       <SearchTab />
//       <main className="job-board">
//         <h2 >
//           Job Postings
//         </h2>

//         <h2 onClick={onBack} style={{ cursor: "pointer" }}>back</h2>

//         <div className="job-details-content">
//           <div className="job-header-container">
//             <div className="job-title-wrapper">
//               <h3>{job?.jobName || "Job Title"}</h3>
//               <div className="arrow-buttons">
//                 <button
//                   onClick={() => navigateJobPosting("prev")}
//                   disabled={currentIndex === 0}
//                   aria-label="Previous Job"
//                 >
//                   ←
//                 </button>
//                 <button
//                   onClick={() => navigateJobPosting("next")}
//                   disabled={currentIndex === jobData.length - 1}
//                   aria-label="Next Job"
//                 >
//                   →
//                 </button>
//               </div>
//             </div>
//             <h5 className="company-name">{job?.company || "Company Name"}</h5>
//           </div>

//           <div className="ap-btn-container">
//             <button className="butn apply-btn" onClick={onApply}>
//               Apply
//             </button>
//             <button className="butn save-btn">Save</button>
//           </div>

//           <div className="jb-detail">
//             <span className="d-flex align-items-center">
//               <img
//                 src="static/images/applied.png" 
//                 alt="" 
//                 className="me-1" 
//                 width="16" 
//                 height="16" 
//               />
//               {job?.applicants || 0} applicants</span>


//             <span className="d-flex align-items-center">
//               <img 
//                 src="static/images/salary.png" 
//                 alt="" 
//                 className="me-1" 
//                 width="16" 
//                 height="16" 
//               />
//               {job?.salary || "N/A"}</span>

//             <span className="d-flex align-items-center">
//                 <img 
//                   src="static/images/qualifications.png" 
//                   alt="" 
//                   className="me-1" 
//                   width="16" 
//                   height="16" 
//                 />
//               {job?.type || "N/A"}
//             </span>


//             <span className="d-flex align-items-center">
//                 <img 
//                   src="static/images/remote.png" 
//                   alt="" 
//                   className="me-1" 
//                   width="16" 
//                   height="16" 
//                 />
//                 {job?.remote ? "Remote" : "On-site"}
//             </span>


//             <span className="d-flex align-items-center">
//               <img 
//                 src="static/images/location.png" 
//                 alt="" 
//                 className="me-1" 
//                 width="16" 
//                 height="16" 
//               />
//               {job?.location || "N/A"}
//             </span>

//           </div>

//           <div className="content">
//             <div className="section">
//               <h5>Responsibilities</h5>
//               <ul>
//                 {job?.responsibilities?.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 )) || <li>No responsibilities listed.</li>}
//               </ul>
//             </div>

//             <div className="section">
//               <h5>Preferred Qualifications</h5>
//               <ul>
//                 {job?.qualifications?.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 )) || <li>No qualifications listed.</li>}
//               </ul>
//             </div>

//             <div className="section">
//               <h5>What We Offer</h5>
//               <ul>
//                 {job?.offers?.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 )) || <li>No offers listed.</li>}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default JobDetails;


import React, { useState, useEffect } from "react";
import SearchTab from "../components/SearchTab";
import "../css/JobDetail.css";
import { jobData } from "../data/jobposting";

function JobDetails({ initialJob, onBack, onApply }) {
  // Dynamically load Bootstrap CSS from CDN if not already loaded
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
    
    // Load Bootstrap Icons
    if (!document.getElementById('bootstrap-icons')) {
      const iconsLink = document.createElement('link');
      iconsLink.id = 'bootstrap-icons';
      iconsLink.rel = 'stylesheet';
      iconsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
      document.head.appendChild(iconsLink);
    }
  }, []);

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
    <div className="smart-hire-container container-fluid">
      <div className="row g-4">
        <div className="col-lg-3">
          <SearchTab />
        </div>
        
        <main className="job-board col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Job Postings</h2>
            <button 
              onClick={onBack} 
              className="btn btn-link text-dark fw-bold p-0 back-button"
            >
              <i className="bi bi-arrow-left me-2"></i>Back
            </button>
          </div>

          <div className="job-details-content">
            <div className="job-header-container">
              <div className="job-title-wrapper row align-items-center">
                <div className="col-md-8">
                  <h3 className="mb-1">{job?.jobName || "Job Title"}</h3>
                  <h5 className="company-name mb-0">{job?.company || "Company Name"}</h5>
                </div>
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <div className="arrow-buttons">
                    {/* Replace buttons with clickable images */}
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
                Apply
              </button>
              <button className="butn save-btn">
                <i className="bi bi-bookmark me-1"></i>Save
              </button>
            </div>

            <div className="jb-detail row row-cols-2 row-cols-md-3 row-cols-lg-5 gx-4 gy-2">
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
                <h5 className="section-title">Responsibilities</h5>
                <ul className="responsibility-list">
                  {job?.responsibilities?.map((item, index) => (
                    <li key={index}>{item}</li>
                  )) || <li>No responsibilities listed.</li>}
                </ul>
              </div>

              <div className="section">
                <h5 className="section-title">Preferred Qualifications</h5>
                <ul className="qualification-list">
                  {job?.qualifications?.map((item, index) => (
                    <li key={index}>{item}</li>
                  )) || <li>No qualifications listed.</li>}
                </ul>
              </div>

              <div className="section">
                <h5 className="section-title">What We Offer</h5>
                <ul className="offers-list">
                  {job?.offers?.map((item, index) => (
                    <li key={index}>{item}</li>
                  )) || <li>No offers listed.</li>}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default JobDetails;