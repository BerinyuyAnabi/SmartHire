// src/components/ApplicantDetails.js
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import applicants from "../data/applicantData";
import "../css/ApplicantDetails.css";
import "../css/Admin.css";

function ApplicantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const index = applicants.findIndex((app) => app.id === parseInt(id));
    if (index !== -1) {
      setCurrentIndex(index);
      setCurrentApplicant(applicants[index]);
    }
  }, [id]);

  const navigateApplicant = (direction) => {
    let newIndex;
    if (direction === "prev") {
      newIndex = (currentIndex - 1 + applicants.length) % applicants.length;
    } else {
      newIndex = (currentIndex + 1) % applicants.length;
    }
    navigate(`/applicant/${applicants[newIndex].id}`);
  };

  if (!currentApplicant) return <div className="loading">Loading...</div>;

  return (
    <div className="applicant-details-container">
      <div className="arrow-buttons">
        <button onClick={() => navigateApplicant("prev")}>←</button>
        <button onClick={() => navigateApplicant("next")}>→</button>
      </div>

      <div className="applicant-overview">
        <div className="applicant-header">
          <img
            src={`/images/${currentApplicant.id}.jpg`}
            alt={currentApplicant.name}
          />
          <div className="applicant-info">
            <h3>{currentApplicant.name}</h3>
            <p className="institution">{currentApplicant.institution}</p>
            <div className="credentials">
              <p>{currentApplicant.experience}</p>
              <p>{currentApplicant.qualifications}</p>
              <p>{currentApplicant.location}</p>
            </div>
            <div className="social-links">
              {currentApplicant.socials.linkedin && (
                <a
                  href={currentApplicant.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {currentApplicant.socials.twitter && (
                <a
                  href={currentApplicant.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              )}
              {currentApplicant.socials.github && (
                <a
                  href={currentApplicant.socials.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
              {currentApplicant.socials.portfolio && (
                <a
                  href={currentApplicant.socials.portfolio}
                  target="_blank"
                  rel="noreferrer"
                >
                  Portfolio
                </a>
              )}
              <div className="ap-btn">
                <button>CV</button>
                <button>Cover Letter</button>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="applicant-content">
          <div className="section">
            <h4>About</h4>
            <p>{currentApplicant.about}</p>
          </div>

          <div className="section">
            <h4>Tools and Skills</h4>
            <p>{currentApplicant.tools}</p>
          </div>

          <div className="section">
            <h4>Testimonials & Feedback</h4>
            <p>{currentApplicant.testimonials}</p>
          </div>
        </div>
    </div>
  );
}

export default ApplicantDetails;
