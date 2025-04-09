// COOL VERSION
// src/pages/Admin.js
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../css/Admin.css";
// import applicants from '../data/applicantData';

// function Admin() {
//   const navigate = useNavigate();
//   const [filter, setFilter] = useState("All");
  
//   // Bootstrap and FontAwesome integration
//   useEffect(() => {
//     // Load Bootstrap CSS
//     if (!document.getElementById('bootstrap-css')) {
//       const bootstrapLink = document.createElement('link');
//       bootstrapLink.id = 'bootstrap-css';
//       bootstrapLink.rel = 'stylesheet';
//       bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
//       bootstrapLink.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
//       bootstrapLink.crossOrigin = 'anonymous';
//       document.head.appendChild(bootstrapLink);
//     }
    
//     // Load FontAwesome
//     if (!document.getElementById('fontawesome-css')) {
//       const faLink = document.createElement('link');
//       faLink.id = 'fontawesome-css';
//       faLink.rel = 'stylesheet';
//       faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
//       document.head.appendChild(faLink);
//     }
//   }, []);

//   const filteredApplicants = filter === "All"
//     ? applicants
//     : applicants.filter(app => app.status === filter);

//   const handleApplicantClick = (applicantId) => {
//     navigate(`/applicant/${applicantId}`);
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       "Rejected": "danger",
//       "Shortlisted": "success",
//       "Interview": "warning"
//     };
    
//     return statusMap[status] || "primary";
//   };

//   return (
//     <div className="admin-container container py-5">
//       <div className="row mb-4">
//         <div className="col">
//           <h2 className="display-6 fw-bold mb-4">Applicant Dashboard</h2>
          
//           <div className="filter-tabs mb-4">
//             <button 
//               className={`filter-btn ${filter === "All" ? 'active' : ''}`} 
//               onClick={() => setFilter("All")}
//             >
//               <i className="fas fa-users me-2"></i>All Applicants
//             </button>
//             <button 
//               className={`filter-btn ${filter === "Shortlisted" ? 'active' : ''}`} 
//               onClick={() => setFilter("Shortlisted")}
//             >
//               <i className="fas fa-star me-2"></i>Shortlisted
//             </button>
//             <button 
//               className={`filter-btn ${filter === "Interview" ? 'active' : ''}`} 
//               onClick={() => setFilter("Interview")}
//             >
//               <i className="fas fa-calendar-check me-2"></i>Interviews
//             </button>
//             <button 
//               className={`filter-btn ${filter === "Rejected" ? 'active' : ''}`} 
//               onClick={() => setFilter("Rejected")}
//             >
//               <i className="fas fa-times-circle me-2"></i>Rejected
//             </button>
//           </div>
//         </div>
//       </div>
      
//       <div className="applicants-list">
//         {filteredApplicants.length === 0 ? (
//           <div className="text-center p-5 bg-light rounded">
//             <i className="fas fa-search fa-3x text-muted mb-3"></i>
//             <h4>No applicants found for this filter</h4>
//           </div>
//         ) : (
//           filteredApplicants.map(applicant => (
//             <div
//               key={applicant.id}
//               className="applicant-card"
//               onClick={() => handleApplicantClick(applicant.id)}
//             >
//               <div className="row g-0 align-items-center">
//                 <div className="col-auto applicant-avatar">
//                   <div className="avatar-container">
//                     <i className="fas fa-user-circle"></i>
//                   </div>
//                 </div>
                
//                 <div className="col applicant-info">
//                   <div className="d-flex justify-content-between align-items-start mb-2">
//                     <h4 className="applicant-name mb-0">
//                       {applicant.name}
//                       {applicant.status && (
//                         <span className={`badge rounded-pill bg-${getStatusBadge(applicant.status)} ms-2`}>
//                           {applicant.status}
//                         </span>
//                       )}
//                     </h4>
//                     <div className="rating">
//                       <i className="fas fa-star text-warning"></i>
//                       <i className="fas fa-star text-warning"></i>
//                       <i className="fas fa-star text-warning"></i>
//                       <i className="fas fa-star-half-alt text-warning"></i>
//                       <i className="far fa-star text-warning"></i>
//                     </div>
//                   </div>
                  
//                   <p className="institution mb-2">
//                     <i className="fas fa-graduation-cap me-2"></i>
//                     {applicant.institution}
//                   </p>
                  
//                   <div className="credentials mb-3">
//                     <span className="credential-item">
//                       <i className="fas fa-briefcase me-1"></i>
//                       {applicant.experience}
//                     </span>
//                     <span className="credential-item">
//                       <i className="fas fa-certificate me-1"></i>
//                       {applicant.qualifications}
//                     </span>
//                     <span className="credential-item">
//                       <i className="fas fa-map-marker-alt me-1"></i>
//                       {applicant.location}
//                     </span>
//                   </div>
                  
//                   <div className="keywords mb-3">
//                     <span className="keywords-label">Keywords:</span>
//                     {applicant.keywords.split(',').map((keyword, idx) => (
//                       <span key={idx} className="keyword-badge">
//                         {keyword.trim()}
//                       </span>
//                     ))}
//                   </div>
                  
//                   <div className="applicant-actions">
//                     <button className="action-btn document-btn">
//                       <i className="fas fa-file-pdf me-2"></i>CV
//                     </button>
//                     <button className="action-btn document-btn outline">
//                       <i className="fas fa-envelope me-2"></i>Cover Letter
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="col-auto decision-actions">
//                   <button className="decision-btn approve">
//                     <i className="fas fa-user-check me-2"></i>Shortlist
//                   </button>
//                   <button className="decision-btn reject">
//                     <i className="fas fa-user-times me-2"></i>Reject
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Admin;


// src/pages/Admin.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Admin.css";
import applicants from '../data/applicantData';

function Admin() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  
  // Bootstrap and FontAwesome integration
  useEffect(() => {
    // Load Bootstrap CSS
    if (!document.getElementById('bootstrap-css')) {
      const bootstrapLink = document.createElement('link');
      bootstrapLink.id = 'bootstrap-css';
      bootstrapLink.rel = 'stylesheet';
      bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      bootstrapLink.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      bootstrapLink.crossOrigin = 'anonymous';
      document.head.appendChild(bootstrapLink);
    }
    
    // Load FontAwesome
    if (!document.getElementById('fontawesome-css')) {
      const faLink = document.createElement('link');
      faLink.id = 'fontawesome-css';
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(faLink);
    }
  }, []);

  const filteredApplicants = filter === "All"
    ? applicants
    : applicants.filter(app => app.status === filter);

  const handleApplicantClick = (applicantId) => {
    navigate(`/applicant/${applicantId}`);
  };

  return (
    <div className="admin-container">
      <h3 className="admin-title">Applicants</h3>
      
      <div className="applicant-navbar">
        <button 
          className={`app-btn ${filter === "All" ? 'active' : ''}`} 
          onClick={() => setFilter("All")}
        >
          <i className="fas fa-users me-2"></i>All
        </button>
        <button 
          className={`app-btn ${filter === "Rejected" ? 'active' : ''}`} 
          onClick={() => setFilter("Rejected")}
        >
          <i className="fas fa-times-circle me-2"></i>Rejected
        </button>
        <button 
          className={`app-btn ${filter === "Shortlisted" ? 'active' : ''}`} 
          onClick={() => setFilter("Shortlisted")}
        >
          <i className="fas fa-star me-2"></i>Shortlisted
        </button>
        <button 
          className={`app-btn ${filter === "Interview" ? 'active' : ''}`} 
          onClick={() => setFilter("Interview")}
        >
          <i className="fas fa-calendar-check me-2"></i>Interviews
        </button>
      </div>
      
      <div className="applicants-wrapper">
        {filteredApplicants.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search fa-2x"></i>
            <p>No applicants found for this filter</p>
          </div>
        ) : (
          filteredApplicants.map(applicant => (
            <div
              key={applicant.id}
              className="applicant"
              onClick={() => handleApplicantClick(applicant.id)}
            >
              <div className="applicant-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              
              <div className="applicant-details">
                <p className="applicant-name">{applicant.name}</p>
                <p className="institution">{applicant.institution}</p>
                
                <div className="credentials">
                  <p className="experience">
                    <i className="fas fa-briefcase me-1"></i> {applicant.experience}
                  </p>
                  <p className="qualifications">
                    <i className="fas fa-certificate me-1"></i> {applicant.qualifications}
                  </p>
                  <p className="location">
                    <i className="fas fa-map-marker-alt me-1"></i> {applicant.location}
                  </p>
                </div>
                
                <p className="keywords">
                  <span>Keywords:</span> {applicant.keywords}
                </p>
                
                <div className="ap-btn">
                  <button>
                    <i className="fas fa-file-pdf me-2"></i>CV
                  </button>
                  <button>
                    <i className="fas fa-envelope me-2"></i>Cover Letter
                  </button>
                </div>
              </div>
              
              <div className="action-buttons">
                <button>
                  <i className="fas fa-user-check me-2"></i>Shortlist
                </button>
                <button>
                  <i className="fas fa-user-times me-2"></i>Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;