// src/pages/Admin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Admin.css";
import applicants from '../data/applicantData';

function Admin() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filteredApplicants = filter === "All" 
    ? applicants 
    : applicants.filter(app => app.status === filter);

  const handleApplicantClick = (applicantId) => {
    navigate(`/applicant/${applicantId}`);
  };

  return (
    <div className="admin-container">
      <h3>Applicants</h3>
      <div className="applicant-navbar">
        <button className="app-btn" onClick={() => setFilter("All")}>All</button>
        <button className="app-btn" onClick={() => setFilter("Rejected")}>Rejected</button>
        <button className="app-btn" onClick={() => setFilter("Shortlisted")}>Shortlisted</button>
        <button className="app-btn" onClick={() => setFilter("Interview")}>Interviews</button>
      </div>
      
      {filteredApplicants.map(applicant => (
        <div 
          key={applicant.id} 
          className="applicant"
          onClick={() => handleApplicantClick(applicant.id)}
        >
          <img src={`/images/${applicant.id}.jpg`} alt={applicant.name} />
          <div className="applicant-details">
            <p className="applicant-name">{applicant.name}</p>
            <p className="institution">{applicant.institution}</p>
            <div className="credentials">
              <p className="experience">{applicant.experience}</p>
              <p className="qualifications">{applicant.qualifications}</p>
              <p className="location">{applicant.location}</p>
            </div>
            <p className="keywords">
              <span>Keywords:</span> {applicant.keywords}
            </p>
            <div className="ap-btn">
              <button>CV</button>
              <button>Cover Letter</button>
            </div>
          </div>
          <div className="action-buttons">
            <button>Shortlist</button>
            <button>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;