import React, { useState } from "react";
import SearchTab from "../components/SearchTab";
import "../css/ApplyPage.css"; 
import { useNavigate } from "react-router-dom";

function ApplyPage({ job, onBack }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    countryCode: "+1",
    phone: "",
    cv: null,
    coverLetter: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Application submitted!");
    onBack();
  };

  const handleContinue = (e) => {
    e.preventDefault();
    console.log("Form data:", formData)
    try{
    navigate('/assessment', { 
      state: { 
        formData: formData, 
        jobDetails: job 
      } 
    });}
    catch(error){
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="smart-hire-container">
      <SearchTab />
      <main className="job-board">
        <h2 onClick={onBack} style={{ cursor: "pointer" }}>
          Job Postings
        </h2>

        <div className="apply-page-content">
          <div className="apply-header">
            <h3>{job.jobName}</h3>
            <h4 className="company-name">{job.company}</h4>
          </div>

          <p className="section-title">General Information</p>

          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-grid">
              <div className="form-section">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                      />
                      Male
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                      />
                      Female
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <div className="phone-input">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                    >
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+91">+91 (IN)</option>
                      <option value="+233">+91 (GH)</option>

                    </select>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="documents-section">
              <p className="section-title">Documents</p>
              <p className="file-info">
                Upload 1 supported PDF or Word. Max 100MB
              </p>

              <div className="file-upload-group">
                <div className="file-upload">
                  <label>CV*</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="file-upload">
                  <label>Cover Letter*</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      name="coverLetter"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              {/* <button type="button" className="cancel-btn" onClick={onBack}>
                Cancel
              </button> */}
              <button type="" className="continue-btn" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ApplyPage;
