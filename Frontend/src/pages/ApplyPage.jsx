import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ApplyPage({ job, onBack }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    
    // Add custom CSS variables
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --primary: #122331;
        --secondary: #0f5858;
        --accent: #01a0a0;
        --white: #ffffff;
        --light-gray: #f8f9fa;
        --medium-gray: #e9ecef;
        --text-gray: #6c757d;
        --dark-gray: #495057;
        --card-bg: #fdfdfd;
        --body-bg: #f5f7f9;
        --border-color: #eaeef3;
        --hover-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
        --transition: all 0.25s ease-in-out;
      }
      
      body {
        background-color: var(--body-bg);
        color: var(--dark-gray);
      }
      
      .smart-hire-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
      
      .job-board {
        padding: 1rem;
      }
      
      .job-board h2 {
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 1.5rem;
        display: inline-block;
      }
      
      .form-card {
        background: var(--card-bg);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
        transition: var(--transition);
        padding: 2rem;
        margin-bottom: 2rem;
        width: 100%;
      }
      
      .form-card:hover {
        box-shadow: var(--hover-shadow);
      }
      
      .section-title {
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 1.5rem;
      }
      
      .form-label {
        color: var(--dark-gray);
        font-weight: 500;
      }
      
      .form-control {
        border: 1px solid var(--border-color);
        padding: 0.75rem 1rem;
        border-radius: 8px;
        transition: var(--transition);
      }
      
      .form-control:focus {
        box-shadow: 0 0 0 3px rgba(1, 160, 160, 0.2);
        border-color: var(--accent);
      }
      
      .btn-primary {
        background-color: var(--accent);
        border-color: var(--accent);
        color: var(--white);
        border-radius: 30px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        transition: var(--transition);
      }
      
      .btn-primary:hover {
        background-color: var(--secondary);
        border-color: var(--secondary);
        transform: translateY(-2px);
      }
      
      .btn-outline {
        background-color: transparent;
        border: 1px solid var(--border-color);
        color: var(--primary);
        border-radius: 30px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        transition: var(--transition);
      }
      
      .btn-outline:hover {
        background-color: var(--light-gray);
        border-color: var(--primary);
      }
      
      .form-check-input:checked {
        background-color: var(--accent);
        border-color: var(--accent);
      }
      
      .job-header {
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 1.5rem;
      }
      
      .job-company {
        color: var(--text-gray);
        font-size: 1rem;
      }
      
      .job-title {
        color: var(--primary);
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .file-upload-wrapper {
        border: 2px dashed var(--border-color);
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        transition: var(--transition);
        cursor: pointer;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .file-upload-wrapper:hover {
        border-color: var(--accent);
      }
      
      .file-upload-wrapper input[type="file"] {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        cursor: pointer;
      }
      
      .file-upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-gray);
      }
      
      .file-upload-label svg {
        margin-bottom: 1rem;
        color: var(--accent);
      }
      
      .action-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
      }
      
      /* Skeleton Loading Styles */
      .skeleton {
        background: linear-gradient(
          90deg,
          var(--medium-gray) 25%,
          var(--light-gray) 37%,
          var(--medium-gray) 63%
        );
        background-size: 400% 100%;
        animation: skeleton-loading 1.4s ease infinite;
      }
      
      @keyframes skeleton-loading {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }
      
      .skeleton-text {
        height: 12px;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      
      .skeleton-title {
        height: 24px;
        margin-bottom: 12px;
        border-radius: 4px;
        width: 40%;
      }
      
      .skeleton-input {
        height: 48px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
      
      .skeleton-button {
        height: 48px;
        width: 150px;
        border-radius: 30px;
      }
      
      .skeleton-file {
        height: 140px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
    `;
    document.head.appendChild(style);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Country codes data
  const [countryCodes, setCountryCodes] = useState([
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+233", country: "GH" }
  ]);

  // Fetch country codes from API
  useEffect(() => {
    // This function would fetch country codes from an API
    const fetchCountryCodes = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
        // const data = await response.json();
        
        // Process the data to get country codes
        // const codes = data.map(country => ({
        //   code: country.idd.root + (country.idd.suffixes?.[0] || ""),
        //   country: country.name.common
        // })).filter(item => item.code);
        
        // setCountryCodes(codes);
        
        // For now, we'll use the hardcoded values above
        // This comment shows how to implement it with an API
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };
    
    // Uncomment this when you're ready to use the API
    // fetchCountryCodes();
  }, []);

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
    console.log("Form data:", formData);
    try {
      navigate('/assessment', { 
        state: { 
          formData: formData, 
          jobDetails: job 
        } 
      });
    } catch(error) {
      console.error("Navigation error:", error);
    }
  };

  // SVG icons
  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );

  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="form-card">
      <div className="skeleton-title skeleton mb-3"></div>
      <div className="skeleton-text skeleton" style={{width: '25%'}}></div>
      
      <div className="my-5">
        <div className="skeleton-title skeleton mb-4"></div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '20%'}}></div>
            <div className="d-flex gap-4">
              <div className="skeleton-text skeleton" style={{width: '15%'}}></div>
              <div className="skeleton-text skeleton" style={{width: '15%'}}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="my-5">
        <div className="skeleton-title skeleton mb-4"></div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
        </div>
      </div>
      
      <div className="my-5">
        <div className="skeleton-title skeleton mb-4"></div>
        <div className="skeleton-text skeleton" style={{width: '70%'}}></div>
        
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="skeleton-file skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-file skeleton"></div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between mt-5 pt-4" style={{borderTop: '1px solid var(--border-color)'}}>
        <div className="skeleton-button skeleton"></div>
        <div className="skeleton-button skeleton"></div>
      </div>
    </div>
  );

  return (
    <div className="smart-hire-container">
      <main className="job-board">
        <h2 onClick={onBack} style={{ cursor: "pointer" }}>
          Application Portal
        </h2>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="form-card">
            <div className="job-header">
              <h3 className="job-title">{job.jobName}</h3>
              <h4 className="job-company">{job.company}</h4>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <h4 className="section-title">Personal Information</h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderMale"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderMale">
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderFemale"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="section-title">Contact Information</h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Mobile Number</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        style={{ width: "120px", flex: "0 0 auto", borderRadius: "8px 0 0 8px" }}
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        className="form-control"
                        style={{ borderRadius: "0 8px 8px 0" }}
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

              <div className="mb-4">
                <h4 className="section-title">Documents</h4>
                <p className="text-secondary mb-4">
                  Upload 1 supported PDF or Word document per field. Maximum size: 100MB
                </p>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="position-relative file-upload-wrapper">
                      <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        required
                      />
                      <div className="file-upload-label">
                        <UploadIcon />
                        <strong>Upload CV / Resume</strong>
                        <span>{formData.cv ? formData.cv.name : "PDF or Word document"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="position-relative file-upload-wrapper">
                      <input
                        type="file"
                        name="coverLetter"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                      />
                      <div className="file-upload-label">
                        <UploadIcon />
                        <strong>Upload Cover Letter</strong>
                        <span>{formData.coverLetter ? formData.coverLetter.name : "PDF or Word document (optional)"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={onBack}
                >
                  <BackIcon /> Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleContinue}
                >
                  Continue to Assessment
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default ApplyPage;