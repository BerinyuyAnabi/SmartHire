import "../css/ApplicantDetails.css";

function ApplicantDetails() {
  return (
    <div className="applicant-details">
      <div className="applicant-detail">
        <h2 className="applicant-name">John Doe</h2>
        <p className="applicant-score">Score: 85%</p>
        <button className="view-more-btn">View More</button>
      </div>

      <div className="applicant-detail">
        <h2 className="applicant-name">Jane Smith</h2>
        <p className="applicant-score">Score: 92%</p>
        <button className="view-more-btn">View More</button>
      </div>

      <div className="applicant-detail">
        <h2 className="applicant-name">Michael Brown</h2>
        <p className="applicant-score">Score: 78%</p>
        <button className="view-more-btn">View More</button>
      </div>
    </div>
  );
}

export default ApplicantDetails;
